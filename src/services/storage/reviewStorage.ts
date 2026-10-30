import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseDirection } from '../../components/ui/CourseDirectionSelector';
import { VocabularyItem } from '../../types/lesson';
import {
  DirectionReviewMap,
  DirectionReviewSchema,
  ReviewOutcome,
  ReviewRecord,
} from '../../types/review';

export const REVIEW_STORAGE_KEY = 'bjj_lang_review_records_v1';

export const DEFAULT_REVIEWS: DirectionReviewMap = {
  'pt-BR->en': [],
  'en->pt-BR': [],
};

export const reviewStorage = {
  /**
   * Load review records for all directions from persistent storage.
   * Returns DEFAULT_REVIEWS if no data exists, storage fails, or data is malformed.
   */
  async loadReviewRecords(): Promise<DirectionReviewMap> {
    try {
      const jsonString = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
      if (!jsonString) {
        return {
          'pt-BR->en': [],
          'en->pt-BR': [],
        };
      }

      const parsed = JSON.parse(jsonString);
      const validationResult = DirectionReviewSchema.safeParse(parsed);

      if (!validationResult.success) {
        console.warn('Review storage contains malformed data. Resetting to default.');
        return {
          'pt-BR->en': [],
          'en->pt-BR': [],
        };
      }

      // Deduplicate records by vocabId per direction
      const deduplicateByVocabId = (records: ReviewRecord[]): ReviewRecord[] => {
        const seen = new Set<string>();
        const result: ReviewRecord[] = [];
        for (const record of records) {
          if (!seen.has(record.vocabId)) {
            seen.add(record.vocabId);
            result.push(record);
          }
        }
        return result;
      };

      return {
        'pt-BR->en': deduplicateByVocabId(validationResult.data['pt-BR->en'] as ReviewRecord[]),
        'en->pt-BR': deduplicateByVocabId(validationResult.data['en->pt-BR'] as ReviewRecord[]),
      };
    } catch (error) {
      console.warn('Failed to load review records from storage:', error);
      return {
        'pt-BR->en': [],
        'en->pt-BR': [],
      };
    }
  },

  /**
   * Save the complete direction review map to persistent storage.
   * Returns true on success, false on failure.
   */
  async saveReviewRecords(reviews: DirectionReviewMap): Promise<boolean> {
    try {
      const sanitized: DirectionReviewMap = {
        'pt-BR->en': reviews['pt-BR->en'] || [],
        'en->pt-BR': reviews['en->pt-BR'] || [],
      };
      await AsyncStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (error) {
      console.warn('Failed to save review records to storage:', error);
      return false;
    }
  },

  /**
   * Idempotently enqueue missing vocabulary items from a completed lesson.
   * Preserves schedule and history of items already present in the queue.
   */
  async enqueueLessonVocabulary(
    direction: CourseDirection,
    lessonId: string,
    vocabulary: VocabularyItem[],
    currentTime: number = Date.now()
  ): Promise<{ success: boolean; updatedMap: DirectionReviewMap }> {
    const currentMap = await this.loadReviewRecords();
    const currentRecords = currentMap[direction] || [];
    const existingVocabIds = new Set(currentRecords.map((r) => r.vocabId));

    const newRecords: ReviewRecord[] = [];
    for (const item of vocabulary) {
      if (!existingVocabIds.has(item.id)) {
        newRecords.push({
          id: item.id,
          vocabId: item.id,
          lessonId,
          direction,
          addedAt: currentTime,
          lastReviewedAt: null,
          dueAt: currentTime, // Immediately eligible for first review
          reviewCount: 0,
          rememberedCount: 0,
          needsPracticeCount: 0,
        });
        existingVocabIds.add(item.id);
      }
    }

    if (newRecords.length === 0) {
      return { success: true, updatedMap: currentMap };
    }

    const updatedMap: DirectionReviewMap = {
      ...currentMap,
      [direction]: [...currentRecords, ...newRecords],
    };

    const saved = await this.saveReviewRecords(updatedMap);
    return {
      success: saved,
      updatedMap: saved ? updatedMap : currentMap,
    };
  },

  /**
   * Record the review outcome for a single vocabulary item and update its schedule.
   */
  async recordReviewOutcome(
    direction: CourseDirection,
    vocabId: string,
    outcome: ReviewOutcome,
    nextDueAt: number,
    currentTime: number = Date.now()
  ): Promise<{ success: boolean; updatedRecord: ReviewRecord | null; updatedMap: DirectionReviewMap }> {
    const currentMap = await this.loadReviewRecords();
    const currentRecords = currentMap[direction] || [];
    const existingIndex = currentRecords.findIndex((r) => r.vocabId === vocabId);

    if (existingIndex === -1) {
      return { success: false, updatedRecord: null, updatedMap: currentMap };
    }

    const targetRecord = currentRecords[existingIndex];
    const updatedRecord: ReviewRecord = {
      ...targetRecord,
      lastReviewedAt: currentTime,
      dueAt: nextDueAt,
      reviewCount: targetRecord.reviewCount + 1,
      rememberedCount: targetRecord.rememberedCount + (outcome === 'remembered' ? 1 : 0),
      needsPracticeCount: targetRecord.needsPracticeCount + (outcome === 'needs-practice' ? 1 : 0),
    };

    const updatedRecords = [...currentRecords];
    updatedRecords[existingIndex] = updatedRecord;

    const updatedMap: DirectionReviewMap = {
      ...currentMap,
      [direction]: updatedRecords,
    };

    const saved = await this.saveReviewRecords(updatedMap);
    return {
      success: saved,
      updatedRecord: saved ? updatedRecord : targetRecord,
      updatedMap: saved ? updatedMap : currentMap,
    };
  },

  /**
   * Clear review storage (useful for testing or resetting).
   */
  async clearReviewStorage(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(REVIEW_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Failed to clear review storage:', error);
      return false;
    }
  },
};
