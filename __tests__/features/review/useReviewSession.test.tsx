import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCourse } from '../../../src/context/CourseContext';
import { reviewStorage } from '../../../src/services/storage/reviewStorage';
import { CourseProvider } from '../../../src/context/CourseContext';
import { useReviewSession } from '../../../src/features/review/useReviewSession';
import { DirectionReviewMap } from '../../../src/types/review';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('useReviewSession', () => {
  const now = 1000000;
  const mockGetNow = () => now;

  const initialReviews: DirectionReviewMap = {
    'pt-BR->en': [
      {
        id: 'vocab-1-1-1',
        vocabId: 'vocab-1-1-1',
        lessonId: 'lesson-1-1',
        direction: 'pt-BR->en',
        addedAt: 500,
        lastReviewedAt: null,
        dueAt: 500, // Due
        reviewCount: 0,
        rememberedCount: 0,
        needsPracticeCount: 0,
      },
      {
        id: 'vocab-1-1-2',
        vocabId: 'vocab-1-1-2',
        lessonId: 'lesson-1-1',
        direction: 'pt-BR->en',
        addedAt: 500,
        lastReviewedAt: null,
        dueAt: 600, // Due
        reviewCount: 0,
        rememberedCount: 0,
        needsPracticeCount: 0,
      },
    ],
    'en->pt-BR': [],
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CourseProvider
      initialDirection="pt-BR->en"
      initialCompletedLessons={{ 'pt-BR->en': ['lesson-1-1'], 'en->pt-BR': [] }}
      initialReviewRecords={initialReviews}
    >
      {children}
    </CourseProvider>
  );

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('initializes session queue with due items and answer hidden', () => {
    const { result } = renderHook(
      () => useReviewSession('pt-BR->en', { getNow: mockGetNow }),
      { wrapper }
    );

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.totalSessionItems).toBe(2);
    expect(result.current.currentStepNumber).toBe(1);
    expect(result.current.isAnswerRevealed).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.currentVocab?.promptTerm).toBe('OSS');
  });

  test('revealAnswer sets isAnswerRevealed to true without recording outcome', () => {
    const { result } = renderHook(
      () => useReviewSession('pt-BR->en', { getNow: mockGetNow }),
      { wrapper }
    );

    act(() => {
      result.current.revealAnswer();
    });

    expect(result.current.isAnswerRevealed).toBe(true);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.lastOutcome).toBeNull();
  });

  test('cannot submit outcome if answer is not revealed', async () => {
    const { result } = renderHook(
      () => useReviewSession('pt-BR->en', { getNow: mockGetNow }),
      { wrapper }
    );

    let submitted = false;
    await act(async () => {
      submitted = await result.current.submitOutcome('remembered');
    });

    expect(submitted).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
  });

  test('submitting remembered advances session to next item upon nextItem()', async () => {
    const { result } = renderHook(
      () => useReviewSession('pt-BR->en', { getNow: mockGetNow }),
      { wrapper }
    );

    act(() => {
      result.current.revealAnswer();
    });

    await act(async () => {
      await result.current.submitOutcome('remembered');
    });

    expect(result.current.isSubmitted).toBe(true);
    expect(result.current.lastOutcome).toBe('remembered');

    // Next item
    act(() => {
      result.current.nextItem();
    });

    expect(result.current.currentStepNumber).toBe(2);
    expect(result.current.isAnswerRevealed).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.currentVocab?.promptTerm).toBe('Cumprimentar');
  });

  test('submitting needs-practice re-queues item at end of session for bounded retry', async () => {
    const { result } = renderHook(
      () => useReviewSession('pt-BR->en', { getNow: mockGetNow }),
      { wrapper }
    );

    act(() => {
      result.current.revealAnswer();
    });

    await act(async () => {
      await result.current.submitOutcome('needs-practice');
    });

    expect(result.current.isSubmitted).toBe(true);
    expect(result.current.totalSessionItems).toBe(3); // 2 original + 1 re-queued

    act(() => {
      result.current.nextItem();
    });

    expect(result.current.currentStepNumber).toBe(2); // Item 2 (Cumprimentar)
  });

  test('session becomes complete when all items in queue are reviewed', async () => {
    const { result } = renderHook(
      () => useReviewSession('pt-BR->en', { getNow: mockGetNow }),
      { wrapper }
    );

    // Item 1
    act(() => result.current.revealAnswer());
    await act(async () => {
      await result.current.submitOutcome('remembered');
    });
    act(() => result.current.nextItem());

    // Item 2
    act(() => result.current.revealAnswer());
    await act(async () => {
      await result.current.submitOutcome('remembered');
    });
    act(() => result.current.nextItem());

    expect(result.current.isSessionComplete).toBe(true);
  });

  describe('after hydrating from storage (no initial props)', () => {
    const hydratingWrapper = ({ children }: { children: React.ReactNode }) => (
      <CourseProvider initialDirection="pt-BR->en">{children}</CourseProvider>
    );

    const useSessionWithLoading = () => {
      const session = useReviewSession('pt-BR->en', { getNow: mockGetNow });
      const { isLoadingProgress } = useCourse();
      return { session, isLoadingProgress };
    };

    test('builds the session queue from records loaded from AsyncStorage', async () => {
      await reviewStorage.saveReviewRecords(initialReviews);

      const { result } = renderHook(useSessionWithLoading, { wrapper: hydratingWrapper });

      await waitFor(() => expect(result.current.isLoadingProgress).toBe(false));

      expect(result.current.session.isInitialized).toBe(true);
      expect(result.current.session.totalSessionItems).toBe(2);
      expect(result.current.session.currentRecord?.vocabId).toBe('vocab-1-1-1');
    });

    test('is not initialized while storage is still loading', async () => {
      await reviewStorage.saveReviewRecords(initialReviews);

      const { result } = renderHook(useSessionWithLoading, { wrapper: hydratingWrapper });

      // First render happens before the stored records arrive.
      expect(result.current.isLoadingProgress).toBe(true);
      expect(result.current.session.isInitialized).toBe(false);
      expect(result.current.session.totalSessionItems).toBe(0);

      await waitFor(() => expect(result.current.session.isInitialized).toBe(true));
    });

    test('does not rebuild the queue when records change mid-session', async () => {
      await reviewStorage.saveReviewRecords(initialReviews);

      const { result } = renderHook(useSessionWithLoading, { wrapper: hydratingWrapper });
      await waitFor(() => expect(result.current.session.isInitialized).toBe(true));

      act(() => result.current.session.revealAnswer());
      await act(async () => {
        await result.current.session.submitOutcome('remembered');
      });

      // Reviewing changed the stored record; the queue keeps its original order and size.
      expect(result.current.session.totalSessionItems).toBe(2);
      expect(result.current.session.currentRecord?.vocabId).toBe('vocab-1-1-1');
      expect(result.current.session.isSubmitted).toBe(true);
    });
  });
});
