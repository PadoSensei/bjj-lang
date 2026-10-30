import AsyncStorage from '@react-native-async-storage/async-storage';
import { reviewStorage, REVIEW_STORAGE_KEY, DEFAULT_REVIEWS } from '../../src/services/storage/reviewStorage';
import { VocabularyItem } from '../../src/types/lesson';

describe('reviewStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('loadReviewRecords returns DEFAULT_REVIEWS when storage is empty', async () => {
    const result = await reviewStorage.loadReviewRecords();
    expect(result).toEqual(DEFAULT_REVIEWS);
  });

  test('saveReviewRecords and loadReviewRecords persist review data correctly', async () => {
    const record = {
      id: 'vocab-1-1-1',
      vocabId: 'vocab-1-1-1',
      lessonId: 'lesson-1-1',
      direction: 'pt-BR->en' as const,
      addedAt: 1000,
      lastReviewedAt: null,
      dueAt: 1000,
      reviewCount: 0,
      rememberedCount: 0,
      needsPracticeCount: 0,
    };

    const testData = {
      'pt-BR->en': [record],
      'en->pt-BR': [],
    };

    const saved = await reviewStorage.saveReviewRecords(testData);
    expect(saved).toBe(true);

    const loaded = await reviewStorage.loadReviewRecords();
    expect(loaded).toEqual(testData);
  });

  test('loadReviewRecords handles malformed JSON gracefully', async () => {
    await AsyncStorage.setItem(REVIEW_STORAGE_KEY, '{ invalid json ...');

    const result = await reviewStorage.loadReviewRecords();
    expect(result).toEqual(DEFAULT_REVIEWS);
  });

  test('loadReviewRecords handles schema validation failure gracefully', async () => {
    await AsyncStorage.setItem(
      REVIEW_STORAGE_KEY,
      JSON.stringify({ 'pt-BR->en': [{ invalid: 'record' }] })
    );

    const result = await reviewStorage.loadReviewRecords();
    expect(result).toEqual(DEFAULT_REVIEWS);
  });

  test('enqueueLessonVocabulary adds new items idempotently and preserves existing history', async () => {
    const vocabulary: VocabularyItem[] = [
      { id: 'vocab-1', termPt: 'OSS', termEn: 'OSS' },
      { id: 'vocab-2', termPt: 'Bater', termEn: 'Tap' },
    ];

    // Initial enqueuing
    const res1 = await reviewStorage.enqueueLessonVocabulary(
      'pt-BR->en',
      'lesson-1',
      vocabulary,
      1000
    );
    expect(res1.success).toBe(true);
    expect(res1.updatedMap['pt-BR->en']).toHaveLength(2);
    expect(res1.updatedMap['pt-BR->en'][0].vocabId).toBe('vocab-1');
    expect(res1.updatedMap['pt-BR->en'][0].dueAt).toBe(1000);

    // Record review outcome for vocab-1
    await reviewStorage.recordReviewOutcome('pt-BR->en', 'vocab-1', 'remembered', 2000, 1500);

    // Re-enqueue same lesson
    const res2 = await reviewStorage.enqueueLessonVocabulary(
      'pt-BR->en',
      'lesson-1',
      vocabulary,
      3000
    );
    expect(res2.success).toBe(true);

    // Check that vocab-1 history and schedule were preserved (dueAt is still 2000, not reset to 3000)
    const updatedVocab1 = res2.updatedMap['pt-BR->en'].find((r) => r.vocabId === 'vocab-1');
    expect(updatedVocab1?.dueAt).toBe(2000);
    expect(updatedVocab1?.lastReviewedAt).toBe(1500);
    expect(updatedVocab1?.reviewCount).toBe(1);
    expect(updatedVocab1?.rememberedCount).toBe(1);
  });

  test('recordReviewOutcome updates stats and next dueAt', async () => {
    const vocabulary: VocabularyItem[] = [{ id: 'vocab-1', termPt: 'OSS', termEn: 'OSS' }];
    await reviewStorage.enqueueLessonVocabulary('pt-BR->en', 'lesson-1', vocabulary, 1000);

    const res = await reviewStorage.recordReviewOutcome(
      'pt-BR->en',
      'vocab-1',
      'remembered',
      86401000,
      1000
    );

    expect(res.success).toBe(true);
    expect(res.updatedRecord?.reviewCount).toBe(1);
    expect(res.updatedRecord?.rememberedCount).toBe(1);
    expect(res.updatedRecord?.needsPracticeCount).toBe(0);
    expect(res.updatedRecord?.lastReviewedAt).toBe(1000);
    expect(res.updatedRecord?.dueAt).toBe(86401000);
  });

  test('direction isolation ensures pt-BR->en and en->pt-BR records are separate', async () => {
    const vocabulary: VocabularyItem[] = [{ id: 'vocab-1', termPt: 'OSS', termEn: 'OSS' }];

    await reviewStorage.enqueueLessonVocabulary('pt-BR->en', 'lesson-1', vocabulary, 1000);

    const loaded = await reviewStorage.loadReviewRecords();
    expect(loaded['pt-BR->en']).toHaveLength(1);
    expect(loaded['en->pt-BR']).toHaveLength(0);
  });

  test('handles getItem and setItem exceptions gracefully', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage failure'));
    const loaded = await reviewStorage.loadReviewRecords();
    expect(loaded).toEqual(DEFAULT_REVIEWS);

    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage failure'));
    const saved = await reviewStorage.saveReviewRecords(DEFAULT_REVIEWS);
    expect(saved).toBe(false);
  });
});
