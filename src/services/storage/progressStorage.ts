import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { CourseDirection } from '../../components/ui/CourseDirectionSelector';

export const PROGRESS_STORAGE_KEY = 'bjj_lang_completed_lessons_v1';

export interface DirectionProgressMap {
  'pt-BR->en': string[];
  'en->pt-BR': string[];
}

export const DEFAULT_PROGRESS: DirectionProgressMap = {
  'pt-BR->en': [],
  'en->pt-BR': [],
};

const ProgressSchema = z.object({
  'pt-BR->en': z.array(z.string()).optional().transform((arr) => arr ?? []),
  'en->pt-BR': z.array(z.string()).optional().transform((arr) => arr ?? []),
});

export const progressStorage = {
  /**
   * Load completed lesson IDs for each direction from persistent storage.
   * Returns DEFAULT_PROGRESS if no data exists, storage fails, or data is malformed.
   */
  async loadCompletedLessons(): Promise<DirectionProgressMap> {
    try {
      const jsonString = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!jsonString) {
        return { ...DEFAULT_PROGRESS };
      }

      const parsed = JSON.parse(jsonString);
      const validationResult = ProgressSchema.safeParse(parsed);

      if (!validationResult.success) {
        console.warn('Progress storage contain malformed data. Resetting to default.');
        return { ...DEFAULT_PROGRESS };
      }

      // Ensure unique lesson IDs in each direction array
      return {
        'pt-BR->en': Array.from(new Set(validationResult.data['pt-BR->en'])),
        'en->pt-BR': Array.from(new Set(validationResult.data['en->pt-BR'])),
      };
    } catch (error) {
      console.warn('Failed to load completed lessons from storage:', error);
      return { ...DEFAULT_PROGRESS };
    }
  },

  /**
   * Save the complete direction progress map to persistent storage.
   * Returns true on success, false on failure.
   */
  async saveCompletedLessons(progress: DirectionProgressMap): Promise<boolean> {
    try {
      const sanitized: DirectionProgressMap = {
        'pt-BR->en': Array.from(new Set(progress['pt-BR->en'] || [])),
        'en->pt-BR': Array.from(new Set(progress['en->pt-BR'] || [])),
      };
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (error) {
      console.warn('Failed to save completed lessons to storage:', error);
      return false;
    }
  },

  /**
   * Idempotently mark a single lesson as complete for a specific direction.
   */
  async markLessonCompleteInStorage(
    direction: CourseDirection,
    lessonId: string
  ): Promise<{ success: boolean; updatedProgress: DirectionProgressMap }> {
    const currentProgress = await this.loadCompletedLessons();

    const currentDirectionLessons = currentProgress[direction] || [];
    if (currentDirectionLessons.includes(lessonId)) {
      return { success: true, updatedProgress: currentProgress };
    }

    const updatedProgress: DirectionProgressMap = {
      ...currentProgress,
      [direction]: [...currentDirectionLessons, lessonId],
    };

    const saved = await this.saveCompletedLessons(updatedProgress);
    return {
      success: saved,
      updatedProgress: saved ? updatedProgress : currentProgress,
    };
  },

  /**
   * Clear progress storage (useful for testing or resetting).
   */
  async clearProgressStorage(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear progress storage:', error);
      return false;
    }
  },
};
