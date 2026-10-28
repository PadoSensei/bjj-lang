import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROGRESS_STORAGE_KEY } from '../../src/services/storage/progressStorage';

const TestComponent = () => {
  const {
    direction,
    setDirection,
    courseData,
    completedLessonIds,
    markLessonComplete,
    courseProgress,
  } = useCourse();

  return (
    <>
      <Text testID="direction-text">{direction}</Text>
      <Text testID="course-title">{courseData.title}</Text>
      <Text testID="completed-ids">{completedLessonIds.join(',')}</Text>
      <Text testID="course-progress">
        {`${courseProgress.completedCount}/${courseProgress.totalCount} (${Math.round(courseProgress.progress * 100)}%)`}
      </Text>
      <Text testID="unit-1-progress">{courseData.units[0].progress}</Text>
      <Text testID="unit-1-lesson-1-completed">
        {courseData.units[0].lessons[0].completed ? 'true' : 'false'}
      </Text>

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
    </>
  );
};

describe('CourseContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('provides default direction and allows switching directions with isolated progress', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': ['lesson-1-1'], 'en->pt-BR': [] }}
      >
        <TestComponent />
      </CourseProvider>
    );

    expect(getByTestId('direction-text').props.children).toBe('pt-BR->en');
    expect(getByTestId('course-title').props.children).toBe('Aprenda Inglês para Jiu-Jitsu');
    expect(getByTestId('completed-ids').props.children).toBe('lesson-1-1');
    expect(getByTestId('unit-1-lesson-1-completed').props.children).toBe('true');
    expect(getByTestId('unit-1-progress').props.children).toBe(0.5); // 1 of 2 lessons completed in unit 1

    // Switch direction to en->pt-BR
    await act(async () => {
      fireEvent.press(getByTestId('switch-btn'));
    });

    expect(getByTestId('direction-text').props.children).toBe('en->pt-BR');
    expect(getByTestId('course-title').props.children).toBe('Learn Brazilian Portuguese for BJJ');
    expect(getByTestId('completed-ids').props.children).toBe('');
    expect(getByTestId('unit-1-lesson-1-completed').props.children).toBe('false');
    expect(getByTestId('unit-1-progress').props.children).toBe(0);
  });

  it('allows marking a lesson complete and persists it to storage', async () => {
    const { getByTestId } = render(
      <CourseProvider
        initialDirection="pt-BR->en"
        initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
      >
        <TestComponent />
      </CourseProvider>
    );

    expect(getByTestId('completed-ids').props.children).toBe('');
    expect(getByTestId('course-progress').props.children).toBe('0/4 (0%)');

    await act(async () => {
      fireEvent.press(getByTestId('complete-lesson-1-1-btn'));
    });

    expect(getByTestId('completed-ids').props.children).toBe('lesson-1-1');
    expect(getByTestId('course-progress').props.children).toBe('1/4 (25%)');

    // Verify written to AsyncStorage
    const storedStr = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
    expect(storedStr).not.toBeNull();
    const parsed = JSON.parse(storedStr!);
    expect(parsed['pt-BR->en']).toContain('lesson-1-1');
  });

  it('loads stored progress automatically on mount', async () => {
    await AsyncStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        'pt-BR->en': ['lesson-1-1', 'lesson-1-2'],
        'en->pt-BR': [],
      })
    );

    const { getByTestId } = render(
      <CourseProvider initialDirection="pt-BR->en">
        <TestComponent />
      </CourseProvider>
    );

    await waitFor(() => {
      expect(getByTestId('completed-ids').props.children).toBe('lesson-1-1,lesson-1-2');
    });

    expect(getByTestId('course-progress').props.children).toBe('2/4 (50%)');
    expect(getByTestId('unit-1-progress').props.children).toBe(1); // 2 of 2 completed
  });
});
