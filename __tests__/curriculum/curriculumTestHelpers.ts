import { MOCK_COURSES, CourseData, LessonSummary } from '../../src/data/mockCourseData';
import { MOCK_LESSONS } from '../../src/data/mockLessons';
import { CourseDirection } from '../../src/components/ui/CourseDirectionSelector';
import { LessonData, Exercise, MultipleChoiceExercise, TranslationRecallExercise, VocabularyItem } from '../../src/types/lesson';

export interface PublishedLessonRef {
  direction: CourseDirection;
  unitId: string;
  unitTitle: string;
  lessonSummary: LessonSummary;
}

/**
 * Enumerates all published lessons across all course directions directly from MOCK_COURSES metadata.
 */
export function getAllPublishedLessonSummaries(): PublishedLessonRef[] {
  const list: PublishedLessonRef[] = [];
  const directions: CourseDirection[] = ['pt-BR->en', 'en->pt-BR'];

  directions.forEach((direction) => {
    const course: CourseData = MOCK_COURSES[direction];
    course.units.forEach((unit) => {
      unit.lessons.forEach((lessonSummary) => {
        list.push({
          direction,
          unitId: unit.id,
          unitTitle: unit.title,
          lessonSummary,
        });
      });
    });
  });

  return list;
}

/**
 * Returns distinct canonical lesson IDs (e.g. lesson-1-1, lesson-1-2) from MOCK_LESSONS.
 * Filters out alias keys (such as keys ending in '-pt').
 */
export function getCanonicalLessonKeys(): string[] {
  return Object.keys(MOCK_LESSONS).filter((id) => !id.endsWith('-pt'));
}

/**
 * Resolves a lesson ID in MOCK_LESSONS, throwing informative error if missing.
 */
export function resolveLessonData(lessonId: string): LessonData {
  const lesson = MOCK_LESSONS[lessonId];
  if (!lesson) {
    throw new Error(`Failed to resolve lesson data for ID: "${lessonId}" in MOCK_LESSONS.`);
  }
  return lesson;
}

/**
 * Gathers all vocabulary items and their source canonical lesson IDs.
 */
export function getAllVocabularyItems(): { lessonId: string; item: VocabularyItem }[] {
  const results: { lessonId: string; item: VocabularyItem }[] = [];
  const canonicalKeys = getCanonicalLessonKeys();

  canonicalKeys.forEach((key) => {
    const lesson = resolveLessonData(key);
    lesson.vocabulary.forEach((item) => {
      results.push({ lessonId: key, item });
    });
  });

  return results;
}

/**
 * Gathers all exercises and their source canonical lesson IDs.
 */
export function getAllExercises(): { lessonId: string; exercise: Exercise }[] {
  const results: { lessonId: string; exercise: Exercise }[] = [];
  const canonicalKeys = getCanonicalLessonKeys();

  canonicalKeys.forEach((key) => {
    const lesson = resolveLessonData(key);
    lesson.exercises.forEach((exercise) => {
      results.push({ lessonId: key, exercise });
    });
  });

  return results;
}

/**
 * Validates multiple-choice exercise invariants:
 * - Minimum 2 options
 * - Valid correctIndex bounds (0 <= correctIndex < options.length)
 * - Non-empty prompts, options, and explanations in both pt and en
 */
export function validateMultipleChoiceExercise(lessonId: string, ex: MultipleChoiceExercise): void {
  if (ex.options.length < 2) {
    throw new Error(
      `[${lessonId}] Exercise ${ex.id}: multiple-choice must have at least 2 options, found ${ex.options.length}.`
    );
  }

  if (ex.correctIndex < 0 || ex.correctIndex >= ex.options.length) {
    throw new Error(
      `[${lessonId}] Exercise ${ex.id}: correctIndex ${ex.correctIndex} is out of bounds (options length: ${ex.options.length}).`
    );
  }

  if (!ex.prompt.pt.trim() || !ex.prompt.en.trim()) {
    throw new Error(`[${lessonId}] Exercise ${ex.id}: prompt has empty localized text.`);
  }

  ex.options.forEach((opt, idx) => {
    if (!opt.pt.trim() || !opt.en.trim()) {
      throw new Error(`[${lessonId}] Exercise ${ex.id}: option ${idx} has empty localized text.`);
    }
  });

  if (!ex.explanation || !ex.explanation.pt.trim() || !ex.explanation.en.trim()) {
    throw new Error(`[${lessonId}] Exercise ${ex.id}: explanation is missing or empty in pt/en.`);
  }
}

/**
 * Validates translation-recall exercise invariants:
 * - Non-empty prompt, targetAnswer, and explanation in both pt and en
 * - Non-empty hint in both pt and en if provided
 */
export function validateTranslationRecallExercise(lessonId: string, ex: TranslationRecallExercise): void {
  if (!ex.prompt.pt.trim() || !ex.prompt.en.trim()) {
    throw new Error(`[${lessonId}] Exercise ${ex.id}: prompt has empty localized text.`);
  }

  if (!ex.targetAnswer.pt.trim() || !ex.targetAnswer.en.trim()) {
    throw new Error(`[${lessonId}] Exercise ${ex.id}: targetAnswer has empty localized text.`);
  }

  if (!ex.explanation || !ex.explanation.pt.trim() || !ex.explanation.en.trim()) {
    throw new Error(`[${lessonId}] Exercise ${ex.id}: explanation is missing or empty in pt/en.`);
  }

  if (ex.hint) {
    if (!ex.hint.pt.trim() || !ex.hint.en.trim()) {
      throw new Error(`[${lessonId}] Exercise ${ex.id}: hint was provided but has empty localized text.`);
    }
  }
}
