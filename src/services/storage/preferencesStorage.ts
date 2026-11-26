import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { CourseDirection } from '../../components/ui/CourseDirectionSelector';

export const PREFERENCES_STORAGE_KEY = 'bjj_lang_preferences_v1';

export interface Preferences {
  /** The direction the learner last selected, or null if they never chose one. */
  lastDirection: CourseDirection | null;
}

export const DEFAULT_PREFERENCES: Preferences = {
  lastDirection: null,
};

const PreferencesSchema = z.object({
  lastDirection: z
    .enum(['pt-BR->en', 'en->pt-BR'])
    .nullable()
    .optional()
    .transform((value) => value ?? null),
});

export const preferencesStorage = {
  /**
   * Load learner preferences.
   * Returns DEFAULT_PREFERENCES if nothing is stored, storage fails, or the data is malformed.
   */
  async loadPreferences(): Promise<Preferences> {
    try {
      const jsonString = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!jsonString) {
        return { ...DEFAULT_PREFERENCES };
      }

      const validationResult = PreferencesSchema.safeParse(JSON.parse(jsonString));
      if (!validationResult.success) {
        console.warn('Preferences storage contains malformed data. Resetting to default.');
        return { ...DEFAULT_PREFERENCES };
      }

      return { lastDirection: validationResult.data.lastDirection };
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
      return { ...DEFAULT_PREFERENCES };
    }
  },

  /**
   * Save the complete preferences object.
   * Returns true on success, false on failure.
   */
  async savePreferences(preferences: Preferences): Promise<boolean> {
    try {
      const sanitized: Preferences = { lastDirection: preferences.lastDirection ?? null };
      await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (error) {
      console.warn('Failed to save preferences to storage:', error);
      return false;
    }
  },

  /** Remember the direction the learner selected. Returns true on success. */
  async saveLastDirection(direction: CourseDirection): Promise<boolean> {
    const current = await this.loadPreferences();
    return this.savePreferences({ ...current, lastDirection: direction });
  },

  /** Clear preferences storage (useful for testing or resetting). */
  async clearPreferencesStorage(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(PREFERENCES_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear preferences storage:', error);
      return false;
    }
  },
};
