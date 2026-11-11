import React from 'react';
import { renderHook, act as hookAct } from '@testing-library/react-native';
import { render, act } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_COURSES } from '../../src/data/mockCourseData';
import { MOCK_LESSONS } from '../../src/data/mockLessons';
import { useLesson, getFormattedExerciseData } from '../../src/features/lesson/useLesson';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';
import { CourseDirection } from '../../src/components/ui/CourseDirectionSelector';
import { MultipleChoiceExercise, TranslationRecallExercise } from '../../src/types/lesson';
import {
  getAllPublishedLessonSummaries,
  getCanonicalLessonKeys,
  resolveLessonData,
  getAllVocabularyItems,
  getAllExercises,
  validateMultipleChoiceExercise,
  validateTranslationRecallExercise,
} from './curriculumTestHelpers';

describe('Curriculum-Wide Integrity Suite (M2.4)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  // =========================================================================
  // 1. Curriculum Parity & Bidirectional Resolution
  // =========================================================================
  describe('1. Curriculum Parity & Bidirectional Resolution', () => {
    it('resolves every course metadata lesson to an implemented lesson in MOCK_LESSONS', () => {
      const published = getAllPublishedLessonSummaries();
      expect(published.length).toBeGreaterThan(0);

      published.forEach(({ direction, unitId, lessonSummary }) => {
        const lesson = MOCK_LESSONS[lessonSummary.id];
        expect(lesson).toBeDefined();
        if (!lesson) {
          throw new Error(
            `[Parity Error] Metadata lesson "${lessonSummary.id}" in unit "${unitId}" (${direction}) does not exist in MOCK_LESSONS.`
          );
        }
        expect(lesson.id).toBeTruthy();
        expect(lesson.unitId).toBeTruthy();
      });
    });

    it('ensures every implemented published lesson in MOCK_LESSONS is represented in course metadata', () => {
      const published = getAllPublishedLessonSummaries();
      const metadataLessonIdSet = new Set(published.map((p) => p.lessonSummary.id));

      Object.keys(MOCK_LESSONS).forEach((lessonId) => {
        expect(metadataLessonIdSet.has(lessonId)).toBe(true);
        if (!metadataLessonIdSet.has(lessonId)) {
          throw new Error(
            `[Orphan Error] Implemented lesson "${lessonId}" in MOCK_LESSONS is missing from course metadata.`
          );
        }
      });
    });

    it('resolves both language directions correctly with full bidirectional equivalence', () => {
      const canonicalKeys = getCanonicalLessonKeys();
      expect(canonicalKeys.length).toBe(7);

      canonicalKeys.forEach((key) => {
        const ptToEnLesson = resolveLessonData(key);
        const enToPtKey = `${key}-pt`;
        const enToPtLesson = resolveLessonData(enToPtKey);

        expect(ptToEnLesson).toBeDefined();
        expect(enToPtLesson).toBeDefined();

        // Title and objective should provide both pt and en text
        expect(ptToEnLesson.title.pt.trim().length).toBeGreaterThan(0);
        expect(ptToEnLesson.title.en.trim().length).toBeGreaterThan(0);
        expect(ptToEnLesson.objective.pt.trim().length).toBeGreaterThan(0);
        expect(ptToEnLesson.objective.en.trim().length).toBeGreaterThan(0);

        // Aliased lesson should match canonical lesson data
        expect(enToPtLesson.id).toBe(ptToEnLesson.id);
        expect(enToPtLesson.vocabulary).toHaveLength(ptToEnLesson.vocabulary.length);
        expect(enToPtLesson.exercises).toHaveLength(ptToEnLesson.exercises.length);
      });
    });
  });

  // =========================================================================
  // 2. Metadata Consistency & Concept Counts
  // =========================================================================
  describe('2. Metadata Consistency & Concept Counts', () => {
    it('verifies conceptCount strictly matches the actual vocabulary count across all lessons', () => {
      const published = getAllPublishedLessonSummaries();

      published.forEach(({ direction, unitId, lessonSummary }) => {
        const lesson = resolveLessonData(lessonSummary.id);
        const actualVocabCount = lesson.vocabulary.length;

        expect(lessonSummary.conceptCount).toBe(actualVocabCount);
        if (lessonSummary.conceptCount !== actualVocabCount) {
          throw new Error(
            `[Count Mismatch] Lesson "${lessonSummary.id}" in unit "${unitId}" (${direction}) has conceptCount=${lessonSummary.conceptCount}, but implemented vocabulary has ${actualVocabCount} items.`
          );
        }
      });
    });

    it('verifies non-empty titles, descriptions, and positive estimatedMinutes in metadata', () => {
      const published = getAllPublishedLessonSummaries();

      published.forEach(({ lessonSummary }) => {
        expect(lessonSummary.title.trim().length).toBeGreaterThan(0);
        expect(lessonSummary.description.trim().length).toBeGreaterThan(0);
        expect(lessonSummary.estimatedMinutes).toBeGreaterThan(0);
        expect(typeof lessonSummary.completed).toBe('boolean');
      });
    });
  });

  // =========================================================================
  // 3. Vocabulary and Exercise ID Uniqueness
  // =========================================================================
  describe('3. Vocabulary and Exercise ID Uniqueness', () => {
    it('ensures all vocabulary IDs are globally unique across all lessons', () => {
      const allVocab = getAllVocabularyItems();
      const seenIds = new Map<string, string>();

      allVocab.forEach(({ lessonId, item }) => {
        expect(item.id).toMatch(/^vocab-\d+-\d+-\d+$/);
        if (seenIds.has(item.id)) {
          throw new Error(
            `[Duplicate Vocab ID] "${item.id}" in lesson "${lessonId}" conflicts with previous definition in lesson "${seenIds.get(item.id)}".`
          );
        }
        seenIds.set(item.id, lessonId);
      });

      expect(seenIds.size).toBe(allVocab.length);
    });

    it('ensures all exercise IDs are globally unique across all lessons', () => {
      const allEx = getAllExercises();
      const seenIds = new Map<string, string>();

      allEx.forEach(({ lessonId, exercise }) => {
        expect(exercise.id).toMatch(/^ex-\d+-\d+-(mc|recall)\d+$/);
        if (seenIds.has(exercise.id)) {
          throw new Error(
            `[Duplicate Exercise ID] "${exercise.id}" in lesson "${lessonId}" conflicts with previous definition in lesson "${seenIds.get(exercise.id)}".`
          );
        }
        seenIds.set(exercise.id, lessonId);
      });

      expect(seenIds.size).toBe(allEx.length);
    });
  });

  // =========================================================================
  // 4. Exercise Schema & Content Integrity
  // =========================================================================
  describe('4. Exercise Schema & Content Integrity', () => {
    it('validates multiple-choice exercise answer indices and options', () => {
      const allEx = getAllExercises();
      const mcExercises = allEx.filter(({ exercise }) => exercise.type === 'multiple-choice');
      expect(mcExercises.length).toBeGreaterThan(0);

      mcExercises.forEach(({ lessonId, exercise }) => {
        validateMultipleChoiceExercise(lessonId, exercise as MultipleChoiceExercise);
      });
    });

    it('validates translation-recall exercise schemas and target answers', () => {
      const allEx = getAllExercises();
      const recallExercises = allEx.filter(({ exercise }) => exercise.type === 'translation-recall');
      expect(recallExercises.length).toBeGreaterThan(0);

      recallExercises.forEach(({ lessonId, exercise }) => {
        validateTranslationRecallExercise(lessonId, exercise as TranslationRecallExercise);
      });
    });

    it('ensures exercise explanations and feedback are non-empty in both languages', () => {
      const allEx = getAllExercises();

      allEx.forEach(({ lessonId, exercise }) => {
        expect(exercise.explanation).toBeDefined();
        expect(exercise.explanation?.pt.trim().length).toBeGreaterThan(0);
        expect(exercise.explanation?.en.trim().length).toBeGreaterThan(0);
        if (!exercise.explanation?.pt.trim() || !exercise.explanation?.en.trim()) {
          throw new Error(
            `[Empty Explanation] Exercise "${exercise.id}" in lesson "${lessonId}" has empty explanation text.`
          );
        }
      });
    });
  });

  // =========================================================================
  // 5. Bilingual Exercise Formatting
  // =========================================================================
  describe('5. Bilingual Exercise Formatting', () => {
    it('formats exercises correctly for both pt-BR->en and en->pt-BR without runtime errors', () => {
      const canonicalKeys = getCanonicalLessonKeys();
      const directions: CourseDirection[] = ['pt-BR->en', 'en->pt-BR'];

      canonicalKeys.forEach((key) => {
        const lesson = resolveLessonData(key);

        directions.forEach((direction) => {
          lesson.exercises.forEach((ex) => {
            const formatted = getFormattedExerciseData(ex, direction, lesson.vocabulary);

            expect(formatted.promptText.trim().length).toBeGreaterThan(0);
            expect(formatted.explanationText).toBeDefined();
            expect(formatted.explanationText?.trim().length).toBeGreaterThan(0);

            if (ex.type === 'multiple-choice') {
              expect(formatted.optionsText).toBeDefined();
              expect(formatted.optionsText!.length).toBeGreaterThanOrEqual(2);
              formatted.optionsText!.forEach((optText, optIdx) => {
                expect(optText.trim().length).toBeGreaterThan(0);
                if (!optText.trim()) {
                  throw new Error(
                    `[Formatting Error] Lesson "${key}", exercise "${ex.id}", option ${optIdx} yielded empty text in ${direction}.`
                  );
                }
              });
            } else if (ex.type === 'translation-recall') {
              expect(formatted.targetAnswerText?.trim().length).toBeGreaterThan(0);
            }
          });
        });
      });
    });
  });

  // =========================================================================
  // 6. Lesson Playability via useLesson
  // =========================================================================
  describe('6. Lesson Playability via useLesson', () => {
    const published = getAllPublishedLessonSummaries();

    published.forEach(({ direction, lessonSummary }) => {
      it(`plays lesson "${lessonSummary.id}" in direction "${direction}" to 100% completion`, () => {
        let completedLessonId: string | null = null;
        const { result } = renderHook(() =>
          useLesson(lessonSummary.id, direction, {
            onComplete: (id) => {
              completedLessonId = id;
            },
          })
        );

        expect(result.current.step).toBe('vocabulary');
        expect(result.current.lesson).toBeDefined();

        hookAct(() => {
          result.current.startExercises();
        });
        expect(result.current.step).toBe('exercise');

        const totalExercises = result.current.lesson?.exercises.length || 0;
        expect(totalExercises).toBeGreaterThan(0);

        for (let i = 0; i < totalExercises; i++) {
          const currentEx = result.current.currentExercise;
          expect(currentEx).toBeDefined();

          if (currentEx?.type === 'multiple-choice') {
            hookAct(() => {
              result.current.selectOption(currentEx.correctIndex);
            });
            hookAct(() => {
              result.current.submitMultipleChoice();
            });
          } else {
            hookAct(() => {
              result.current.revealRecallAnswer();
            });
            hookAct(() => {
              result.current.submitRecallRating('correct');
            });
          }

          hookAct(() => {
            result.current.nextStep();
          });
        }

        expect(result.current.step).toBe('completion');
        expect(completedLessonId).toBeTruthy();
        expect(result.current.score.percentage).toBe(100);
        expect(result.current.score.totalCorrect).toBe(totalExercises);
        expect(result.current.score.totalExercises).toBe(totalExercises);
      });
    });
  });

  // =========================================================================
  // 7. Review Queue Direction Isolation
  // =========================================================================
  describe('7. Review Queue Direction Isolation', () => {
    const ReviewIsolationTestHarness = ({
      onMount,
    }: {
      onMount: (actions: {
        setDirection: (dir: CourseDirection) => void;
        markComplete: (id: string) => Promise<boolean>;
      }) => void;
    }) => {
      const { direction, setDirection, markLessonComplete, dueReviewCount, activeReviewRecords } =
        useCourse();

      React.useEffect(() => {
        onMount({
          setDirection,
          markComplete: markLessonComplete,
        });
      }, [markLessonComplete, onMount, setDirection]);

      return (
        <>
          <Text testID="current-direction">{direction}</Text>
          <Text testID="due-count">{dueReviewCount}</Text>
          <Text testID="records-count">{activeReviewRecords.length}</Text>
          <Button testID="switch-en-btn" title="EN" onPress={() => setDirection('pt-BR->en')} />
          <Button testID="switch-pt-btn" title="PT" onPress={() => setDirection('en->pt-BR')} />
        </>
      );
    };

    it('enqueues vocabulary on lesson completion in pt-BR->en without leaking to en->pt-BR across all canonical lessons', async () => {
      let harnessActions!: {
        setDirection: (dir: CourseDirection) => void;
        markComplete: (id: string) => Promise<boolean>;
      };

      const { getByTestId } = render(
        <CourseProvider
          initialDirection="pt-BR->en"
          initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
          initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
          initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        >
          <ReviewIsolationTestHarness onMount={(actions) => { harnessActions = actions; }} />
        </CourseProvider>
      );

      const canonicalKeys = getCanonicalLessonKeys();
      let cumulativePtEnVocab = 0;

      for (const lessonId of canonicalKeys) {
        const lesson = resolveLessonData(lessonId);
        cumulativePtEnVocab += lesson.vocabulary.length;

        // Ensure we are in pt-BR->en
        await act(async () => {
          harnessActions.setDirection('pt-BR->en');
        });

        // Complete lesson in pt-BR->en
        await act(async () => {
          await harnessActions.markComplete(lessonId);
        });

        expect(Number(getByTestId('records-count').props.children)).toBe(cumulativePtEnVocab);

        // Switch to en->pt-BR: review queue should remain 0
        await act(async () => {
          harnessActions.setDirection('en->pt-BR');
        });
        expect(Number(getByTestId('records-count').props.children)).toBe(0);
      }
    });
  });

  // =========================================================================
  // 8. Unit & Lesson Ordering and Internal Consistency
  // =========================================================================
  describe('8. Unit & Lesson Ordering and Internal Consistency', () => {
    it('maintains consistent unit ordering, belt progressions, and lesson sequences between directions', () => {
      const ptCourse = MOCK_COURSES['pt-BR->en'];
      const enCourse = MOCK_COURSES['en->pt-BR'];

      expect(ptCourse.units.length).toBe(enCourse.units.length);
      expect(ptCourse.units.length).toBe(3);

      ptCourse.units.forEach((ptUnit, uIdx) => {
        const enUnit = enCourse.units[uIdx];

        expect(ptUnit.belt).toBe(enUnit.belt);
        expect(ptUnit.lessons.length).toBe(enUnit.lessons.length);

        ptUnit.lessons.forEach((ptLesson, lIdx) => {
          const enLesson = enUnit.lessons[lIdx];

          // Check that en lesson id corresponds to pt lesson id with -pt suffix
          expect(enLesson.id).toBe(`${ptLesson.id}-pt`);
          expect(enLesson.conceptCount).toBe(ptLesson.conceptCount);
          expect(enLesson.estimatedMinutes).toBe(ptLesson.estimatedMinutes);

          // Verify lesson unitId points to unit number
          const canonicalData = resolveLessonData(ptLesson.id);
          expect(canonicalData.unitId).toBe(`unit-${uIdx + 1}`);
        });
      });
    });
  });
});
