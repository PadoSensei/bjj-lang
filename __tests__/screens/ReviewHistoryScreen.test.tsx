import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewHistoryScreen from '../../app/review/history';
import { CourseProvider } from '../../src/context/CourseContext';
import type { DirectionHistoryMap } from '../../src/types/history';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), canGoBack: () => true }),
}));

describe('ReviewHistoryScreen deck toggle (issue #40)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  const history: DirectionHistoryMap = {
    'pt-BR->en': [{ id: 'h-pt-1', vocabId: 'vocab-1-1-1', direction: 'pt-BR->en', outcome: 'remembered', completedAt: 1000 }],
    'en->pt-BR': [
      { id: 'h-en-1', vocabId: 'vocab-1-3-6', direction: 'en->pt-BR', outcome: 'needs-practice', completedAt: 2000 },
      { id: 'h-en-2', vocabId: 'vocab-1-3-7', direction: 'en->pt-BR', outcome: 'remembered', completedAt: 3000 },
    ],
  };

  it('shows only the selected deck\'s history and switches with the toggle', async () => {
    const { getByTestId, queryByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={history}
      >
        <ReviewHistoryScreen />
      </CourseProvider>
    );

    expect(getByTestId('history-item-h-pt-1')).toBeTruthy();
    expect(queryByTestId('history-item-h-en-1')).toBeNull();

    await act(async () => {
      fireEvent.press(getByTestId('deck-toggle-en-pt'));
    });

    expect(queryByTestId('history-item-h-pt-1')).toBeNull();
    expect(getByTestId('history-item-h-en-1')).toBeTruthy();
    expect(getByTestId('history-item-h-en-2')).toBeTruthy();
  });
});
