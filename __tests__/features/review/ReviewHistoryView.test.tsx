import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReviewHistoryView } from '../../../src/features/review/components/ReviewHistoryView';
import { ReviewHistoryEntry } from '../../../src/types/history';

describe('ReviewHistoryView Component', () => {
  const onReturnToCourseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when isLoading is true', () => {
    const { getByTestId } = render(
      <ReviewHistoryView
        historyEntries={[]}
        direction="pt-BR->en"
        isLoading
        onReturnToCourse={onReturnToCourseMock}
      />
    );

    expect(getByTestId('history-loading-state')).toBeTruthy();
  });

  it('renders error state when hasError is true', () => {
    const { getByTestId } = render(
      <ReviewHistoryView
        historyEntries={[]}
        direction="pt-BR->en"
        hasError
        onReturnToCourse={onReturnToCourseMock}
      />
    );

    expect(getByTestId('history-error-state')).toBeTruthy();
  });

  it('renders empty state when historyEntries is empty', () => {
    const { getByTestId, getByText } = render(
      <ReviewHistoryView
        historyEntries={[]}
        direction="pt-BR->en"
        onReturnToCourse={onReturnToCourseMock}
      />
    );

    expect(getByTestId('history-empty-state')).toBeTruthy();
    expect(getByText('No Review History')).toBeTruthy();

    fireEvent.press(getByTestId('history-empty-return-btn'));
    expect(onReturnToCourseMock).toHaveBeenCalledTimes(1);
  });

  it('renders history items with canonical vocabulary matching and outcome badges', () => {
    const entries: ReviewHistoryEntry[] = [
      {
        id: 'h1',
        vocabId: 'vocab-oss', // Existing vocab item in mock lessons
        direction: 'pt-BR->en',
        outcome: 'remembered',
        completedAt: 1710000000000,
      },
    ];

    const { getByTestId, getByText } = render(
      <ReviewHistoryView
        historyEntries={entries}
        direction="pt-BR->en"
        onReturnToCourse={onReturnToCourseMock}
      />
    );

    expect(getByTestId('history-item-h1')).toBeTruthy();
    expect(getByTestId('outcome-badge-h1')).toBeTruthy();
    expect(getByText('Remembered')).toBeTruthy();
  });

  it('renders fallback label and missing reference badge when vocabId is not found', () => {
    const entries: ReviewHistoryEntry[] = [
      {
        id: 'h2',
        vocabId: 'missing-vocab-id',
        direction: 'pt-BR->en',
        outcome: 'needs-practice',
        completedAt: 1710000000000,
      },
    ];

    const { getByTestId, getByText } = render(
      <ReviewHistoryView
        historyEntries={entries}
        direction="pt-BR->en"
        onReturnToCourse={onReturnToCourseMock}
      />
    );

    expect(getByText('Unknown term')).toBeTruthy();
    expect(getByTestId('missing-vocab-badge-h2')).toBeTruthy();
    expect(getByText('Reference Missing')).toBeTruthy();
    expect(getByText('Needs Practice')).toBeTruthy();
  });
});
