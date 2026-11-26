import { addRecords, noteEncounter, planEnqueue } from '../../src/domain/review/enqueue';
import type { LexicalItem } from '../../src/domain/content/types';
import type { DirectionReviewMap, ReviewRecord } from '../../src/types/review';

const NOW = 1_700_000_000_000;

const item = (overrides: Partial<LexicalItem> = {}): LexicalItem => ({
  id: 'vocab-1-1-1',
  termEn: 'OSS',
  termPt: 'Oss',
  belt: 'white',
  cefr: 'A1',
  reviewable: true,
  sourceLessonId: 'lesson-1-1',
  review: { status: 'draft' },
  ...overrides,
});

const emptyDecks = (): DirectionReviewMap => ({ 'pt-BR->en': [], 'en->pt-BR': [] });

const existing = (direction: ReviewRecord['direction']): ReviewRecord => ({
  id: 'vocab-1-1-1',
  vocabId: 'vocab-1-1-1',
  lessonId: 'lesson-1-1',
  direction,
  addedAt: 1,
  lastReviewedAt: 5,
  dueAt: 99,
  reviewCount: 3,
  rememberedCount: 2,
  needsPracticeCount: 1,
});

describe('planEnqueue (ADR-009: every reviewable encounter fills both decks)', () => {
  it('a new reviewable item gets one fresh, due record in each deck', () => {
    const records = planEnqueue(item(), emptyDecks(), { now: NOW, source: 'reader', contentId: 'story-white-first-class' });

    expect(records.map((r) => r.direction).sort()).toEqual(['en->pt-BR', 'pt-BR->en']);
    for (const record of records) {
      expect(record).toEqual({
        id: 'vocab-1-1-1',
        vocabId: 'vocab-1-1-1',
        lessonId: 'story-white-first-class',
        direction: record.direction,
        addedAt: NOW,
        lastReviewedAt: null,
        dueAt: NOW,
        reviewCount: 0,
        rememberedCount: 0,
        needsPracticeCount: 0,
        source: 'reader',
      });
    }
  });

  it('without a content ID, records point at the item\'s source lesson', () => {
    const [record] = planEnqueue(item(), emptyDecks(), { now: NOW, source: 'game' });
    expect(record.lessonId).toBe('lesson-1-1');
  });

  it('only fills the deck that is missing the item (a learner from before the pivot)', () => {
    const decks: DirectionReviewMap = { 'pt-BR->en': [existing('pt-BR->en')], 'en->pt-BR': [] };
    const records = planEnqueue(item(), decks, { now: NOW, source: 'lesson' });
    expect(records).toHaveLength(1);
    expect(records[0].direction).toBe('en->pt-BR');
  });

  it('adds nothing when both decks already have the item', () => {
    const decks: DirectionReviewMap = { 'pt-BR->en': [existing('pt-BR->en')], 'en->pt-BR': [existing('en->pt-BR')] };
    expect(planEnqueue(item(), decks, { now: NOW, source: 'lesson' })).toEqual([]);
  });

  it('never enqueues an item that is not reviewable', () => {
    expect(planEnqueue(item({ reviewable: false }), emptyDecks(), { now: NOW, source: 'reader' })).toEqual([]);
  });
});

describe('addRecords', () => {
  it('appends records to their own deck without touching existing ones or the input', () => {
    const decks: DirectionReviewMap = { 'pt-BR->en': [existing('pt-BR->en')], 'en->pt-BR': [] };
    const snapshot = JSON.parse(JSON.stringify(decks));
    const added = planEnqueue(item({ id: 'vocab-1-1-2' }), decks, { now: NOW, source: 'lesson' });

    const next = addRecords(decks, added);

    expect(next['pt-BR->en']).toHaveLength(2);
    expect(next['pt-BR->en'][0]).toEqual(existing('pt-BR->en'));
    expect(next['en->pt-BR']).toHaveLength(1);
    expect(decks).toEqual(snapshot);
  });

  it('returns the same map when there is nothing to add', () => {
    const decks = emptyDecks();
    expect(addRecords(decks, [])).toBe(decks);
  });
});

describe('noteEncounter', () => {
  it('records the first encounter', () => {
    expect(noteEncounter({}, 'vocab-1-1-1', 'reader', NOW)).toEqual({
      'vocab-1-1-1': { firstSeenAt: NOW, sources: ['reader'], lookups: 1 },
    });
  });

  it('a repeat adds a new source once and counts every encounter', () => {
    let map = noteEncounter({}, 'vocab-1-1-1', 'reader', NOW);
    map = noteEncounter(map, 'vocab-1-1-1', 'reader', NOW + 1);
    map = noteEncounter(map, 'vocab-1-1-1', 'game', NOW + 2);
    expect(map['vocab-1-1-1']).toEqual({ firstSeenAt: NOW, sources: ['reader', 'game'], lookups: 3 });
  });

  it('does not change the input map', () => {
    const before = noteEncounter({}, 'vocab-1-1-1', 'reader', NOW);
    const snapshot = JSON.parse(JSON.stringify(before));
    noteEncounter(before, 'vocab-1-1-1', 'game', NOW + 1);
    expect(before).toEqual(snapshot);
  });
});
