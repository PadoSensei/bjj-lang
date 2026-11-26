import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { flushAsync } from '../../test-utils/flushAsync';
import { Text, Button } from 'react-native';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LESSONS } from '../../src/data/mockLessons';
import { reviewStorage } from '../../src/services/storage/reviewStorage';
import { progressStorage } from '../../src/services/storage/progressStorage';
import { historyStorage } from '../../src/services/storage/historyStorage';

const ReviewTestComponent = () => {
  const {
    direction,
    setDirection,
    markLessonComplete,
    dueReviewCount,
    activeReviewRecords,
    recordReviewOutcome,
  } = useCourse();

  return (
    <>
      <Text testID="direction-text">{direction}</Text>
      <Text testID="due-count">{dueReviewCount}</Text>
      <Text testID="total-records-count">{activeReviewRecords.length}</Text>

      <Button
        testID="switch-btn"
        title="Switch"
        onPress={() => setDirection('en->pt-BR')}
      />
      <Button
        testID="complete-lesson-1-1-btn"
        title="Complete 1-1"
        onPress={() => markLessonComplete('lesson-1-1')}
      />
      <Button
        testID="remember-vocab-1-btn"
        title="Remember Vocab 1"
        onPress={() => recordReviewOutcome('vocab-1-1-1', 'remembered', Date.now() + 86400000)}
      />
    </>
  );
};

describe('CourseContext Review Queue Integration', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('automatically enqueues lesson vocabulary into review queue on lesson completion', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <ReviewTestComponent />
      </CourseProvider>
    );

    expect(getByTestId('due-count').props.children).toBe(0);
    expect(getByTestId('total-records-count').props.children).toBe(0);

    // Complete lesson-1-1 (contains 3 vocabulary items)
    await act(async () => {
      fireEvent.press(getByTestId('complete-lesson-1-1-btn'));
    });

    // Should now have 3 review records in pt-BR->en, all due
    expect(getByTestId('due-count').props.children).toBe(3);
    expect(getByTestId('total-records-count').props.children).toBe(3);
  });

  // ADR-009: lesson words go into both decks, as separate cards. Review isolation
  // (one deck's reviews never change the other) is covered in CourseContext.isolation.test.tsx.
  it('adds the lesson\'s words to both decks as separate cards', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <ReviewTestComponent />
      </CourseProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId('complete-lesson-1-1-btn'));
    });

    expect(getByTestId('due-count').props.children).toBe(3);

    // Switch to en->pt-BR
    await act(async () => {
      fireEvent.press(getByTestId('switch-btn'));
    });

    expect(getByTestId('direction-text').props.children).toBe('en->pt-BR');
    expect(getByTestId('due-count').props.children).toBe(3);
    expect(getByTestId('total-records-count').props.children).toBe(3);
  });

  it('recording a review outcome updates due count when item dueAt is pushed into future', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': ['lesson-1-1'], 'en->pt-BR': [] }}
        initialReviewRecords={{
          'pt-BR->en': [
            {
              id: 'vocab-1-1-1',
              vocabId: 'vocab-1-1-1',
              lessonId: 'lesson-1-1',
              direction: 'pt-BR->en',
              addedAt: 1000,
              lastReviewedAt: null,
              dueAt: 1000,
              reviewCount: 0,
              rememberedCount: 0,
              needsPracticeCount: 0,
            },
          ],
          'en->pt-BR': [],
        }}
        initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <ReviewTestComponent />
      </CourseProvider>
    );

    expect(getByTestId('due-count').props.children).toBe(1);

    await act(async () => {
      fireEvent.press(getByTestId('remember-vocab-1-btn'));
    });

    expect(getByTestId('due-count').props.children).toBe(0);
    expect(getByTestId('total-records-count').props.children).toBe(1);
  });
});

/**
 * Issue #33 (P0-2): writes must never be computed from stale state.
 * Each test reproduces a way the old code lost learner data.
 */
describe('CourseContext concurrent and early writes', () => {
  let api: ReturnType<typeof useCourse>;
  const ApiCapture = () => {
    api = useCourse();
    return null;
  };

  const emptyMap = () => ({ 'pt-BR->en': [], 'en->pt-BR': [] });

  const renderInjectedEmpty = () =>
    render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={emptyMap()}
        initialReviewRecords={emptyMap()}
        initialHistoryRecords={emptyMap()}
      >
        <ApiCapture />
      </CourseProvider>
    );

  const vocabCount = (lessonId: string) => MOCK_LESSONS[lessonId].vocabulary.length;

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('keeps every record when two lessons are completed in the same tick', async () => {
    renderInjectedEmpty();
    const expected = vocabCount('lesson-1-1') + vocabCount('lesson-1-2');

    let results: boolean[] = [];
    await act(async () => {
      results = await Promise.all([
        api.markLessonComplete('lesson-1-1'),
        api.markLessonComplete('lesson-1-2'),
      ]);
    });

    expect(results).toEqual([true, true]);
    expect(api.activeReviewRecords).toHaveLength(expected);
    expect(api.completedLessonIds).toEqual(['lesson-1-1', 'lesson-1-2']);

    const stored = await reviewStorage.loadReviewRecords();
    expect(stored['pt-BR->en']).toHaveLength(expected);
  });

  it('does not overwrite stored progress when a lesson completes before loading finishes', async () => {
    // Progress saved in an earlier session.
    await progressStorage.markLessonCompleteInStorage('pt-BR->en', 'lesson-2-1');
    await reviewStorage.enqueueLessonVocabulary(
      'pt-BR->en',
      'lesson-2-1',
      MOCK_LESSONS['lesson-2-1'].vocabulary
    );

    // Real launch: no injected state, so the provider hydrates from storage.
    render(
      <CourseProvider initialDirection="pt-BR->en">
        <ApiCapture />
      </CourseProvider>
    );
    expect(api.isLoadingProgress).toBe(true);

    // Fire the completion before hydration has finished.
    let completion!: Promise<boolean>;
    act(() => {
      completion = api.markLessonComplete('lesson-1-1');
    });

    await flushAsync();

    expect(api.isLoadingProgress).toBe(false);
    await act(async () => {
      await expect(completion).resolves.toBe(true);
    });

    const expected = vocabCount('lesson-2-1') + vocabCount('lesson-1-1');
    expect(api.activeReviewRecords).toHaveLength(expected);
    expect([...api.completedLessonIds].sort()).toEqual(['lesson-1-1', 'lesson-2-1']);

    const storedReviews = await reviewStorage.loadReviewRecords();
    expect(storedReviews['pt-BR->en']).toHaveLength(expected);
    const storedProgress = await progressStorage.loadCompletedLessons();
    expect([...storedProgress['pt-BR->en']].sort()).toEqual(['lesson-1-1', 'lesson-2-1']);
  });

  it('persists both outcomes when two cards are reviewed in the same tick', async () => {
    renderInjectedEmpty();
    await act(async () => {
      await api.markLessonComplete('lesson-1-1');
    });
    const [first, second] = MOCK_LESSONS['lesson-1-1'].vocabulary.map((v) => v.id);
    const later = Date.now() + 86400000;

    let results: boolean[] = [];
    await act(async () => {
      results = await Promise.all([
        api.recordReviewOutcome(first, 'remembered', later),
        api.recordReviewOutcome(second, 'needs-practice', later),
      ]);
    });

    expect(results).toEqual([true, true]);
    const byId = (id: string) => api.activeReviewRecords.find((r) => r.vocabId === id)!;
    expect(byId(first).reviewCount).toBe(1);
    expect(byId(first).rememberedCount).toBe(1);
    expect(byId(second).reviewCount).toBe(1);
    expect(byId(second).needsPracticeCount).toBe(1);
    expect(api.activeHistory).toHaveLength(2);

    const stored = await reviewStorage.loadReviewRecords();
    const storedById = (id: string) => stored['pt-BR->en'].find((r) => r.vocabId === id)!;
    expect(storedById(first).reviewCount).toBe(1);
    expect(storedById(second).reviewCount).toBe(1);
    const storedHistory = await historyStorage.loadHistoryRecords();
    expect(storedHistory['pt-BR->en']).toHaveLength(2);
  });

  it('reports a failed save as false and still runs the next write', async () => {
    renderInjectedEmpty();
    const setItemSpy = jest
      .spyOn(AsyncStorage, 'setItem')
      .mockImplementationOnce(() => Promise.reject(new Error('disk full')));
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    let firstResult: boolean | undefined;
    let secondResult: boolean | undefined;
    await act(async () => {
      [firstResult, secondResult] = await Promise.all([
        api.markLessonComplete('lesson-1-1'),
        api.markLessonComplete('lesson-1-2'),
      ]);
    });

    expect(firstResult).toBe(false);
    expect(secondResult).toBe(true);
    expect(setItemSpy).toHaveBeenCalled();
    const stored = await reviewStorage.loadReviewRecords();
    expect(stored['pt-BR->en'].length).toBeGreaterThan(0);
  });
});

