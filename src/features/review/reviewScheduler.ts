import { CourseDirection } from '../../components/ui/CourseDirectionSelector';
import { VocabularyItem } from '../../types/lesson';
import { ReviewOutcome, ReviewRecord } from '../../types/review';

export const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours
export const NEEDS_PRACTICE_DELAY_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Checks whether a review record is due for review at the given currentTime.
 */
export function isItemDue(
  record: ReviewRecord,
  currentTime: number = Date.now()
): boolean {
  return record.dueAt <= currentTime;
}

/**
 * Returns all records that are due at currentTime, sorted by dueAt ascending.
 */
export function getDueItems(
  records: ReviewRecord[],
  currentTime: number = Date.now()
): ReviewRecord[] {
  return records
    .filter((r) => isItemDue(r, currentTime))
    .sort((a, b) => a.dueAt - b.dueAt);
}

/**
 * Calculates the next due timestamp based on the learner's recall outcome.
 */
export function calculateNextDueAt(
  outcome: ReviewOutcome,
  currentTime: number = Date.now()
): number {
  if (outcome === 'remembered') {
    return currentTime + ONE_DAY_MS;
  }
  return currentTime + NEEDS_PRACTICE_DELAY_MS;
}

/**
 * Returns the earliest scheduled review timestamp among items that are not yet due,
 * or null if no future items exist.
 */
export function getNextReviewTimestamp(
  records: ReviewRecord[],
  currentTime: number = Date.now()
): number | null {
  const futureItems = records
    .filter((r) => r.dueAt > currentTime)
    .sort((a, b) => a.dueAt - b.dueAt);

  if (futureItems.length === 0) {
    return null;
  }

  return futureItems[0].dueAt;
}

export interface FormattedReviewItem {
  vocabId: string;
  lessonId: string;
  promptTerm: string;
  targetTerm: string;
  phonetic?: string;
  contextText?: string;
}

/**
 * Formats a vocabulary item according to the learning direction for display in the review UI.
 */
export function formatVocabForReview(
  vocab: VocabularyItem,
  lessonId: string,
  direction: CourseDirection
): FormattedReviewItem {
  const isEnToPt = direction === 'en->pt-BR';

  const promptTerm = isEnToPt ? vocab.termEn : vocab.termPt;
  const targetTerm = isEnToPt ? vocab.termPt : vocab.termEn;

  let contextText: string | undefined;
  if (vocab.context) {
    contextText = isEnToPt ? vocab.context.pt : vocab.context.en;
  }

  return {
    vocabId: vocab.id,
    lessonId,
    promptTerm,
    targetTerm,
    phonetic: vocab.phonetic,
    contextText,
  };
}
