import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { CourseData, MOCK_COURSES } from '../data/mockCourseData';
import { progressStorage, DirectionProgressMap } from '../services/storage/progressStorage';

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
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export interface CourseProviderProps {
  children: React.ReactNode;
  initialDirection?: CourseDirection;
  initialCompletedLessons?: DirectionProgressMap;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  initialDirection = 'pt-BR->en',
  initialCompletedLessons,
}) => {
  const [direction, setDirection] = useState<CourseDirection>(initialDirection);
  const [completedMap, setCompletedMap] = useState<DirectionProgressMap>(
    initialCompletedLessons || {
      'pt-BR->en': [],
      'en->pt-BR': [],
    }
  );
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(!initialCompletedLessons);

  // Load progress from persistent storage on mount if not provided as initial prop
  useEffect(() => {
    if (initialCompletedLessons) {
      setIsLoadingProgress(false);
      return;
    }

    let isMounted = true;
    async function loadStoredProgress() {
      const stored = await progressStorage.loadCompletedLessons();
      if (isMounted) {
        setCompletedMap(stored);
        setIsLoadingProgress(false);
      }
    }

    loadStoredProgress();
    return () => {
      isMounted = false;
    };
  }, [initialCompletedLessons]);

  const activeCompletedIds = useMemo(() => {
    return completedMap[direction] || [];
  }, [completedMap, direction]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return activeCompletedIds.includes(lessonId);
    },
    [activeCompletedIds]
  );

  const markLessonComplete = useCallback(
    async (lessonId: string): Promise<boolean> => {
      if (!lessonId) return false;

      // Idempotently add to state
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

      // Save to storage
      const result = await progressStorage.markLessonCompleteInStorage(direction, lessonId);
      return result.success;
    },
    [direction]
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
