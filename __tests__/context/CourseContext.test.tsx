import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { flushAsync } from '../../test-utils/flushAsync';
import { Text, Button } from 'react-native';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROGRESS_STORAGE_KEY } from '../../src/services/storage/progressStorage';
import {
  preferencesStorage,
  PREFERENCES_STORAGE_KEY,
} from '../../src/services/storage/preferencesStorage';

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
    expect(getByTestId('unit-1-progress').props.children).toBeCloseTo(1 / 3); // 1 of 3 lessons completed in unit 1

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
    expect(getByTestId('course-progress').props.children).toBe('0/7 (0%)');

    await act(async () => {
      fireEvent.press(getByTestId('complete-lesson-1-1-btn'));
    });

    expect(getByTestId('completed-ids').props.children).toBe('lesson-1-1');
    expect(getByTestId('course-progress').props.children).toBe('1/7 (14%)');

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

    await flushAsync();
    expect(getByTestId('completed-ids').props.children).toBe('lesson-1-1,lesson-1-2');

    expect(getByTestId('course-progress').props.children).toBe('2/7 (29%)');
    expect(getByTestId('unit-1-progress').props.children).toBeCloseTo(2 / 3); // 2 of 3 completed
  });
});

/** Issue #35 (P0-4): the selected direction persists across reloads. */
describe('CourseContext direction persistence', () => {
  let api: ReturnType<typeof useCourse>;
  const ApiCapture = () => {
    api = useCourse();
    return null;
  };

  /** A real app launch: no props, so the provider hydrates from storage. */
  const launch = async () => {
    const view = render(
      <CourseProvider>
        <ApiCapture />
      </CourseProvider>
    );
    await flushAsync();
    expect(api.isLoadingProgress).toBe(false);
    return view;
  };

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('starts in pt-BR->en on a first launch', async () => {
    await launch();
    expect(api.direction).toBe('pt-BR->en');
  });

  it('restores the last selected direction after a reload', async () => {
    const first = await launch();
    act(() => api.setDirection('en->pt-BR'));
    await flushAsync();
    expect((await preferencesStorage.loadPreferences()).lastDirection).toBe('en->pt-BR');
    first.unmount();

    await launch();
    expect(api.direction).toBe('en->pt-BR');
  });

  it('switching back is also remembered', async () => {
    await preferencesStorage.saveLastDirection('en->pt-BR');
    const first = await launch();
    expect(api.direction).toBe('en->pt-BR');

    act(() => api.setDirection('pt-BR->en'));
    await flushAsync();
    expect((await preferencesStorage.loadPreferences()).lastDirection).toBe('pt-BR->en');
    first.unmount();

    await launch();
    expect(api.direction).toBe('pt-BR->en');
  });

  it('falls back to pt-BR->en when the saved preference is corrupt', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, '{ broken');
    await launch();
    expect(api.direction).toBe('pt-BR->en');
  });

  it('an explicit initialDirection prop wins over the saved preference', async () => {
    await preferencesStorage.saveLastDirection('en->pt-BR');
    render(
      <CourseProvider initialDirection="pt-BR->en">
        <ApiCapture />
      </CourseProvider>
    );
    await flushAsync();
    expect(api.isLoadingProgress).toBe(false);
    expect(api.direction).toBe('pt-BR->en');
  });

  it('a direction chosen while loading is not overwritten by the saved one', async () => {
    await preferencesStorage.saveLastDirection('pt-BR->en');
    render(
      <CourseProvider>
        <ApiCapture />
      </CourseProvider>
    );
    expect(api.isLoadingProgress).toBe(true);
    act(() => api.setDirection('en->pt-BR'));

    await flushAsync();

    expect(api.isLoadingProgress).toBe(false);
    expect(api.direction).toBe('en->pt-BR');
    await flushAsync();
    expect((await preferencesStorage.loadPreferences()).lastDirection).toBe('en->pt-BR');
  });

  it('keeps the new direction in memory when saving it fails', async () => {
    await launch();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(AsyncStorage, 'setItem').mockImplementation(() => Promise.reject(new Error('disk full')));

    act(() => api.setDirection('en->pt-BR'));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(api.direction).toBe('en->pt-BR');
    expect(api.courseData.direction).toBe('en->pt-BR');
  });
});

