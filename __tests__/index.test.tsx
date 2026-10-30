import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../app/index';
import { CourseProvider } from '../src/context/CourseContext';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('HomeScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, course header, and empty state (0 of 4 completed)', () => {
    const { getByTestId, getByText, getAllByText } = render(
      <CourseProvider initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}>
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('app-title')).toBeTruthy();
    expect(getByTestId('app-title').props.children).toBe('BJJ_Lang');
    expect(getByText('Aprenda Inglês para Jiu-Jitsu')).toBeTruthy();

    expect(getByTestId('overall-course-progress-text').props.children).toBe(
      '0 of 4 complete (0%)'
    );
    expect(getByTestId('unit-progress-text-unit-1-en').props.children).toBe(
      '0 of 2 complete'
    );
    expect(getAllByText('Start').length).toBeGreaterThan(0);
  });

  it('renders review insights card with empty state and navigates to review history', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('review-insights-card')).toBeTruthy();
    expect(getByText('No review attempts recorded yet')).toBeTruthy();

    const viewHistoryBtn = getByTestId('view-review-history-btn');
    fireEvent.press(viewHistoryBtn);

    expect(mockPush).toHaveBeenCalledWith('/review/history');
  });

  it('renders review insights stats when history records exist', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={{
          'pt-BR->en': [
            {
              id: 'h1',
              vocabId: 'v1',
              direction: 'pt-BR->en',
              outcome: 'remembered',
              completedAt: 1000,
            },
          ],
          'en->pt-BR': [],
        }}
      >
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('review-insights-card')).toBeTruthy();
    expect(
      getByText('1 total attempts • 100% accuracy • 1 terms reviewed')
    ).toBeTruthy();
  });

  it('renders partially completed state correctly', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider
        initialCompletedLessons={{ 'pt-BR->en': ['lesson-1-1'], 'en->pt-BR': [] }}
      >
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('overall-course-progress-text').props.children).toBe(
      '1 of 4 complete (25%)'
    );
    expect(getByTestId('unit-progress-text-unit-1-en').props.children).toBe(
      '1 of 2 complete'
    );

    // Completed lesson button should say "Review"
    expect(getByText('Review')).toBeTruthy();
  });

  it('switches learning direction and updates course progress & state', async () => {
    const { getByTestId, getByText } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{
          'pt-BR->en': ['lesson-1-1'],
          'en->pt-BR': ['lesson-1-1-pt', 'lesson-1-2-pt'],
        }}
      >
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('overall-course-progress-text').props.children).toBe(
      '1 of 4 complete (25%)'
    );

    // Click direction switch option
    await act(async () => {
      fireEvent.press(getByTestId('home-direction-selector-option-en->pt-BR'));
    });

    expect(getByText('Learn Brazilian Portuguese for BJJ')).toBeTruthy();
    expect(getByTestId('overall-course-progress-text').props.children).toBe(
      '2 of 4 complete (50%)'
    );
  });

  it('navigates to lesson when start button is pressed', () => {
    const { getByTestId } = render(
      <CourseProvider initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}>
        <HomeScreen />
      </CourseProvider>
    );

    const startBtn = getByTestId('start-lesson-btn-lesson-1-1');
    fireEvent.press(startBtn);

    expect(mockPush).toHaveBeenCalledWith('/lesson/lesson-1-1');
  });
});
