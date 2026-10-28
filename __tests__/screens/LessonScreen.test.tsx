import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LessonScreen from '../../app/lesson/[id]';
import { CourseProvider } from '../../src/context/CourseContext';

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams = { id: 'lesson-1-1' };

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => mockParams,
}));

describe('LessonScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'lesson-1-1' };
  });

  it('renders lesson not found screen for invalid lesson ID', () => {
    mockParams = { id: 'invalid-id-xyz' };

    const { getByTestId, getByText } = render(
      <CourseProvider initialDirection="en->pt-BR">
        <LessonScreen />
      </CourseProvider>
    );

    expect(getByTestId('lesson-not-found-view')).toBeTruthy();
    expect(getByText('Unknown Lesson ID')).toBeTruthy();

    fireEvent.press(getByTestId('not-found-back-btn'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('navigates through vocabulary, multiple choice, translation recall, and completion screen', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider initialDirection="pt-BR->en">
        <LessonScreen />
      </CourseProvider>
    );

    // 1. Vocabulary View
    expect(getByTestId('vocabulary-view')).toBeTruthy();
    expect(getByText('Vocabulary Review')).toBeTruthy();

    fireEvent.press(getByTestId('start-exercises-btn'));

    // 2. Exercise 1: Multiple Choice
    expect(getByTestId('multiple-choice-view')).toBeTruthy();
    expect(getByTestId('lesson-step-text').children.join('')).toContain('Exercise 1 of 3');

    // Select Option A and Check Answer
    fireEvent.press(getByTestId('mc-option-0'));
    fireEvent.press(getByTestId('mc-check-btn'));

    expect(getByTestId('mc-feedback-card')).toBeTruthy();
    expect(getByText('✓ Correct!')).toBeTruthy();

    fireEvent.press(getByTestId('mc-continue-btn'));

    // 3. Exercise 2: Translation Recall
    expect(getByTestId('translation-recall-view')).toBeTruthy();
    expect(getByTestId('lesson-step-text').children.join('')).toContain('Exercise 2 of 3');

    // Reveal answer and rate as I Got It Right
    fireEvent.press(getByTestId('show-answer-btn'));
    expect(getByTestId('revealed-answer-card')).toBeTruthy();

    fireEvent.press(getByTestId('rate-correct-btn'));
    expect(getByTestId('recorded-rating-text')).toBeTruthy();

    fireEvent.press(getByTestId('recall-continue-btn'));

    // 4. Exercise 3: Multiple Choice
    expect(getByTestId('multiple-choice-view')).toBeTruthy();
    expect(getByTestId('lesson-step-text').children.join('')).toContain('Exercise 3 of 3');

    fireEvent.press(getByTestId('mc-option-1'));
    fireEvent.press(getByTestId('mc-check-btn'));
    fireEvent.press(getByTestId('mc-continue-btn'));

    // 5. Lesson Completion View
    expect(getByTestId('lesson-completion-view')).toBeTruthy();
    expect(getByTestId('score-percentage')).toBeTruthy();

    // Test Retry Lesson
    fireEvent.press(getByTestId('retry-lesson-btn'));
    expect(getByTestId('vocabulary-view')).toBeTruthy();

    // Test Close Header Button
    fireEvent.press(getByTestId('lesson-close-btn'));
    expect(mockBack).toHaveBeenCalled();
  });
});
