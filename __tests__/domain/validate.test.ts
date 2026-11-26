import {
  ContentIndex,
  countWords,
  splitSentences,
  validateBeltCeiling,
  validateLesson,
  validateLexicalItem,
  validateScenario,
  validateStory,
  validateUniqueIds,
} from '../../src/domain/content/validate';
import { Belt, LexicalItem, Scenario, Story, ContentLesson } from '../../src/domain/content/types';

/** A tiny fake registry: three items, one exercise. */
const ITEM_BELTS: Record<string, Belt> = {
  'vocab-w-1': 'white',
  'vocab-w-2': 'white',
  'vocab-b-1': 'blue',
};
const index: ContentIndex = {
  getItemBelt: (id) => ITEM_BELTS[id],
  hasExercise: (id) => id === 'ex-w-1',
};

const item = (overrides: Partial<LexicalItem> = {}): LexicalItem => ({
  id: 'vocab-w-1',
  termEn: 'Tap',
  termPt: 'Bater',
  belt: 'white',
  cefr: 'A1',
  reviewable: true,
  support: { pt: 'Bater no parceiro ou no tatame para desistir.' },
  review: { status: 'reviewed', reviewer: 'Test Reviewer' },
  ...overrides,
});

const story = (overrides: Partial<Story> = {}): Story => ({
  id: 'story-white-test',
  belt: 'white',
  title: { en: 'Test', pt: 'Teste' },
  pages: [
    {
      id: 'p1',
      pt: 'Eu bato.',
      tokens: [{ text: 'I' }, { text: 'tap', itemId: 'vocab-w-1' }, { text: '.' }],
    },
  ],
  comprehensionExerciseIds: ['ex-w-1'],
  review: { status: 'draft' },
  ...overrides,
});

/** start -> a -> good ending; start -> b -> retry ending. */
const scenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  id: 'scn-white-test',
  belt: 'white',
  title: { en: 'Test', pt: 'Teste' },
  startNodeId: 'start',
  nodes: {
    start: {
      narrative: { en: 'Your partner says hello.', pt: 'Seu parceiro diz olá.' },
      choices: [
        { id: 'c1', text: 'Hello!', itemIds: ['vocab-w-1'], feedback: { en: 'Nice.', pt: 'Boa.' }, nextNodeId: 'a' },
        { id: 'c2', text: 'Tap.', itemIds: [], feedback: { en: 'Hmm.', pt: 'Hmm.' }, nextNodeId: 'b' },
      ],
    },
    a: { narrative: { en: 'You train.', pt: 'Vocês treinam.' }, ending: 'good', choices: [] },
    b: { narrative: { en: 'Try again.', pt: 'Tente de novo.' }, ending: 'retry', choices: [] },
  },
  review: { status: 'draft' },
  ...overrides,
});

const codes = (issues: { code: string }[]) => issues.map((i) => i.code);

describe('text helpers', () => {
  it('counts words, ignoring punctuation', () => {
    expect(countWords('My name is Ana .')).toBe(4);
    expect(countWords('Slow down, please!')).toBe(3);
    expect(countWords('  ')).toBe(0);
  });

  it('splits sentences on . ! and ?', () => {
    expect(splitSentences('Hello. Ready? Tap!')).toEqual(['Hello.', 'Ready?', 'Tap!']);
    expect(splitSentences('No end mark')).toEqual(['No end mark']);
  });
});

describe('content validators (issue #38)', () => {
  describe('valid fixtures produce no issues', () => {
    it.each([
      ['lexical item', () => validateLexicalItem(item())],
      ['story', () => validateStory(story(), index)],
      ['scenario', () => validateScenario(scenario(), index)],
      [
        'lesson',
        () => validateLesson({ id: 'lesson-w', belt: 'white', itemIds: ['vocab-w-1'], exerciseIds: ['ex-w-1'] }, index),
      ],
    ])('%s', (_name, run) => {
      expect(run()).toEqual([]);
    });

    it('a draft White item without Portuguese support is allowed (not publishable yet)', () => {
      expect(validateLexicalItem(item({ support: undefined, review: { status: 'draft' } }))).toEqual([]);
    });

    it('Purple and above have no sentence-length rule', () => {
      const long = 'one two three four five six seven eight nine ten eleven twelve thirteen.';
      expect(validateStory(story({ belt: 'purple', pages: [{ id: 'p', pt: '', tokens: [{ text: long }] }] }), index)).toEqual([]);
    });
  });

  describe('each broken fixture produces exactly one issue', () => {
    it('dangling item reference in a story', () => {
      const broken = story({ pages: [{ id: 'p1', pt: '', tokens: [{ text: 'Shrimp', itemId: 'vocab-nope' }] }] });
      expect(codes(validateStory(broken, index))).toEqual(['dangling-reference']);
    });

    it('dangling exercise reference in a story', () => {
      expect(codes(validateStory(story({ comprehensionExerciseIds: ['ex-nope'] }), index))).toEqual(['dangling-reference']);
    });

    it('dangling item reference in a scenario choice', () => {
      const s = scenario();
      s.nodes.start.choices[0].itemIds = ['vocab-nope'];
      expect(codes(validateScenario(s, index))).toEqual(['dangling-reference']);
    });

    it('unreachable scenario node', () => {
      const s = scenario();
      s.nodes.orphan = { narrative: { en: 'Nobody gets here.', pt: '' }, ending: 'good', choices: [] };
      expect(codes(validateScenario(s, index))).toEqual(['unreachable-node']);
    });

    it('node with no choices and no ending', () => {
      const s = scenario();
      delete s.nodes.a.ending;
      expect(codes(validateScenario(s, index))).toEqual(['dead-end-node']);
    });

    it('choice pointing to a missing node', () => {
      const s = scenario();
      s.nodes.start.choices[1].nextNodeId = 'nowhere';
      delete s.nodes.b; // otherwise b would also be unreachable
      expect(codes(validateScenario(s, index))).toEqual(['missing-node']);
    });

    it('missing start node', () => {
      expect(codes(validateScenario(scenario({ startNodeId: 'nope' }), index))).toContain('missing-node');
    });

    it('item above its container\'s belt', () => {
      const broken = story({ pages: [{ id: 'p1', pt: '', tokens: [{ text: 'Frame', itemId: 'vocab-b-1' }] }] });
      expect(codes(validateStory(broken, index))).toEqual(['belt-ceiling']);
    });

    it('ID duplicated across kinds', () => {
      expect(codes(validateUniqueIds(['vocab-w-1', 'ex-w-1', 'vocab-w-1']))).toEqual(['duplicate-id']);
    });

    it('White sentence over 6 words', () => {
      const s = scenario();
      s.nodes.start.choices[0].text = 'Hello teacher, my name is Ana today.'; // 7 words
      expect(codes(validateScenario(s, index))).toEqual(['sentence-too-long']);
    });

    it('Blue sentence over 12 words', () => {
      const text = 'Yesterday I rolled with my partner and we trained for a long time.'; // 13 words
      const broken = story({ belt: 'blue', pages: [{ id: 'p1', pt: '', tokens: [{ text }] }] });
      expect(codes(validateStory(broken, index))).toEqual(['sentence-too-long']);
    });

    it('reviewed White item missing Portuguese support', () => {
      expect(codes(validateLexicalItem(item({ support: { en: 'English only' } })))).toEqual(['missing-support-pt']);
    });

    it('lesson referencing an unknown item', () => {
      const lesson: ContentLesson = { id: 'lesson-w', belt: 'white', itemIds: ['vocab-nope'], exerciseIds: [] };
      expect(codes(validateLesson(lesson, index))).toEqual(['dangling-reference']);
    });
  });

  it('every issue names the content and explains itself', () => {
    const [issue] = validateBeltCeiling('story-white-test', 'white', ['vocab-b-1'], index);
    expect(issue).toMatchObject({ code: 'belt-ceiling', contentId: 'story-white-test' });
    expect(issue.message).toMatch(/vocab-b-1/);
    expect(issue.message).toMatch(/blue/);
  });
});
