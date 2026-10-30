import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CourseDirection } from '../../components/ui/CourseDirectionSelector';
import { useCourse } from '../../context/CourseContext';
import { MOCK_LESSONS } from '../../data/mockLessons';
import { VocabularyItem } from '../../types/lesson';
import { ReviewOutcome, ReviewRecord } from '../../types/review';
import {
  calculateNextDueAt,
  formatVocabForReview,
  FormattedReviewItem,
  getDueItems,
} from './reviewScheduler';

export function findVocabItemById(vocabId: string): { vocab: VocabularyItem; lessonId: string } | null {
  for (const lesson of Object.values(MOCK_LESSONS)) {
    if (!lesson.vocabulary) continue;
    const vocab = lesson.vocabulary.find((v) => v.id === vocabId);
    if (vocab) {
      return { vocab, lessonId: lesson.id };
    }
  }
  return null;
}

export interface UseReviewSessionOptions {
  getNow?: () => number;
}

export function useReviewSession(
  direction: CourseDirection,
  options?: UseReviewSessionOptions
) {
  const getNow = options?.getNow || Date.now;
  const { activeReviewRecords, recordReviewOutcome } = useCourse();

  const [sessionQueue, setSessionQueue] = useState<ReviewRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastOutcome, setLastOutcome] = useState<ReviewOutcome | null>(null);
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const activeRecordsRef = useRef(activeReviewRecords);
  activeRecordsRef.current = activeReviewRecords;

  const lastDirectionRef = useRef<CourseDirection | null>(null);

  // Initialize review session queue ONCE when direction changes or on initial mount
  useEffect(() => {
    if (lastDirectionRef.current !== direction) {
      const now = getNow();
      const dueRecords = getDueItems(activeRecordsRef.current, now);
      setSessionQueue(dueRecords);
      setCurrentIndex(0);
      setIsAnswerRevealed(false);
      setIsSubmitted(false);
      setLastOutcome(null);
      setRetryCounts({});
      setIsInitialized(true);
      lastDirectionRef.current = direction;
    }
  }, [direction, getNow]);

  const currentRecord = useMemo(() => {
    if (currentIndex < 0 || currentIndex >= sessionQueue.length) {
      return null;
    }
    return sessionQueue[currentIndex];
  }, [sessionQueue, currentIndex]);

  const currentVocab = useMemo((): FormattedReviewItem | null => {
    if (!currentRecord) return null;
    const lookup = findVocabItemById(currentRecord.vocabId);
    if (!lookup) {
      return null;
    }
    return formatVocabForReview(lookup.vocab, currentRecord.lessonId, direction);
  }, [currentRecord, direction]);

  const revealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
  }, []);

  const submitOutcome = useCallback(
    async (outcome: ReviewOutcome): Promise<boolean> => {
      if (!isAnswerRevealed || isSubmitted || !currentRecord) {
        return false;
      }

      const now = getNow();
      const nextDueAt = calculateNextDueAt(outcome, now);

      setIsSubmitted(true);
      setLastOutcome(outcome);

      // Record outcome in storage/context
      const success = await recordReviewOutcome(currentRecord.vocabId, outcome, nextDueAt);

      // Handle bounded in-session retry for 'needs-practice'
      if (outcome === 'needs-practice') {
        const currentRetries = retryCounts[currentRecord.vocabId] || 0;
        if (currentRetries < 2) {
          setRetryCounts((prev) => ({
            ...prev,
            [currentRecord.vocabId]: currentRetries + 1,
          }));
          // Append item to end of current session queue for extra practice
          setSessionQueue((prevQueue) => [...prevQueue, currentRecord]);
        }
      }

      return success;
    },
    [isAnswerRevealed, isSubmitted, currentRecord, getNow, recordReviewOutcome, retryCounts]
  );

  const nextItem = useCallback(() => {
    if (!isSubmitted) return;
    setCurrentIndex((prev) => prev + 1);
    setIsAnswerRevealed(false);
    setIsSubmitted(false);
    setLastOutcome(null);
  }, [isSubmitted]);

  const isSessionComplete = isInitialized && (sessionQueue.length === 0 || currentIndex >= sessionQueue.length);

  const totalSessionItems = sessionQueue.length;
  const currentStepNumber = Math.min(currentIndex + 1, totalSessionItems);

  return {
    isInitialized,
    sessionQueue,
    currentIndex,
    currentRecord,
    currentVocab,
    isAnswerRevealed,
    isSubmitted,
    lastOutcome,
    isSessionComplete,
    totalSessionItems,
    currentStepNumber,
    revealAnswer,
    submitOutcome,
    nextItem,
  };
}
