import { ReviewHistoryEntry } from '../../types/history';

export interface ReviewStatistics {
  totalAttempts: number;
  rememberedCount: number;
  needsPracticeCount: number;
  distinctVocabCount: number;
  recallAccuracyPercentage: number;
}

/**
 * Derives pure review statistics from a list of review history entries.
 */
export function calculateReviewStatistics(
  entries: ReviewHistoryEntry[]
): ReviewStatistics {
  if (!entries || entries.length === 0) {
    return {
      totalAttempts: 0,
      rememberedCount: 0,
      needsPracticeCount: 0,
      distinctVocabCount: 0,
      recallAccuracyPercentage: 0,
    };
  }

  const totalAttempts = entries.length;
  let rememberedCount = 0;
  let needsPracticeCount = 0;
  const distinctVocab = new Set<string>();

  for (const entry of entries) {
    if (entry.outcome === 'remembered') {
      rememberedCount++;
    } else if (entry.outcome === 'needs-practice') {
      needsPracticeCount++;
    }
    distinctVocab.add(entry.vocabId);
  }

  const rawAccuracy = (rememberedCount / totalAttempts) * 100;
  const recallAccuracyPercentage = Math.round(rawAccuracy);

  return {
    totalAttempts,
    rememberedCount,
    needsPracticeCount,
    distinctVocabCount: distinctVocab.size,
    recallAccuracyPercentage,
  };
}
