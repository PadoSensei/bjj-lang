import React from 'react';
import { render, act } from '@testing-library/react-native';
import { flushAsync } from '../../test-utils/flushAsync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import { MOCK_LESSONS } from '../../src/data/mockLessons';
import * as registry from '../../src/content/registry';
import { reviewStorage } from '../../src/services/storage/reviewStorage';
import { encounterStorage } from '../../src/services/storage/encounterStorage';
import type { CourseDirection } from '../../src/components/ui/CourseDirectionSelector';

/**
 * Issue #39 (P1-3, ADR-009): vocabulary met in any mode is recorded once and
 * added to both flashcard decks, each with its own schedule.
 */

let api: ReturnType<typeof useCourse>;
const ApiCapture = () => {
  api = useCourse();
  return null;
};

const emptyMap = () => ({ 'pt-BR->en': [], 'en->pt-BR': [] });

const renderInjected = (initialDirection: CourseDirection = 'pt-BR->en') =>
  render(
    <CourseProvider
      initialDirection={initialDirection}
      initialCompletedLessons={emptyMap()}
      initialReviewRecords={emptyMap()}
      initialHistoryRecords={emptyMap()}
    >
      <ApiCapture />
    </CourseProvider>
  );

/** A real launch: hydrates from storage. */
const launch = async () => {
  const view = render(
    <CourseProvider>
      <ApiCapture />
    </CourseProvider>
  );
  await flushAsync();
  expect(api.isLoadingProgress).toBe(false);
  return view;
};

const deck = (direction: CourseDirection) => api.reviewMap[direction];
const ids = (direction: CourseDirection) => deck(direction).map((r) => r.vocabId).sort();

describe('CourseContext.recordEncounter', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
    // AsyncStorage's mock functions are shared; clear their call history between tests.
    jest.clearAllMocks();
  });

  it('adds a newly met reviewable word to both decks, due now', async () => {
    renderInjected();
    const before = Date.now();

    let ok: boolean | undefined;
    await act(async () => {
      ok = await api.recordEncounter('vocab-1-1-1', 'reader', 'story-white-first-class');
    });

    expect(ok).toBe(true);
    for (const direction of ['pt-BR->en', 'en->pt-BR'] as const) {
      expect(deck(direction)).toHaveLength(1);
      expect(deck(direction)[0]).toMatchObject({
        vocabId: 'vocab-1-1-1',
        direction,
        source: 'reader',
        lessonId: 'story-white-first-class',
        reviewCount: 0,
      });
      expect(deck(direction)[0].dueAt).toBeGreaterThanOrEqual(before);
      expect(deck(direction)[0].dueAt).toBeLessThanOrEqual(Date.now());
    }
    expect(api.dueReviewCount).toBe(1);
    expect(api.encounters['vocab-1-1-1']).toMatchObject({ sources: ['reader'], lookups: 1 });

    const stored = await reviewStorage.loadReviewRecords();
    expect(stored['pt-BR->en']).toHaveLength(1);
    expect(stored['en->pt-BR']).toHaveLength(1);
    expect((await encounterStorage.loadEncounters())['vocab-1-1-1'].lookups).toBe(1);
  });

  it('meeting the word again only updates the encounter, never the cards', async () => {
    renderInjected();
    await act(async () => {
      await api.recordEncounter('vocab-1-1-1', 'reader');
    });
    const cardsBefore = JSON.parse(JSON.stringify(api.reviewMap));

    await act(async () => {
      await api.recordEncounter('vocab-1-1-1', 'game');
      await api.recordEncounter('vocab-1-1-1', 'game');
    });

    expect(api.reviewMap).toEqual(cardsBefore);
    expect(api.encounters['vocab-1-1-1']).toMatchObject({ sources: ['reader', 'game'], lookups: 3 });
  });

  it('rejects an unknown word and writes nothing', async () => {
    renderInjected();
    const setItem = jest.spyOn(AsyncStorage, 'setItem');

    let ok: boolean | undefined;
    await act(async () => {
      ok = await api.recordEncounter('vocab-9-9-9', 'reader');
    });

    expect(ok).toBe(false);
    expect(api.encounters).toEqual({});
    expect(deck('pt-BR->en')).toHaveLength(0);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('logs a word that is not reviewable without making flashcards for it', async () => {
    const real = registry.getLexicalItem('vocab-1-1-1')!;
    jest.spyOn(registry, 'getLexicalItem').mockImplementation((id) =>
      id === 'vocab-1-1-1' ? { ...real, reviewable: false } : undefined
    );
    renderInjected();

    let ok: boolean | undefined;
    await act(async () => {
      ok = await api.recordEncounter('vocab-1-1-1', 'reader');
    });

    expect(ok).toBe(true);
    expect(api.encounters['vocab-1-1-1']).toMatchObject({ sources: ['reader'], lookups: 1 });
    expect(deck('pt-BR->en')).toHaveLength(0);
    expect(deck('en->pt-BR')).toHaveLength(0);
  });

  it('reviewing in one deck leaves the other deck\'s card and history untouched', async () => {
    renderInjected('en->pt-BR');
    await act(async () => {
      await api.recordEncounter('vocab-1-1-1', 'reader');
    });
    const otherDeckCard = { ...deck('pt-BR->en')[0] };

    await act(async () => {
      await api.recordReviewOutcome('vocab-1-1-1', 'remembered', Date.now() + 86400000);
    });

    expect(deck('en->pt-BR')[0].reviewCount).toBe(1);
    expect(deck('pt-BR->en')[0]).toEqual(otherDeckCard);
    expect(api.historyMap['en->pt-BR']).toHaveLength(1);
    expect(api.historyMap['pt-BR->en']).toHaveLength(0);
  });

  it('encounters and both decks survive a reload', async () => {
    const first = await launch();
    await act(async () => {
      await api.recordEncounter('vocab-1-1-1', 'adventure', 'scn-white-first-class');
    });
    first.unmount();

    await launch();
    expect(ids('pt-BR->en')).toEqual(['vocab-1-1-1']);
    expect(ids('en->pt-BR')).toEqual(['vocab-1-1-1']);
    expect(api.encounters['vocab-1-1-1']).toMatchObject({ sources: ['adventure'], lookups: 1 });
  });

  it('a word met while stored progress is still loading does not overwrite it', async () => {
    // Saved in an earlier session: one word met in a lesson, with cards in both decks.
    await encounterStorage.saveEncounters({ 'vocab-1-1-2': { firstSeenAt: 1, sources: ['lesson'], lookups: 1 } });
    const card = (direction: CourseDirection) => ({
      id: 'vocab-1-1-2', vocabId: 'vocab-1-1-2', lessonId: 'lesson-1-1', direction,
      addedAt: 1, lastReviewedAt: null, dueAt: 1, reviewCount: 0, rememberedCount: 0, needsPracticeCount: 0,
    });
    await reviewStorage.saveReviewRecords({ 'pt-BR->en': [card('pt-BR->en')], 'en->pt-BR': [card('en->pt-BR')] });

    render(
      <CourseProvider>
        <ApiCapture />
      </CourseProvider>
    );
    expect(api.isLoadingProgress).toBe(true);

    let pending!: Promise<boolean>;
    act(() => {
      pending = api.recordEncounter('vocab-1-1-1', 'reader');
    });
    await flushAsync();
    expect(api.isLoadingProgress).toBe(false);
    await act(async () => {
      await expect(pending).resolves.toBe(true);
    });

    expect(ids('pt-BR->en')).toEqual(['vocab-1-1-1', 'vocab-1-1-2']);
    expect(ids('en->pt-BR')).toEqual(['vocab-1-1-1', 'vocab-1-1-2']);
    expect(Object.keys(api.encounters).sort()).toEqual(['vocab-1-1-1', 'vocab-1-1-2']);
    const stored = await reviewStorage.loadReviewRecords();
    expect(stored['pt-BR->en']).toHaveLength(2);
    expect(Object.keys(await encounterStorage.loadEncounters())).toHaveLength(2);
  });

  it('ten words met at the same moment all reach both decks', async () => {
    renderInjected();
    const words = ['lesson-1-3', 'lesson-1-1'].flatMap((l) => MOCK_LESSONS[l].vocabulary.map((v) => v.id)).slice(0, 10);
    expect(words).toHaveLength(10);

    let results: boolean[] = [];
    await act(async () => {
      results = await Promise.all(words.map((id) => api.recordEncounter(id, 'reader')));
    });

    expect(results.every(Boolean)).toBe(true);
    expect(ids('pt-BR->en')).toEqual([...words].sort());
    expect(ids('en->pt-BR')).toEqual([...words].sort());
    expect(Object.keys(api.encounters).sort()).toEqual([...words].sort());
    const stored = await reviewStorage.loadReviewRecords();
    expect(stored['pt-BR->en']).toHaveLength(10);
    expect(stored['en->pt-BR']).toHaveLength(10);
    expect(Object.keys(await encounterStorage.loadEncounters())).toHaveLength(10);
  });
});

describe('lesson completion goes through encounters', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
    // AsyncStorage's mock functions are shared; clear their call history between tests.
    jest.clearAllMocks();
  });

  it('adds the lesson\'s words to both decks but marks the lesson complete only in the current direction', async () => {
    renderInjected('pt-BR->en');
    const lessonWords = MOCK_LESSONS['lesson-1-1'].vocabulary.map((v) => v.id).sort();

    await act(async () => {
      await api.markLessonComplete('lesson-1-1');
    });

    expect(ids('pt-BR->en')).toEqual(lessonWords);
    expect(ids('en->pt-BR')).toEqual(lessonWords);
    expect(deck('en->pt-BR').every((r) => r.source === 'lesson' && r.lessonId === 'lesson-1-1')).toBe(true);
    for (const id of lessonWords) {
      expect(api.encounters[id].sources).toEqual(['lesson']);
    }

    expect(api.completedLessonIds).toEqual(['lesson-1-1']);
    act(() => api.setDirection('en->pt-BR'));
    expect(api.completedLessonIds).toEqual([]);
  });

  it('completing the same lesson in the other direction adds no duplicate cards', async () => {
    renderInjected('pt-BR->en');
    await act(async () => {
      await api.markLessonComplete('lesson-1-1');
    });
    act(() => api.setDirection('en->pt-BR'));
    await act(async () => {
      await api.markLessonComplete('lesson-1-1-pt');
    });

    const count = MOCK_LESSONS['lesson-1-1'].vocabulary.length;
    expect(deck('pt-BR->en')).toHaveLength(count);
    expect(deck('en->pt-BR')).toHaveLength(count);
    expect(api.completedLessonIds).toEqual(['lesson-1-1-pt']);
  });

  it('a learner from before the pivot keeps their cards and gains the missing deck', async () => {
    const now = Date.now();
    const oldCard = {
      id: 'vocab-1-1-1',
      vocabId: 'vocab-1-1-1',
      lessonId: 'lesson-1-1',
      direction: 'pt-BR->en' as const,
      addedAt: now - 5000,
      lastReviewedAt: now - 1000,
      dueAt: now + 86400000,
      reviewCount: 4,
      rememberedCount: 3,
      needsPracticeCount: 1,
    };
    await reviewStorage.saveReviewRecords({ 'pt-BR->en': [oldCard], 'en->pt-BR': [] });

    await launch();
    await act(async () => {
      await api.recordEncounter('vocab-1-1-1', 'reader');
    });

    expect(deck('pt-BR->en')).toEqual([oldCard]);
    expect(deck('en->pt-BR')).toHaveLength(1);
    expect(deck('en->pt-BR')[0].reviewCount).toBe(0);
  });
});
