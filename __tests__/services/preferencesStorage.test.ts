import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  preferencesStorage,
  PREFERENCES_STORAGE_KEY,
  DEFAULT_PREFERENCES,
} from '../../src/services/storage/preferencesStorage';

describe('preferencesStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('loadPreferences returns the defaults when storage is empty', async () => {
    await expect(preferencesStorage.loadPreferences()).resolves.toEqual(DEFAULT_PREFERENCES);
    expect(DEFAULT_PREFERENCES.lastDirection).toBeNull();
  });

  test.each(['pt-BR->en', 'en->pt-BR'] as const)(
    'saveLastDirection(%s) round-trips through storage',
    async (direction) => {
      await expect(preferencesStorage.saveLastDirection(direction)).resolves.toBe(true);
      await expect(preferencesStorage.loadPreferences()).resolves.toEqual({ lastDirection: direction });
    }
  );

  test('a later save replaces the earlier direction', async () => {
    await preferencesStorage.saveLastDirection('en->pt-BR');
    await preferencesStorage.saveLastDirection('pt-BR->en');
    await expect(preferencesStorage.loadPreferences()).resolves.toEqual({ lastDirection: 'pt-BR->en' });
  });

  test('malformed JSON falls back to the defaults', async () => {
    await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, '{ not json');
    await expect(preferencesStorage.loadPreferences()).resolves.toEqual(DEFAULT_PREFERENCES);
  });

  test('an unknown direction value falls back to the defaults', async () => {
    await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({ lastDirection: 'fr->en' }));
    await expect(preferencesStorage.loadPreferences()).resolves.toEqual(DEFAULT_PREFERENCES);
  });

  test('a stored object without lastDirection loads as the defaults', async () => {
    await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({}));
    await expect(preferencesStorage.loadPreferences()).resolves.toEqual(DEFAULT_PREFERENCES);
  });

  test('a storage read error falls back to the defaults', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockImplementationOnce(() => Promise.reject(new Error('boom')));
    await expect(preferencesStorage.loadPreferences()).resolves.toEqual(DEFAULT_PREFERENCES);
  });

  test('a storage write error returns false instead of throwing', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.reject(new Error('disk full')));
    await expect(preferencesStorage.saveLastDirection('en->pt-BR')).resolves.toBe(false);
  });
});
