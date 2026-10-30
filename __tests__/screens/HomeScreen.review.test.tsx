import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../app/index';
import { CourseProvider } from '../../src/context/CourseContext';
import { DirectionReviewMap } from '../../src/types/review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

describe('HomeScreen Review Queue Integration', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('displays review queue card with 0 items due when no items are scheduled', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('review-queue-card')).toBeTruthy();
    expect(getByTestId('review-card-due-text').props.children).toBe('No reviews currently due');
    expect(getByText('View Queue')).toBeTruthy();
  });

  test('displays due count when items are scheduled and navigates to /review on button press', () => {
    const initialReviews: DirectionReviewMap = {
      'pt-BR->en': [
        {
          id: 'vocab-1',
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
    };

    const { getByTestId, getByText } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': ['lesson-1-1'], 'en->pt-BR': [] }}
        initialReviewRecords={initialReviews}
      >
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('review-card-due-text').props.children).toBe('1 item due for review');
    expect(getByText('Start Review')).toBeTruthy();

    fireEvent.press(getByTestId('start-review-queue-btn'));
    expect(mockPush).toHaveBeenCalledWith('/review');
  });
});
