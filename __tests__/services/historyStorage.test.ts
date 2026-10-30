import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  historyStorage,
  REVIEW_HISTORY_STORAGE_KEY,
} from '../../src/services/storage/historyStorage';
import { ReviewHistoryEntry } from '../../src/types/history';

describe('historyStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const sampleEntryPt: ReviewHistoryEntry = {
    id: 'h1',
    vocabId: 'v1',
    direction: 'pt-BR->en',
    outcome: 'remembered',
    completedAt: 1000,
  };

  const sampleEntryEn: ReviewHistoryEntry = {
    id: 'h2',
    vocabId: 'v2',
    direction: 'en->pt-BR',
    outcome: 'needs-practice',
    completedAt: 2000,
  };

  it('returns default empty history when storage is empty', async () => {
    const loaded = await historyStorage.loadHistoryRecords();
    expect(loaded).toEqual({
      'pt-BR->en': [],
      'en->pt-BR': [],
    });
  });

  it('saves and reloads history records per direction', async () => {
    const initialMap = {
      'pt-BR->en': [sampleEntryPt],
      'en->pt-BR': [sampleEntryEn],
    };

    const saved = await historyStorage.saveHistoryRecords(initialMap);
    expect(saved).toBe(true);

    const loaded = await historyStorage.loadHistoryRecords();
    expect(loaded['pt-BR->en']).toHaveLength(1);
    expect(loaded['pt-BR->en'][0]).toEqual(sampleEntryPt);
    expect(loaded['en->pt-BR']).toHaveLength(1);
    expect(loaded['en->pt-BR'][0]).toEqual(sampleEntryEn);
  });

  it('adds history entries while preserving existing entries and isolating direction', async () => {
    await historyStorage.addHistoryEntry(sampleEntryPt);
    await historyStorage.addHistoryEntry(sampleEntryEn);

    const nextEntryPt: ReviewHistoryEntry = {
      id: 'h3',
      vocabId: 'v3',
      direction: 'pt-BR->en',
      outcome: 'needs-practice',
      completedAt: 3000,
    };

    await historyStorage.addHistoryEntry(nextEntryPt);

    const loaded = await historyStorage.loadHistoryRecords();
    expect(loaded['pt-BR->en']).toHaveLength(2);
    expect(loaded['pt-BR->en']).toEqual([sampleEntryPt, nextEntryPt]);
    expect(loaded['en->pt-BR']).toHaveLength(1);
    expect(loaded['en->pt-BR']).toEqual([sampleEntryEn]);
  });

  it('gracefully handles malformed data in storage', async () => {
    await AsyncStorage.setItem(REVIEW_HISTORY_STORAGE_KEY, JSON.stringify({ 'pt-BR->en': 'invalid-type' }));
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const loaded = await historyStorage.loadHistoryRecords();
    expect(loaded).toEqual({
      'pt-BR->en': [],
      'en->pt-BR': [],
    });
    expect(spyWarn).toHaveBeenCalledWith(
      expect.stringContaining('History storage contains malformed data')
    );
    spyWarn.mockRestore();
  });

  it('gracefully handles AsyncStorage read error', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage failure'));
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const loaded = await historyStorage.loadHistoryRecords();
    expect(loaded).toEqual({
      'pt-BR->en': [],
      'en->pt-BR': [],
    });
    expect(spyWarn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load history records'),
      expect.any(Error)
    );
    spyWarn.mockRestore();
  });

  it('clears history storage successfully', async () => {
    await historyStorage.addHistoryEntry(sampleEntryPt);
    await historyStorage.clearHistoryStorage();

    const loaded = await historyStorage.loadHistoryRecords();
    expect(loaded['pt-BR->en']).toEqual([]);
  });
});
