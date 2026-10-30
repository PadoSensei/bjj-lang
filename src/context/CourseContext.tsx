import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { CourseData, MOCK_COURSES } from '../data/mockCourseData';
import { MOCK_LESSONS } from '../data/mockLessons';
import { progressStorage, DirectionProgressMap } from '../services/storage/progressStorage';
import { reviewStorage, DEFAULT_REVIEWS } from '../services/storage/reviewStorage';
import { historyStorage, DEFAULT_HISTORY } from '../services/storage/historyStorage';
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
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export interface CourseProviderProps {
  children: React.ReactNode;
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
  initialDirection = 'pt-BR->en',
  initialCompletedLessons,
  initialReviewRecords,
  initialHistoryRecords,
}) => {
  const [direction, setDirection] = useState<CourseDirection>(initialDirection);
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
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(!initialCompletedLessons);

  // Load progress, review records, and history from persistent storage on mount if not provided as initial props
  useEffect(() => {
    if (initialCompletedLessons) {
      if (initialReviewRecords) {
        setReviewMap(initialReviewRecords);
      }
      if (initialHistoryRecords) {
        setHistoryMap(initialHistoryRecords);
      }
      setIsLoadingProgress(false);
      return;
    }

    let isMounted = true;
    async function loadStoredData() {
      const [storedProgress, storedReviews, storedHistory] = await Promise.all([
        progressStorage.loadCompletedLessons(),
        reviewStorage.loadReviewRecords(),
        historyStorage.loadHistoryRecords(),
      ]);

      if (isMounted) {
        setCompletedMap(storedProgress);
        setReviewMap(storedReviews);
        setHistoryMap(storedHistory);
        setIsLoadingProgress(false);
      }
    }

    loadStoredData();
    return () => {
      isMounted = false;
    };
  }, [initialCompletedLessons, initialReviewRecords, initialHistoryRecords]);

  const refreshReviews = useCallback(async () => {
    const storedReviews = await reviewStorage.loadReviewRecords();
    setReviewMap(storedReviews);
  }, []);

  const refreshHistory = useCallback(async () => {
    const storedHistory = await historyStorage.loadHistoryRecords();
    setHistoryMap(storedHistory);
  }, []);

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

  const markLessonComplete = useCallback(
    async (lessonId: string): Promise<boolean> => {
      if (!lessonId) return false;

      // Idempotently add to completed map
      setCompletedMap((prevMap) => {
        const currentList = prevMap[direction] || [];
        if (currentList.includes(lessonId)) {
          return prevMap;
        }
        return {
          ...prevMap,
          [direction]: [...currentList, lessonId],
        };
      });

      // Save lesson completion to storage
      const progressResult = await progressStorage.markLessonCompleteInStorage(direction, lessonId);

      // Automatically enqueue vocabulary from completed lesson into review state & storage
      const lessonData = MOCK_LESSONS[lessonId];
      if (lessonData && lessonData.vocabulary && lessonData.vocabulary.length > 0) {
        const currentRecords = reviewMap[direction] || [];
        const existingVocabIds = new Set(currentRecords.map((r) => r.vocabId));
        const newRecords: ReviewRecord[] = [];
        const now = Date.now();

        for (const item of lessonData.vocabulary) {
          if (!existingVocabIds.has(item.id)) {
            newRecords.push({
              id: item.id,
              vocabId: item.id,
              lessonId,
              direction,
              addedAt: now,
              lastReviewedAt: null,
              dueAt: now,
              reviewCount: 0,
              rememberedCount: 0,
              needsPracticeCount: 0,
            });
            existingVocabIds.add(item.id);
          }
        }

        if (newRecords.length > 0) {
          const updatedMap: DirectionReviewMap = {
            ...reviewMap,
            [direction]: [...currentRecords, ...newRecords],
          };
          setReviewMap(updatedMap);
          // Async background save to storage
          reviewStorage.saveReviewRecords(updatedMap).catch((err) => {
            console.warn('Failed to save review records in background:', err);
          });
        }
      }

      return progressResult.success;
    },
    [direction, reviewMap]
  );

  const recordHistoryEntry = useCallback(
    async (vocabId: string, outcome: ReviewOutcome, completedAt: number = Date.now()): Promise<boolean> => {
      const newEntry: ReviewHistoryEntry = {
        id: generateHistoryId(),
        vocabId,
        direction,
        outcome,
        completedAt,
      };

      setHistoryMap((prevMap) => {
        const currentEntries = prevMap[direction] || [];
        return {
          ...prevMap,
          [direction]: [...currentEntries, newEntry],
        };
      });

      try {
        const { success } = await historyStorage.addHistoryEntry(newEntry);
        return success;
      } catch (error) {
        console.warn('Failed to persist history entry:', error);
        return false;
      }
    },
    [direction]
  );

  const recordReviewOutcome = useCallback(
    async (vocabId: string, outcome: ReviewOutcome, nextDueAt: number): Promise<boolean> => {
      const currentList = reviewMap[direction] || [];
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

      const updatedMap: DirectionReviewMap = {
        ...reviewMap,
        [direction]: updatedList,
      };

      setReviewMap(updatedMap);

      // Record scheduling outcome
      const savedReview = await reviewStorage.saveReviewRecords(updatedMap);

      // Also record history entry (fails gracefully without interrupting review flow)
      await recordHistoryEntry(vocabId, outcome, now);

      return savedReview;
    },
    [direction, reviewMap, recordHistoryEntry]
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
