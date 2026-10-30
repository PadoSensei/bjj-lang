import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ReviewScreen from '../../app/review';
import { CourseProvider } from '../../src/context/CourseContext';
import { DirectionReviewMap } from '../../src/types/review';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
});
