import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REVIEW_STORAGE_KEY } from '../../src/services/storage/reviewStorage';

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

    // Verify written to storage
    const stored = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed['pt-BR->en']).toHaveLength(3);
  });

  it('isolates review queues between directions', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
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
    expect(getByTestId('due-count').props.children).toBe(0);
    expect(getByTestId('total-records-count').props.children).toBe(0);
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
