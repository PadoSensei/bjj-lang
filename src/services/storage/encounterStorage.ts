import AsyncStorage from '@react-native-async-storage/async-storage';
import { EncounterMap, EncounterMapSchema } from '../../types/encounter';

export const ENCOUNTER_STORAGE_KEY = 'bjj_lang_vocab_encounters_v1';

export const DEFAULT_ENCOUNTERS: EncounterMap = {};

export const encounterStorage = {
  /**
   * Load every word the learner has met, keyed by item ID.
   * Returns an empty map if nothing is stored, storage fails, or the data is malformed.
   */
  async loadEncounters(): Promise<EncounterMap> {
    try {
      const jsonString = await AsyncStorage.getItem(ENCOUNTER_STORAGE_KEY);
      if (!jsonString) {
        return { ...DEFAULT_ENCOUNTERS };
      }

      const validationResult = EncounterMapSchema.safeParse(JSON.parse(jsonString));
      if (!validationResult.success) {
        console.warn('Encounter storage contains malformed data. Resetting to default.');
        return { ...DEFAULT_ENCOUNTERS };
      }
      return validationResult.data;
    } catch (error) {
      console.warn('Failed to load encounters from storage:', error);
      return { ...DEFAULT_ENCOUNTERS };
    }
  },

  /** Save the complete encounter map. Returns true on success, false on failure. */
  async saveEncounters(encounters: EncounterMap): Promise<boolean> {
    try {
      await AsyncStorage.setItem(ENCOUNTER_STORAGE_KEY, JSON.stringify(encounters));
      return true;
    } catch (error) {
      console.warn('Failed to save encounters to storage:', error);
      return false;
    }
  },

  /** Clear encounter storage (useful for testing or resetting). */
  async clearEncounterStorage(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(ENCOUNTER_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear encounter storage:', error);
      return false;
    }
  },
};
