import {
  isItemDue,
  getDueItems,
  calculateNextDueAt,
  getNextReviewTimestamp,
  formatVocabForReview,
  ONE_DAY_MS,
  NEEDS_PRACTICE_DELAY_MS,
} from '../../../src/features/review/reviewScheduler';
import { ReviewRecord } from '../../../src/types/review';
import { VocabularyItem } from '../../../src/types/lesson';

describe('reviewScheduler', () => {
  const baseRecord: ReviewRecord = {
    id: 'vocab-1',
    vocabId: 'vocab-1',
    lessonId: 'lesson-1',
    direction: 'pt-BR->en',
    addedAt: 1000,
    lastReviewedAt: null,
    dueAt: 1000,
    reviewCount: 0,
    rememberedCount: 0,
    needsPracticeCount: 0,
  };

  describe('isItemDue', () => {
    test('returns true when dueAt <= currentTime', () => {
      expect(isItemDue({ ...baseRecord, dueAt: 1000 }, 1000)).toBe(true);
      expect(isItemDue({ ...baseRecord, dueAt: 900 }, 1000)).toBe(true);
    });

    test('returns false when dueAt > currentTime', () => {
      expect(isItemDue({ ...baseRecord, dueAt: 1001 }, 1000)).toBe(false);
    });
  });

  describe('getDueItems', () => {
    test('filters and sorts due items by dueAt ascending', () => {
      const records: ReviewRecord[] = [
        { ...baseRecord, id: 'v3', vocabId: 'v3', dueAt: 3000 }, // Not due
        { ...baseRecord, id: 'v2', vocabId: 'v2', dueAt: 1000 }, // Due
        { ...baseRecord, id: 'v1', vocabId: 'v1', dueAt: 500 },  // Due
      ];

      const due = getDueItems(records, 2000);
      expect(due).toHaveLength(2);
      expect(due[0].vocabId).toBe('v1');
      expect(due[1].vocabId).toBe('v2');
    });
  });

  describe('calculateNextDueAt', () => {
    const now = 1_000_000;

    test('"remembered" schedules review 24 hours (1 day) later', () => {
      const nextDue = calculateNextDueAt('remembered', now);
      expect(nextDue).toBe(now + ONE_DAY_MS);
    });

    test('"needs-practice" schedules review 4 hours later', () => {
      const nextDue = calculateNextDueAt('needs-practice', now);
      expect(nextDue).toBe(now + NEEDS_PRACTICE_DELAY_MS);
    });
  });

  describe('getNextReviewTimestamp', () => {
    const now = 1000;

    test('returns earliest future review timestamp when future items exist', () => {
      const records: ReviewRecord[] = [
        { ...baseRecord, id: 'v1', dueAt: 500 },  // Already due
        { ...baseRecord, id: 'v2', dueAt: 5000 }, // Future
        { ...baseRecord, id: 'v3', dueAt: 3000 }, // Future (earlier)
      ];

      const nextTs = getNextReviewTimestamp(records, now);
      expect(nextTs).toBe(3000);
    });

    test('returns null when no future items exist', () => {
      const records: ReviewRecord[] = [
        { ...baseRecord, id: 'v1', dueAt: 500 },
      ];

      const nextTs = getNextReviewTimestamp(records, now);
      expect(nextTs).toBeNull();
    });
  });

  describe('formatVocabForReview', () => {
    const vocab: VocabularyItem = {
      id: 'vocab-1',
      termPt: 'Cumprimentar',
      termEn: 'Bow / Shake hands',
      phonetic: 'koom-pree-men-tahr',
      context: {
        pt: 'Fazer uma reverência antes da luta',
        en: 'To bow before sparring',
      },
    };

    test('formats for pt-BR->en direction', () => {
      const formatted = formatVocabForReview(vocab, 'lesson-1', 'pt-BR->en');
      expect(formatted.promptTerm).toBe('Cumprimentar');
      expect(formatted.targetTerm).toBe('Bow / Shake hands');
      expect(formatted.contextText).toBe('To bow before sparring');
      expect(formatted.phonetic).toBe('koom-pree-men-tahr');
    });

    test('formats for en->pt-BR direction', () => {
      const formatted = formatVocabForReview(vocab, 'lesson-1', 'en->pt-BR');
      expect(formatted.promptTerm).toBe('Bow / Shake hands');
      expect(formatted.targetTerm).toBe('Cumprimentar');
      expect(formatted.contextText).toBe('Fazer uma reverência antes da luta');
    });
  });
});
