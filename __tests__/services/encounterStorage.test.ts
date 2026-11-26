import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  encounterStorage,
  ENCOUNTER_STORAGE_KEY,
  DEFAULT_ENCOUNTERS,
} from '../../src/services/storage/encounterStorage';

describe('encounterStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('loads an empty map when nothing is stored', async () => {
    await expect(encounterStorage.loadEncounters()).resolves.toEqual(DEFAULT_ENCOUNTERS);
    expect(DEFAULT_ENCOUNTERS).toEqual({});
  });

  test('round-trips encounters', async () => {
    const map = {
      'vocab-1-1-1': { firstSeenAt: 10, sources: ['reader', 'game'] as const, lookups: 3 },
      'vocab-1-1-2': { firstSeenAt: 20, sources: ['lesson'] as const, lookups: 1 },
    };
    await expect(encounterStorage.saveEncounters(map as never)).resolves.toBe(true);
    await expect(encounterStorage.loadEncounters()).resolves.toEqual(map);
  });

  test('malformed JSON falls back to an empty map', async () => {
    await AsyncStorage.setItem(ENCOUNTER_STORAGE_KEY, '{ nope');
    await expect(encounterStorage.loadEncounters()).resolves.toEqual({});
  });

  test('an unknown source falls back to an empty map', async () => {
    await AsyncStorage.setItem(
      ENCOUNTER_STORAGE_KEY,
      JSON.stringify({ 'vocab-1-1-1': { firstSeenAt: 1, sources: ['tv'], lookups: 1 } })
    );
    await expect(encounterStorage.loadEncounters()).resolves.toEqual({});
  });

  test('a storage read error falls back to an empty map', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockImplementationOnce(() => Promise.reject(new Error('boom')));
    await expect(encounterStorage.loadEncounters()).resolves.toEqual({});
  });

  test('a storage write error returns false instead of throwing', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.reject(new Error('disk full')));
    await expect(encounterStorage.saveEncounters({})).resolves.toBe(false);
  });
});
