import { calculateReviewStatistics } from '../../../src/features/review/reviewStatistics';
import { ReviewHistoryEntry } from '../../../src/types/history';

describe('calculateReviewStatistics', () => {
  it('returns zeroes for empty or null history', () => {
    const emptyStats = calculateReviewStatistics([]);
    expect(emptyStats).toEqual({
      totalAttempts: 0,
      rememberedCount: 0,
      needsPracticeCount: 0,
      distinctVocabCount: 0,
      recallAccuracyPercentage: 0,
    });
  });

  it('correctly calculates statistics for a set of history entries', () => {
    const entries: ReviewHistoryEntry[] = [
      {
        id: '1',
        vocabId: 'v1',
        direction: 'pt-BR->en',
        outcome: 'remembered',
        completedAt: 100,
      },
      {
        id: '2',
        vocabId: 'v1',
        direction: 'pt-BR->en',
        outcome: 'remembered',
        completedAt: 200,
      },
      {
        id: '3',
        vocabId: 'v2',
        direction: 'pt-BR->en',
        outcome: 'needs-practice',
        completedAt: 300,
      },
    ];

    const stats = calculateReviewStatistics(entries);
    expect(stats).toEqual({
      totalAttempts: 3,
      rememberedCount: 2,
      needsPracticeCount: 1,
      distinctVocabCount: 2,
      recallAccuracyPercentage: 67, // (2/3) * 100 rounded
    });
  });
});
