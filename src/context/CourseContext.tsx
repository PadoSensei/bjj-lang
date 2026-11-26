import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { CourseData, MOCK_COURSES } from '../data/mockCourseData';
import { MOCK_LESSONS } from '../data/mockLessons';
import { progressStorage, DirectionProgressMap } from '../services/storage/progressStorage';
import { reviewStorage, DEFAULT_REVIEWS } from '../services/storage/reviewStorage';
import { historyStorage, DEFAULT_HISTORY } from '../services/storage/historyStorage';
import { preferencesStorage } from '../services/storage/preferencesStorage';
import { encounterStorage, DEFAULT_ENCOUNTERS } from '../services/storage/encounterStorage';
import { getLexicalItem } from '../content/registry';
import { addRecords, noteEncounter, planEnqueue } from '../domain/review/enqueue';
import type { EncounterMap, EncounterSource } from '../types/encounter';
import { createWriteQueue, WriteQueue } from '../services/learner/writeQueue';
import { DirectionReviewMap, ReviewOutcome, ReviewRecord } from '../types/review';
import { DirectionHistoryMap, ReviewHistoryEntry } from '../types/history';
import { getDueItems, getNextReviewTimestamp } from '../features/review/reviewScheduler';
import { calculateReviewStatistics, ReviewStatistics } from '../features/review/reviewStatistics';

export interface CourseProgressSummary {
  completedCount: number;
  totalCount: number;
  progress: number;
}

export interface CourseContextType {
  direction: CourseDirection;
  setDirection: (dir: CourseDirection) => void;
  courseData: CourseData;
  completedLessonIds: string[];
  isLessonCompleted: (lessonId: string) => boolean;
  markLessonComplete: (lessonId: string) => Promise<boolean>;
  isLoadingProgress: boolean;
  courseProgress: CourseProgressSummary;

  // Review Queue integration
  reviewMap: DirectionReviewMap;
  activeReviewRecords: ReviewRecord[];
  dueReviewCount: number;
  nextReviewTimestamp: number | null;
  refreshReviews: () => Promise<void>;
  recordReviewOutcome: (vocabId: string, outcome: ReviewOutcome, nextDueAt: number) => Promise<boolean>;

  // Review History integration
  historyMap: DirectionHistoryMap;
  activeHistory: ReviewHistoryEntry[];
  reviewStatistics: ReviewStatistics;
  refreshHistory: () => Promise<void>;
  recordHistoryEntry: (vocabId: string, outcome: ReviewOutcome, completedAt?: number) => Promise<boolean>;

  // Vocabulary encounters (ADR-008, ADR-009)
  /** Every word the learner has met, in any mode, keyed by item ID. */
  encounters: EncounterMap;
  /**
   * Report that the learner met a word. A reviewable word met for the first
   * time gets a card in both flashcard decks. Returns false for unknown IDs.
   */
  recordEncounter: (itemId: string, source: EncounterSource, contentId?: string) => Promise<boolean>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export interface CourseProviderProps {
  children: React.ReactNode;
  /**
   * Start in this direction and ignore the saved preference.
   * When omitted, a real launch restores the learner's last selected direction.
   */
  initialDirection?: CourseDirection;
  initialCompletedLessons?: DirectionProgressMap;
  initialReviewRecords?: DirectionReviewMap;
  initialHistoryRecords?: DirectionHistoryMap;
}

function generateHistoryId(): string {
  return `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  initialDirection,
  initialCompletedLessons,
  initialReviewRecords,
  initialHistoryRecords,
}) => {
  const [direction, setDirectionState] = useState<CourseDirection>(initialDirection ?? 'pt-BR->en');
  // Once the learner picks a direction, a slower-loading saved value must not replace it.
  const hasChosenDirectionRef = useRef(false);
  const [completedMap, setCompletedMap] = useState<DirectionProgressMap>(
    initialCompletedLessons || {
      'pt-BR->en': [],
      'en->pt-BR': [],
    }
  );
  const [reviewMap, setReviewMap] = useState<DirectionReviewMap>(
    initialReviewRecords || DEFAULT_REVIEWS
  );
  const [historyMap, setHistoryMap] = useState<DirectionHistoryMap>(
    initialHistoryRecords || DEFAULT_HISTORY
  );
  const [encounters, setEncounters] = useState<EncounterMap>(DEFAULT_ENCOUNTERS);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(!initialCompletedLessons);

  // Latest committed state, read by writes instead of render-time closures,
  // so a write never starts from a stale snapshot (issue #33).
  const completedMapRef = useRef(completedMap);
  const reviewMapRef = useRef(reviewMap);
  const historyMapRef = useRef(historyMap);
  const encountersRef = useRef(encounters);

  const commitCompletedMap = useCallback((next: DirectionProgressMap) => {
    completedMapRef.current = next;
    setCompletedMap(next);
  }, []);
  const commitReviewMap = useCallback((next: DirectionReviewMap) => {
    reviewMapRef.current = next;
    setReviewMap(next);
  }, []);
  const commitHistoryMap = useCallback((next: DirectionHistoryMap) => {
    historyMapRef.current = next;
    setHistoryMap(next);
  }, []);
  const commitEncounters = useCallback((next: EncounterMap) => {
    encountersRef.current = next;
    setEncounters(next);
  }, []);

  // All writes run one at a time. With no injected state the queue stays closed
  // until stored progress has loaded, so early writes cannot overwrite it.
  const writeQueueRef = useRef<WriteQueue | null>(null);
  if (!writeQueueRef.current) {
    writeQueueRef.current = createWriteQueue({ open: !!initialCompletedLessons });
  }
  const writeQueue = writeQueueRef.current;

  // Load progress, review records, and history from persistent storage on mount if not provided as initial props
  useEffect(() => {
    if (initialCompletedLessons) {
      if (initialReviewRecords) {
        commitReviewMap(initialReviewRecords);
      }
      if (initialHistoryRecords) {
        commitHistoryMap(initialHistoryRecords);
      }
      setIsLoadingProgress(false);
      writeQueue.open();
      return;
    }

    let isMounted = true;
    async function loadStoredData() {
      try {
        const [storedProgress, storedReviews, storedHistory, storedPreferences, storedEncounters] =
          await Promise.all([
            progressStorage.loadCompletedLessons(),
            reviewStorage.loadReviewRecords(),
            historyStorage.loadHistoryRecords(),
            preferencesStorage.loadPreferences(),
            encounterStorage.loadEncounters(),
          ]);

        if (isMounted) {
          commitCompletedMap(storedProgress);
          commitReviewMap(storedReviews);
          commitHistoryMap(storedHistory);
          commitEncounters(storedEncounters);

          const savedDirection = storedPreferences.lastDirection;
          if (!initialDirection && savedDirection && !hasChosenDirectionRef.current) {
            setDirectionState(savedDirection);
          }
        }
      } finally {
        // Writes stay held if we unmounted before loading: running them now
        // would save the empty defaults over the learner's stored progress.
        if (isMounted) {
          setIsLoadingProgress(false);
          writeQueue.open();
        }
      }
    }

    loadStoredData();
    return () => {
      isMounted = false;
    };
  }, [
    initialDirection,
    initialCompletedLessons,
    initialReviewRecords,
    initialHistoryRecords,
    commitCompletedMap,
    commitReviewMap,
    commitHistoryMap,
    commitEncounters,
    writeQueue,
  ]);

  const setDirection = useCallback(
    (next: CourseDirection) => {
      hasChosenDirectionRef.current = true;
      setDirectionState(next);
      // Remember it for the next launch. A failed save keeps the in-memory choice.
      writeQueue.enqueue(() => preferencesStorage.saveLastDirection(next)).catch((error) => {
        console.warn('Failed to remember selected direction:', error);
      });
    },
    [writeQueue]
  );

  const refreshReviews = useCallback(
    () =>
      writeQueue.enqueue(async () => {
        const storedReviews = await reviewStorage.loadReviewRecords();
        commitReviewMap(storedReviews);
      }),
    [writeQueue, commitReviewMap]
  );

  const refreshHistory = useCallback(
    () =>
      writeQueue.enqueue(async () => {
        const storedHistory = await historyStorage.loadHistoryRecords();
        commitHistoryMap(storedHistory);
      }),
    [writeQueue, commitHistoryMap]
  );

  const activeCompletedIds = useMemo(() => {
    return completedMap[direction] || [];
  }, [completedMap, direction]);

  const activeReviewRecords = useMemo(() => {
    return reviewMap[direction] || [];
  }, [reviewMap, direction]);

  const activeHistory = useMemo(() => {
    const entries = historyMap[direction] || [];
    return [...entries].sort((a, b) => b.completedAt - a.completedAt);
  }, [historyMap, direction]);

  const reviewStatistics = useMemo(() => {
    return calculateReviewStatistics(activeHistory);
  }, [activeHistory]);

  const dueReviewRecords = useMemo(() => {
    return getDueItems(activeReviewRecords);
  }, [activeReviewRecords]);

  const dueReviewCount = dueReviewRecords.length;

  const nextReviewTimestamp = useMemo(() => {
    return getNextReviewTimestamp(activeReviewRecords);
  }, [activeReviewRecords]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return activeCompletedIds.includes(lessonId);
    },
    [activeCompletedIds]
  );

  /**
   * Note encounters and add cards for newly met reviewable words, in both decks.
   * Must only be called from inside a queued write. Unknown IDs are skipped.
   */
  const applyEncounters = useCallback(
    async (itemIds: string[], source: EncounterSource, contentId?: string): Promise<boolean> => {
      const now = Date.now();
      let nextEncounters = encountersRef.current;
      let nextDecks = reviewMapRef.current;

      for (const itemId of itemIds) {
        const item = getLexicalItem(itemId);
        if (!item) continue;
        nextEncounters = noteEncounter(nextEncounters, itemId, source, now);
        nextDecks = addRecords(nextDecks, planEnqueue(item, nextDecks, { now, source, contentId }));
      }

      if (nextEncounters === encountersRef.current) {
        return true;
      }

      const decksChanged = nextDecks !== reviewMapRef.current;
      commitEncounters(nextEncounters);
      if (decksChanged) {
        commitReviewMap(nextDecks);
      }

      const [encountersSaved, decksSaved] = await Promise.all([
        encounterStorage.saveEncounters(nextEncounters),
        decksChanged ? reviewStorage.saveReviewRecords(nextDecks) : Promise.resolve(true),
      ]);
      return encountersSaved && decksSaved;
    },
    [commitEncounters, commitReviewMap]
  );

  const recordEncounter = useCallback(
    (itemId: string, source: EncounterSource, contentId?: string): Promise<boolean> => {
      if (!getLexicalItem(itemId)) {
        return Promise.resolve(false);
      }
      return writeQueue.enqueue(() => applyEncounters([itemId], source, contentId));
    },
    [writeQueue, applyEncounters]
  );

  const markLessonComplete = useCallback(
    (lessonId: string): Promise<boolean> => {
      if (!lessonId) return Promise.resolve(false);
      const dir = direction;

      return writeQueue.enqueue(async () => {
        // Idempotently add to completed map
        const completed = completedMapRef.current;
        const currentList = completed[dir] || [];
        if (!currentList.includes(lessonId)) {
          commitCompletedMap({ ...completed, [dir]: [...currentList, lessonId] });
        }

        // Save lesson completion to storage
        const progressResult = await progressStorage.markLessonCompleteInStorage(dir, lessonId);

        // The lesson's words count as encounters: each reviewable word gets a card in both decks (ADR-009).
        const lessonData = MOCK_LESSONS[lessonId];
        if (lessonData && lessonData.vocabulary && lessonData.vocabulary.length > 0) {
          await applyEncounters(
            lessonData.vocabulary.map((item) => item.id),
            'lesson',
            lessonData.id // canonical ID, also for the '-pt' aliases
          );
        }

        return progressResult.success;
      });
    },
    [direction, writeQueue, commitCompletedMap, applyEncounters]
  );

  /** Append a history entry. Must only be called from inside a queued write. */
  const appendHistoryEntry = useCallback(
    async (
      dir: CourseDirection,
      vocabId: string,
      outcome: ReviewOutcome,
      completedAt: number
    ): Promise<boolean> => {
      const newEntry: ReviewHistoryEntry = {
        id: generateHistoryId(),
        vocabId,
        direction: dir,
        outcome,
        completedAt,
      };

      const history = historyMapRef.current;
      commitHistoryMap({ ...history, [dir]: [...(history[dir] || []), newEntry] });

      try {
        const { success } = await historyStorage.addHistoryEntry(newEntry);
        return success;
      } catch (error) {
        console.warn('Failed to persist history entry:', error);
        return false;
      }
    },
    [commitHistoryMap]
  );

  const recordHistoryEntry = useCallback(
    (vocabId: string, outcome: ReviewOutcome, completedAt: number = Date.now()): Promise<boolean> => {
      const dir = direction;
      return writeQueue.enqueue(() => appendHistoryEntry(dir, vocabId, outcome, completedAt));
    },
    [direction, writeQueue, appendHistoryEntry]
  );

  const recordReviewOutcome = useCallback(
    (vocabId: string, outcome: ReviewOutcome, nextDueAt: number): Promise<boolean> => {
      const dir = direction;

      return writeQueue.enqueue(async () => {
        const reviews = reviewMapRef.current;
        const currentList = reviews[dir] || [];
        const existingIndex = currentList.findIndex((r) => r.vocabId === vocabId);

        if (existingIndex === -1) {
          return false;
        }

        const now = Date.now();
        const targetRecord = currentList[existingIndex];
        const updatedRecord: ReviewRecord = {
          ...targetRecord,
          lastReviewedAt: now,
          dueAt: nextDueAt,
          reviewCount: targetRecord.reviewCount + 1,
          rememberedCount: targetRecord.rememberedCount + (outcome === 'remembered' ? 1 : 0),
          needsPracticeCount: targetRecord.needsPracticeCount + (outcome === 'needs-practice' ? 1 : 0),
        };

        const updatedList = [...currentList];
        updatedList[existingIndex] = updatedRecord;
        const updatedMap: DirectionReviewMap = { ...reviews, [dir]: updatedList };

        commitReviewMap(updatedMap);

        // Record scheduling outcome
        const savedReview = await reviewStorage.saveReviewRecords(updatedMap);

        // Also record history entry (fails gracefully without interrupting review flow).
        // Called directly, not re-enqueued: this task already holds the queue.
        await appendHistoryEntry(dir, vocabId, outcome, now);

        return savedReview;
      });
    },
    [direction, writeQueue, commitReviewMap, appendHistoryEntry]
  );

  // Derive dynamic courseData with recalculated unit progress & lesson completion statuses
  const rawCourseData = MOCK_COURSES[direction];

  const courseData: CourseData = useMemo(() => {
    const updatedUnits = rawCourseData.units.map((unit) => {
      const updatedLessons = unit.lessons.map((lesson) => ({
        ...lesson,
        completed: activeCompletedIds.includes(lesson.id),
      }));

      const completedCount = updatedLessons.filter((l) => l.completed).length;
      const totalCount = updatedLessons.length;
      const progress = totalCount > 0 ? completedCount / totalCount : 0;

      return {
        ...unit,
        lessons: updatedLessons,
        progress,
      };
    });

    return {
      ...rawCourseData,
      units: updatedUnits,
    };
  }, [rawCourseData, activeCompletedIds]);

  // Overall course progress summary
  const courseProgress: CourseProgressSummary = useMemo(() => {
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    courseData.units.forEach((unit) => {
      unit.lessons.forEach((lesson) => {
        totalLessonsCount++;
        if (lesson.completed) {
          completedLessonsCount++;
        }
      });
    });

    const progress = totalLessonsCount > 0 ? completedLessonsCount / totalLessonsCount : 0;

    return {
      completedCount: completedLessonsCount,
      totalCount: totalLessonsCount,
      progress,
    };
  }, [courseData]);

  return (
    <CourseContext.Provider
      value={{
        direction,
        setDirection,
        courseData,
        completedLessonIds: activeCompletedIds,
        isLessonCompleted,
        markLessonComplete,
        isLoadingProgress,
        courseProgress,
        reviewMap,
        activeReviewRecords,
        dueReviewCount,
        nextReviewTimestamp,
        refreshReviews,
        recordReviewOutcome,
        historyMap,
        activeHistory,
        reviewStatistics,
        refreshHistory,
        recordHistoryEntry,
        encounters,
        recordEncounter,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
