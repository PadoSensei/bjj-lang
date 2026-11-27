import {
  getExercise,
  getLexicalItem,
  getScenario,
  getStory,
  listByBelt,
  validateRegistry,
} from '../../src/content/registry';
import { CONTENT_PACKS, buildPackEntries } from '../../src/content/packs';
import { countWords, splitSentences } from '../../src/domain/content/validate';
import lesson11 from '../../content/curriculum/units/unit-1/lesson-1-1.json';

/** White Belt "My first class" pack (issue #41). */
const pack = CONTENT_PACKS.find((p) => p.id === 'white-first-class')!;

const REUSED = [
  'vocab-1-1-1', // OSS
  'vocab-1-1-3', // Excuse me
  'vocab-1-2-1', // Stop
  'vocab-1-2-3', // Tap
  'vocab-1-3-1', 'vocab-1-3-2', 'vocab-1-3-3', 'vocab-1-3-4', 'vocab-1-3-5', // One to Five
  'vocab-1-3-6', // Yes
  'vocab-1-3-7', // No
];
const NEW = ['vocab-white-teacher', 'vocab-white-partner', 'vocab-white-my-name-is', 'vocab-white-again'];
const PACK_ITEMS = [...REUSED, ...NEW];

const storyItemIds = () =>
  new Set(getStory('story-white-first-class')!.pages.flatMap((p) => p.tokens.flatMap((t) => (t.itemId ? [t.itemId] : []))));
const exerciseItemIds = () =>
  new Set(pack.exercises.flatMap((e) => e.itemIds ?? []));
const scenarioItemIds = () =>
  new Set(
    Object.values(getScenario('scn-white-first-class')!.nodes).flatMap((n) => n.choices.flatMap((c) => c.itemIds))
  );

describe('White Belt "My first class" pack', () => {
  it('is loaded into the content registry', () => {
    expect(pack).toBeDefined();
    expect(getStory('story-white-first-class')).toBeDefined();
    expect(getScenario('scn-white-first-class')).toBeDefined();
    for (const id of NEW) expect(getLexicalItem(id)).toBeDefined();
    for (const exercise of pack.exercises) expect(getExercise(exercise.id)).toEqual(exercise);
  });

  it('leaves the registry with no validation issues (links, levels, adventure structure)', () => {
    expect(validateRegistry().map((i) => `${i.code} in ${i.contentId}: ${i.message}`)).toEqual([]);
  });

  it('reuses the existing Unit 1 words without changing their text', () => {
    const before = lesson11.vocabulary[0];
    expect(getLexicalItem('vocab-1-1-1')).toMatchObject(before);
  });

  it('gives every pack word a Portuguese explanation and keeps it White Belt', () => {
    for (const id of PACK_ITEMS) {
      const item = getLexicalItem(id)!;
      expect({ id, belt: item.belt, hasSupportPt: !!item.support?.pt?.trim() }).toEqual({ id, belt: 'white', hasSupportPt: true });
    }
    expect(listByBelt('white').length).toBe(15 + NEW.length);
  });

  it('uses every pack word in at least two of the three new modes', () => {
    const modes = [storyItemIds(), exerciseItemIds(), scenarioItemIds()];
    for (const id of PACK_ITEMS) {
      expect({ id, modes: modes.filter((m) => m.has(id)).length >= 2 }).toEqual({ id, modes: true });
    }
  });

  it('has a 5-page story with every sentence at 6 words or fewer', () => {
    const story = getStory('story-white-first-class')!;
    expect(story.pages).toHaveLength(5);
    for (const page of story.pages) {
      const text = page.tokens.map((t) => t.text).join(' ');
      for (const sentence of splitSentences(text)) expect(countWords(sentence)).toBeLessThanOrEqual(6);
      expect(page.pt.trim().length).toBeGreaterThan(0);
    }
    expect(story.comprehensionExerciseIds.every((id) => getExercise(id))).toBe(true);
  });

  it('has 2 vocabulary and 2 comprehension exercises, each listing the words it practises', () => {
    expect(pack.exercises).toHaveLength(4);
    const comprehension = new Set(getStory('story-white-first-class')!.comprehensionExerciseIds);
    expect(pack.exercises.filter((e) => comprehension.has(e.id))).toHaveLength(2);
    for (const exercise of pack.exercises) expect(exercise.itemIds?.length).toBeGreaterThan(0);
  });

  it('has an adventure with 3 decisions on the way to a good ending, plus a retry ending', () => {
    const scenario = getScenario('scn-white-first-class')!;
    const endings = Object.values(scenario.nodes).filter((n) => n.ending).map((n) => n.ending);
    expect(endings.sort()).toEqual(['good', 'retry']);

    // Shortest path from the start to the good ending takes 3 choices.
    const depth = new Map<string, number>([[scenario.startNodeId, 0]]);
    const queue = [scenario.startNodeId];
    while (queue.length) {
      const id = queue.shift()!;
      for (const c of scenario.nodes[id].choices) {
        if (!depth.has(c.nextNodeId)) {
          depth.set(c.nextNodeId, depth.get(id)! + 1);
          queue.push(c.nextNodeId);
        }
      }
    }
    const good = Object.keys(scenario.nodes).find((id) => scenario.nodes[id].ending === 'good')!;
    expect(depth.get(good)).toBe(3);
  });

  it('gives every adventure choice Portuguese feedback (wrong choices explain, never dead-end)', () => {
    for (const node of Object.values(getScenario('scn-white-first-class')!.nodes)) {
      for (const choice of node.choices) expect(choice.feedback.pt.trim().length).toBeGreaterThan(0);
    }
  });

  it('marks content reviewed only with a named reviewer', () => {
    const all = [
      ...PACK_ITEMS.map((id) => getLexicalItem(id)!.review),
      getStory('story-white-first-class')!.review,
      getScenario('scn-white-first-class')!.review,
    ];
    for (const review of all) {
      if (review.status === 'reviewed') expect(review.reviewer?.trim()).toBeTruthy();
    }
  });
});

describe('buildPackEntries', () => {
  const lookup = (id: string) => getLexicalItem(id);
  const empty = { id: 'test-pack', items: [], annotations: [], exercises: [], stories: [], scenarios: [] };

  it('applies an annotation on top of an existing word, keeping its text', () => {
    const { items } = buildPackEntries(
      { ...empty, annotations: [{ id: 'vocab-1-3-6', support: { pt: 'Sim.' }, cefr: 'pre-A1' }] },
      lookup
    );
    expect(items[0]).toMatchObject({ id: 'vocab-1-3-6', termEn: 'Yes', termPt: 'Sim', cefr: 'pre-A1', support: { pt: 'Sim.' } });
  });

  it('refuses an annotation for a word that does not exist, naming the pack', () => {
    expect(() => buildPackEntries({ ...empty, annotations: [{ id: 'vocab-nope', support: { pt: 'x' } }] }, lookup)).toThrow(
      /test-pack.*vocab-nope/
    );
  });

  it('refuses a new word whose ID is already taken', () => {
    const clash = { ...getLexicalItem('vocab-1-3-6')! };
    expect(() => buildPackEntries({ ...empty, items: [clash] }, lookup)).toThrow(/test-pack.*vocab-1-3-6/);
  });
});
