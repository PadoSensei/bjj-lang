import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const {
    direction,
    setDirection,
    reviewStatistics,
    recordHistoryEntry,
  } = useCourse();

  return (
    <>
      <Text testID="direction-text">{direction}</Text>
      <Text testID="total-attempts">{reviewStatistics.totalAttempts}</Text>
      <Text testID="accuracy">{reviewStatistics.recallAccuracyPercentage}%</Text>
      <Text testID="distinct-vocab">{reviewStatistics.distinctVocabCount}</Text>
      <Button
        testID="add-history-btn"
        title="Add Entry"
        onPress={() => recordHistoryEntry('v1', 'remembered')}
      />
      <Button
        testID="switch-dir-btn"
        title="Switch Dir"
        onPress={() => setDirection('en->pt-BR')}
      />
    </>
  );
};

describe('CourseContext History & Statistics Integration', () => {
  it('updates statistics when new history entries are recorded', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <TestComponent />
      </CourseProvider>
    );

    expect(getByTestId('total-attempts').props.children).toBe(0);

    await act(async () => {
      fireEvent.press(getByTestId('add-history-btn'));
    });

    expect(getByTestId('total-attempts').props.children).toBe(1);
    expect(getByTestId('accuracy').props.children).toEqual([100, '%']);
    expect(getByTestId('distinct-vocab').props.children).toBe(1);
  });

  it('isolates history statistics by learning direction', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <TestComponent />
      </CourseProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId('add-history-btn'));
    });
    expect(getByTestId('total-attempts').props.children).toBe(1);

    await act(async () => {
      fireEvent.press(getByTestId('switch-dir-btn'));
    });

    expect(getByTestId('direction-text').props.children).toBe('en->pt-BR');
    expect(getByTestId('total-attempts').props.children).toBe(0);
  });
});
