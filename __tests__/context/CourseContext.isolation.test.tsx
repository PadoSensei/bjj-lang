import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import { CourseDirection } from '../../src/components/ui/CourseDirectionSelector';
import { MOCK_COURSES } from '../../src/data/mockCourseData';
import { MOCK_LESSONS } from '../../src/data/mockLessons';

/**
 * Characterisation tests for review-direction isolation (issue #34, P0-3).
 *
 * pt-BR->en and en->pt-BR share vocabulary IDs (the '-pt' lessons alias the
 * canonical ones), so these tests prove that records, review outcomes, history
 * and persisted state stay separate per direction.
 */

type CourseApi = ReturnType<typeof useCourse>;

let api: CourseApi;

const ApiCapture = () => {
  api = useCourse();
  return <Text testID="direction">{api.direction}</Text>;
};

const emptyMap = () => ({ 'pt-BR->en': [], 'en->pt-BR': [] });

const renderWithEmptyState = (initialDirection: CourseDirection) =>
  render(
    <CourseProvider
      initialDirection={initialDirection}
      initialCompletedLessons={emptyMap()}
      initialReviewRecords={emptyMap()}
      initialHistoryRecords={emptyMap()}
    >
      <ApiCapture />
    </CourseProvider>
  );

/** First published lesson of a direction's course, e.g. lesson-1-1 or lesson-1-1-pt. */
const firstLessonId = (direction: CourseDirection): string =>
  MOCK_COURSES[direction].units[0].lessons[0].id;

const directionPairs: { first: CourseDirection; second: CourseDirection }[] = [
  { first: 'pt-BR->en', second: 'en->pt-BR' },
  { first: 'en->pt-BR', second: 'pt-BR->en' },
];

describe('CourseContext review-direction isolation', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('uses the same vocabulary IDs for a lesson in both directions (precondition)', () => {
    const ptEnIds = MOCK_LESSONS[firstLessonId('pt-BR->en')].vocabulary.map((v) => v.id);
    const enPtIds = MOCK_LESSONS[firstLessonId('en->pt-BR')].vocabulary.map((v) => v.id);

    expect(ptEnIds.length).toBeGreaterThan(0);
    expect(enPtIds).toEqual(ptEnIds);
  });

  it.each(directionPairs)(
    'reviewing a shared vocabulary item in $first leaves its $second record and history untouched',
    async ({ first, second }) => {
      renderWithEmptyState(first);

      // Enqueue the same vocabulary in both directions.
      await act(async () => {
        await api.markLessonComplete(firstLessonId(first));
      });
      await act(async () => {
        api.setDirection(second);
      });
      await act(async () => {
        await api.markLessonComplete(firstLessonId(second));
      });

      const sharedVocabId = MOCK_LESSONS[firstLessonId(first)].vocabulary[0].id;
      const untouchedRecord = api.activeReviewRecords.find((r) => r.vocabId === sharedVocabId);
      expect(untouchedRecord).toBeDefined();
      const snapshotOfSecond = { ...untouchedRecord! };

      // Review the shared item in the first direction only.
      await act(async () => {
        api.setDirection(first);
      });
      const futureDue = Date.now() + 2 * 24 * 60 * 60 * 1000;
      await act(async () => {
        await api.recordReviewOutcome(sharedVocabId, 'remembered', futureDue);
      });

      const reviewedRecord = api.activeReviewRecords.find((r) => r.vocabId === sharedVocabId)!;
      expect(reviewedRecord.direction).toBe(first);
      expect(reviewedRecord.reviewCount).toBe(1);
      expect(reviewedRecord.rememberedCount).toBe(1);
      expect(api.activeHistory).toHaveLength(1);
      expect(api.activeHistory[0].direction).toBe(first);

      // The second direction is exactly as it was.
      await act(async () => {
        api.setDirection(second);
      });
      const secondRecord = api.activeReviewRecords.find((r) => r.vocabId === sharedVocabId)!;
      expect(secondRecord).toEqual(snapshotOfSecond);
      expect(secondRecord.reviewCount).toBe(0);
      expect(api.activeHistory).toHaveLength(0);
    }
  );

  it.each(directionPairs)(
    'persists $first progress across a remount; $second keeps its own untouched cards and progress',
    async ({ first, second }) => {
      const lessonId = firstLessonId(first);
      const expectedVocabCount = MOCK_LESSONS[lessonId].vocabulary.length;

      // First launch: real hydration path (no injected initial state).
      const firstLaunch = render(
        <CourseProvider initialDirection={first}>
          <ApiCapture />
        </CourseProvider>
      );
      await waitFor(() => expect(api.isLoadingProgress).toBe(false));

      await act(async () => {
        await api.markLessonComplete(lessonId);
      });
      firstLaunch.unmount();

      // Second launch: everything must come back from storage.
      render(
        <CourseProvider initialDirection={first}>
          <ApiCapture />
        </CourseProvider>
      );
      await waitFor(() => expect(api.isLoadingProgress).toBe(false));

      expect(api.completedLessonIds).toEqual([lessonId]);
      expect(api.activeReviewRecords).toHaveLength(expectedVocabCount);
      expect(api.activeReviewRecords.every((r) => r.direction === first)).toBe(true);

      // ADR-009: the lesson's words are in the other deck too, as fresh cards of
      // that direction. Lesson progress and history stay per direction.
      await act(async () => {
        api.setDirection(second);
      });
      expect(api.completedLessonIds).toEqual([]);
      expect(api.activeReviewRecords).toHaveLength(expectedVocabCount);
      expect(api.activeReviewRecords.every((r) => r.direction === second && r.reviewCount === 0)).toBe(true);
      expect(api.activeHistory).toHaveLength(0);
    }
  );
});
