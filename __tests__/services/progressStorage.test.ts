import AsyncStorage from '@react-native-async-storage/async-storage';
import { progressStorage, PROGRESS_STORAGE_KEY, DEFAULT_PROGRESS } from '../../src/services/storage/progressStorage';

describe('progressStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('loadCompletedLessons returns DEFAULT_PROGRESS when storage is empty', async () => {
    const result = await progressStorage.loadCompletedLessons();
    expect(result).toEqual(DEFAULT_PROGRESS);
  });

  test('saveCompletedLessons and loadCompletedLessons persist data correctly', async () => {
    const testData = {
      'pt-BR->en': ['lesson-1-1', 'lesson-1-2'],
      'en->pt-BR': ['lesson-1-1-pt'],
    };

    const saved = await progressStorage.saveCompletedLessons(testData);
    expect(saved).toBe(true);

    const loaded = await progressStorage.loadCompletedLessons();
    expect(loaded).toEqual(testData);
  });

  test('loadCompletedLessons handles malformed JSON gracefully', async () => {
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, '{ invalid json ...');

    const result = await progressStorage.loadCompletedLessons();
    expect(result).toEqual(DEFAULT_PROGRESS);
  });

  test('loadCompletedLessons handles unexpected non-array schema gracefully', async () => {
    await AsyncStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ 'pt-BR->en': 'not-an-array', 'en->pt-BR': 123 })
    );

    const result = await progressStorage.loadCompletedLessons();
    expect(result).toEqual(DEFAULT_PROGRESS);
  });

  test('loadCompletedLessons deduplicates array entries', async () => {
    await AsyncStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        'pt-BR->en': ['lesson-1-1', 'lesson-1-1', 'lesson-1-2'],
        'en->pt-BR': ['lesson-1-1-pt', 'lesson-1-1-pt'],
      })
    );

    const loaded = await progressStorage.loadCompletedLessons();
    expect(loaded).toEqual({
      'pt-BR->en': ['lesson-1-1', 'lesson-1-2'],
      'en->pt-BR': ['lesson-1-1-pt'],
    });
  });

  test('markLessonCompleteInStorage adds new lesson idempotently and isolates directions', async () => {
    const res1 = await progressStorage.markLessonCompleteInStorage('pt-BR->en', 'lesson-1-1');
    expect(res1.success).toBe(true);
    expect(res1.updatedProgress['pt-BR->en']).toEqual(['lesson-1-1']);
    expect(res1.updatedProgress['en->pt-BR']).toEqual([]);

    // Idempotent second call
    const res2 = await progressStorage.markLessonCompleteInStorage('pt-BR->en', 'lesson-1-1');
    expect(res2.success).toBe(true);
    expect(res2.updatedProgress['pt-BR->en']).toEqual(['lesson-1-1']);

    // Mark lesson in different direction
    const res3 = await progressStorage.markLessonCompleteInStorage('en->pt-BR', 'lesson-1-1-pt');
    expect(res3.success).toBe(true);
    expect(res3.updatedProgress['pt-BR->en']).toEqual(['lesson-1-1']);
    expect(res3.updatedProgress['en->pt-BR']).toEqual(['lesson-1-1-pt']);
  });

  test('handles getItem exception gracefully when storage fails', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage access error'));

    const result = await progressStorage.loadCompletedLessons();
    expect(result).toEqual(DEFAULT_PROGRESS);
  });

  test('handles setItem exception gracefully when storage fails', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Disk write error'));

    const saved = await progressStorage.saveCompletedLessons({
      'pt-BR->en': ['lesson-1-1'],
      'en->pt-BR': [],
    });
    expect(saved).toBe(false);
  });
});
