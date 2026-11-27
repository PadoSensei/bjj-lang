import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { flushAsync } from '../../test-utils/flushAsync';
import { reviewStorage } from '../../src/services/storage/reviewStorage';
import ReviewScreen from '../../app/review';
import { CourseProvider } from '../../src/context/CourseContext';
import { DirectionReviewMap } from '../../src/types/review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LESSONS } from '../../src/data/mockLessons';
import * as registry from '../../src/content/registry';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: () => true,
  }),
}));

describe('ReviewScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('renders empty state when no items are due', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <ReviewScreen />
      </CourseProvider>
    );

    expect(getByTestId('review-empty-view')).toBeTruthy();
    expect(getByText('All Caught Up!')).toBeTruthy();
  });

  test('renders prompt card and allows full reveal, answer, and completion flow', async () => {
    const initialReviews: DirectionReviewMap = {
      'pt-BR->en': [
        {
          id: 'vocab-1-1-1',
          vocabId: 'vocab-1-1-1',
          lessonId: 'lesson-1-1',
          direction: 'pt-BR->en',
          addedAt: 500,
          lastReviewedAt: null,
          dueAt: 500,
          reviewCount: 0,
          rememberedCount: 0,
          needsPracticeCount: 0,
        },
      ],
      'en->pt-BR': [],
    };

    const { getByTestId, getByText, queryByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': ['lesson-1-1'], 'en->pt-BR': [] }}
        initialReviewRecords={initialReviews}
      >
        <ReviewScreen />
      </CourseProvider>
    );

    // Should render prompt card with OSS
    expect(getByTestId('review-prompt-text').props.children).toBe('OSS');
    expect(queryByTestId('review-revealed-card')).toBeNull();

    // Reveal answer
    await act(async () => {
      fireEvent.press(getByTestId('review-show-answer-btn'));
    });

    expect(getByTestId('review-revealed-card')).toBeTruthy();
    expect(getByTestId('review-target-term-text').props.children).toBe('OSS (Respect greeting)');

    // Select "Remembered"
    await act(async () => {
      fireEvent.press(getByTestId('review-remembered-btn'));
    });

    expect(getByTestId('review-feedback-text').props.children).toContain('Recorded: Remembered');

    // Click Continue
    await act(async () => {
      fireEvent.press(getByTestId('review-continue-btn'));
    });

    // Session complete view
    expect(getByTestId('review-completion-view')).toBeTruthy();
    expect(getByText('Session Complete!')).toBeTruthy();
  });

  describe('when opened before stored progress has loaded (reload or deep link)', () => {
    const storedDueReviews: DirectionReviewMap = {
      'pt-BR->en': [
        {
          id: 'vocab-1-1-1',
          vocabId: 'vocab-1-1-1',
          lessonId: 'lesson-1-1',
          direction: 'pt-BR->en',
          addedAt: 500,
          lastReviewedAt: null,
          dueAt: 500,
          reviewCount: 0,
          rememberedCount: 0,
          needsPracticeCount: 0,
        },
      ],
      'en->pt-BR': [],
    };

    test('shows a loading state, not the empty view, while hydrating', async () => {
      await reviewStorage.saveReviewRecords(storedDueReviews);

      const { getByTestId, queryByTestId } = render(
        <CourseProvider initialDirection="pt-BR->en">
          <ReviewScreen />
        </CourseProvider>
      );

      expect(getByTestId('review-loading')).toBeTruthy();
      expect(queryByTestId('review-empty-view')).toBeNull();

      await flushAsync();

      expect(queryByTestId('review-loading')).toBeNull();
    });

    test('shows the due card from storage once hydrated', async () => {
      await reviewStorage.saveReviewRecords(storedDueReviews);

      const { getByTestId, queryByTestId } = render(
        <CourseProvider initialDirection="pt-BR->en">
          <ReviewScreen />
        </CourseProvider>
      );

      await flushAsync();
      const prompt = getByTestId('review-prompt-text');
      expect(prompt.props.children).toBe('OSS');
      expect(queryByTestId('review-empty-view')).toBeNull();
    });

    test('shows the empty view after hydrating when nothing is stored', async () => {
      const { getByTestId, queryByTestId } = render(
        <CourseProvider initialDirection="pt-BR->en">
          <ReviewScreen />
        </CourseProvider>
      );

      await flushAsync();
      expect(getByTestId('review-empty-view')).toBeTruthy();
      expect(queryByTestId('review-loading')).toBeNull();
    });
  });

  describe('deck toggle, Portuguese help text and source label (issue #40)', () => {
    const card = (vocabId: string, direction: 'pt-BR->en' | 'en->pt-BR', extra: object = {}) => ({
      id: vocabId,
      vocabId,
      lessonId: 'lesson-1-1',
      direction,
      addedAt: 500,
      lastReviewedAt: null,
      dueAt: 500,
      reviewCount: 0,
      rememberedCount: 0,
      needsPracticeCount: 0,
      ...extra,
    });
    // A different word in each deck, so mixing would be visible.
    const decks: DirectionReviewMap = {
      'pt-BR->en': [card('vocab-1-1-1', 'pt-BR->en', { source: 'reader' })],
      'en->pt-BR': [card('vocab-1-3-6', 'en->pt-BR'), card('vocab-1-3-7', 'en->pt-BR')],
    };
    const renderInjected = () =>
      render(
        <CourseProvider
          initialDirection="pt-BR->en"
          initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
          initialReviewRecords={decks}
        >
          <ReviewScreen />
        </CourseProvider>
      );
    const contextPt = (vocabId: string) =>
      Object.values(MOCK_LESSONS)
        .flatMap((l) => l.vocabulary)
        .find((v) => v.id === vocabId)!.context!.pt;

    afterEach(() => jest.restoreAllMocks());

    test('shows the toggle with each deck\'s due count, current deck selected', () => {
      const { getByTestId } = renderInjected();
      expect(getByTestId('deck-toggle-pt-en-count').props.children).toBe(1);
      expect(getByTestId('deck-toggle-en-pt-count').props.children).toBe(2);
      expect(getByTestId('deck-toggle-pt-en').props.accessibilityState).toMatchObject({ selected: true });
    });

    test('switching decks shows only that deck\'s cards', async () => {
      const { getByTestId } = renderInjected();
      expect(getByTestId('review-prompt-text').props.children).toBe('OSS');
      expect(getByTestId('lesson-step-text').props.children).toBe('Item 1 of 1');

      await act(async () => {
        fireEvent.press(getByTestId('deck-toggle-en-pt'));
      });
      // en->pt-BR prompts the English term (recognition deck).
      expect(getByTestId('review-prompt-text').props.children).toBe('Yes');
      expect(getByTestId('deck-toggle-en-pt').props.accessibilityState).toMatchObject({ selected: true });
      expect(getByTestId('lesson-step-text').props.children).toBe('Item 1 of 2');

      await act(async () => {
        fireEvent.press(getByTestId('deck-toggle-pt-en'));
      });
      expect(getByTestId('review-prompt-text').props.children).toBe('OSS');
    });

    test('the selected deck is remembered after a reload', async () => {
      await reviewStorage.saveReviewRecords(decks);
      const first = render(
        <CourseProvider>
          <ReviewScreen />
        </CourseProvider>
      );
      await flushAsync();
      await act(async () => {
        fireEvent.press(first.getByTestId('deck-toggle-en-pt'));
      });
      await flushAsync();
      first.unmount();

      const { getByTestId } = render(
        <CourseProvider>
          <ReviewScreen />
        </CourseProvider>
      );
      await flushAsync();
      expect(getByTestId('deck-toggle-en-pt').props.accessibilityState).toMatchObject({ selected: true });
      expect(getByTestId('review-prompt-text').props.children).toBe('Yes');
    });

    test.each([
      ['pt-BR->en', 'vocab-1-1-1', 'deck-toggle-pt-en'],
      ['en->pt-BR', 'vocab-1-3-6', 'deck-toggle-en-pt'],
    ])('the help text is Portuguese in the %s deck', async (_deck, vocabId, toggle) => {
      const { getByTestId, getByText } = renderInjected();
      await act(async () => {
        fireEvent.press(getByTestId(toggle));
      });
      await act(async () => {
        fireEvent.press(getByTestId('review-show-answer-btn'));
      });
      expect(getByTestId('review-contextual-vocab-context-text').props.children).toBe(contextPt(vocabId));
      expect(getByText('Explicação:')).toBeTruthy();
    });

    test('an item\'s own Portuguese explanation (support.pt) is preferred', async () => {
      const real = registry.getLexicalItem('vocab-1-1-1')!;
      const spy = jest.spyOn(registry, 'getLexicalItem');
      spy.mockImplementation((id) =>
        id === 'vocab-1-1-1' ? { ...real, support: { pt: 'Cumprimento de respeito.' } } : registry.listLexicalItems().find((i) => i.id === id)
      );
      const { getByTestId } = renderInjected();
      await act(async () => {
        fireEvent.press(getByTestId('review-show-answer-btn'));
      });
      expect(getByTestId('review-contextual-vocab-context-text').props.children).toBe('Cumprimento de respeito.');
    });

    test('shows where the word was met, and nothing for older cards', async () => {
      const { getByTestId, queryByTestId } = renderInjected();
      expect(getByTestId('review-source-label').props.children).toBe('Leitura');

      await act(async () => {
        fireEvent.press(getByTestId('deck-toggle-en-pt'));
      });
      expect(queryByTestId('review-source-label')).toBeNull();
    });
  });
});

