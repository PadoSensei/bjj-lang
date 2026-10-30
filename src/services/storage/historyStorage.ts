import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DirectionHistoryMap,
  DirectionHistorySchema,
  ReviewHistoryEntry,
} from '../../types/history';

export const REVIEW_HISTORY_STORAGE_KEY = 'bjj_lang_review_history_v1';

export const DEFAULT_HISTORY: DirectionHistoryMap = {
  'pt-BR->en': [],
  'en->pt-BR': [],
};

export const historyStorage = {
  /**
   * Load history records for all directions from persistent storage.
   * Returns DEFAULT_HISTORY if no data exists, storage fails, or data is malformed.
   */
  async loadHistoryRecords(): Promise<DirectionHistoryMap> {
    try {
      const jsonString = await AsyncStorage.getItem(REVIEW_HISTORY_STORAGE_KEY);
      if (!jsonString) {
        return {
          'pt-BR->en': [],
          'en->pt-BR': [],
        };
      }

      const parsed = JSON.parse(jsonString);
      const validationResult = DirectionHistorySchema.safeParse(parsed);

      if (!validationResult.success) {
        console.warn('History storage contains malformed data. Resetting to default.');
        return {
          'pt-BR->en': [],
          'en->pt-BR': [],
        };
      }

      return {
        'pt-BR->en': (validationResult.data['pt-BR->en'] as ReviewHistoryEntry[]) || [],
        'en->pt-BR': (validationResult.data['en->pt-BR'] as ReviewHistoryEntry[]) || [],
      };
    } catch (error) {
      console.warn('Failed to load history records from storage:', error);
      return {
        'pt-BR->en': [],
        'en->pt-BR': [],
      };
    }
  },

  /**
   * Save the complete direction history map to persistent storage.
   * Returns true on success, false on failure.
   */
  async saveHistoryRecords(history: DirectionHistoryMap): Promise<boolean> {
    try {
      const sanitized: DirectionHistoryMap = {
        'pt-BR->en': history['pt-BR->en'] || [],
        'en->pt-BR': history['en->pt-BR'] || [],
      };
      await AsyncStorage.setItem(REVIEW_HISTORY_STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (error) {
      console.warn('Failed to save history records to storage:', error);
      return false;
    }
  },

  /**
   * Add a single review history entry preserving existing entries.
   */
  async addHistoryEntry(
    entry: ReviewHistoryEntry
  ): Promise<{ success: boolean; updatedMap: DirectionHistoryMap }> {
    const currentMap = await this.loadHistoryRecords();
    const direction = entry.direction;
    const currentEntries = currentMap[direction] || [];

    const updatedMap: DirectionHistoryMap = {
      ...currentMap,
      [direction]: [...currentEntries, entry],
    };

    const saved = await this.saveHistoryRecords(updatedMap);
    return {
      success: saved,
      updatedMap: saved ? updatedMap : currentMap,
    };
  },

  /**
   * Clear review history storage (useful for testing or resetting).
   */
  async clearHistoryStorage(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(REVIEW_HISTORY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear history storage:', error);
      return false;
    }
  },
};
