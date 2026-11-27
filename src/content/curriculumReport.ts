/**
 * The data behind the curriculum review page (/curriculum).
 *
 * Pure functions over a ContentSet: they group, describe and filter content
 * for reviewers. Nothing here reads learner data.
 */
import type { Belt, Cefr, Exercise, LocalizedText } from '../domain/content/types';
import type { ContentIssue, ContentSet } from '../domain/content/validate';
import type { LessonData } from '../types/lesson';

export const BELT_ORDER: Belt[] = ['white', 'blue', 'purple', 'brown', 'black'];

export interface CurriculumWordRow {
  id: string;
  en: string;
  pt: string;
  belt: Belt;
  cefr: Cefr;
  reviewable: boolean;
  status: 'draft' | 'reviewed';
  reviewer?: string;
  /** The item's own support.pt, otherwise the lesson's Portuguese context. */
  explanationPt?: string;
  exampleEn?: string;
  examplePt?: string;
  /** Lessons that include this word. */
  lessonIds: string[];
}

export interface CurriculumLessonRow {
  id: string;
  title?: LocalizedText;
  itemIds: string[];
  exerciseIds: string[];
}

export interface CurriculumExerciseRow {
  id: string;
  type: Exercise['type'];
  prompt: LocalizedText;
  answer: LocalizedText;
}

export interface CurriculumBeltSection {
  belt: Belt;
  words: CurriculumWordRow[];
  lessons: CurriculumLessonRow[];
}

export interface CurriculumReport {
  totals: {
    words: number;
    lessons: number;
    exercises: number;
    stories: number;
    scenarios: number;
    reviewed: number;
    draft: number;
    issues: number;
  };
  belts: CurriculumBeltSection[];
  exercises: CurriculumExerciseRow[];
  stories: ContentSet['stories'];
  scenarios: ContentSet['scenarios'];
  issues: ContentIssue[];
}

/** Lesson titles from the legacy lesson data, keyed by canonical lesson ID. */
export function lessonTitlesFromLegacy(lessons: Record<string, LessonData>): Record<string, LocalizedText> {
  const titles: Record<string, LocalizedText> = {};
  for (const [key, lesson] of Object.entries(lessons)) {
    if (!key.endsWith('-pt')) titles[lesson.id] = lesson.title;
  }
  return titles;
}

function describeExercise(exercise: Exercise): CurriculumExerciseRow {
  return {
    id: exercise.id,
    type: exercise.type,
    prompt: exercise.prompt,
    answer: exercise.type === 'multiple-choice' ? exercise.options[exercise.correctIndex] : exercise.targetAnswer,
  };
}

export function buildCurriculumReport(
  content: ContentSet,
  issues: ContentIssue[],
  lessonTitles: Record<string, LocalizedText>
): CurriculumReport {
  const lessonsByItem = new Map<string, string[]>();
  for (const lesson of content.lessons) {
    for (const itemId of lesson.itemIds) {
      lessonsByItem.set(itemId, [...(lessonsByItem.get(itemId) ?? []), lesson.id]);
    }
  }

  const words: CurriculumWordRow[] = content.lexicalItems.map((item) => ({
    id: item.id,
    en: item.termEn,
    pt: item.termPt,
    belt: item.belt,
    cefr: item.cefr,
    reviewable: item.reviewable,
    status: item.review.status,
    reviewer: item.review.reviewer,
    explanationPt: item.support?.pt ?? item.context?.pt,
    exampleEn: item.exampleEn,
    examplePt: item.examplePt,
    lessonIds: lessonsByItem.get(item.id) ?? [],
  }));

  const belts = BELT_ORDER.map((belt) => ({
    belt,
    words: words.filter((w) => w.belt === belt),
    lessons: content.lessons
      .filter((l) => l.belt === belt)
      .map((l) => ({ id: l.id, title: lessonTitles[l.id], itemIds: l.itemIds, exerciseIds: l.exerciseIds })),
  })).filter((section) => section.words.length > 0 || section.lessons.length > 0);

  const exerciseRows = content.exercises.map(describeExercise);
  const reviewed = words.filter((w) => w.status === 'reviewed').length;

  return {
    totals: {
      words: words.length,
      lessons: content.lessons.length,
      exercises: exerciseRows.length,
      stories: content.stories.length,
      scenarios: content.scenarios.length,
      reviewed,
      draft: words.length - reviewed,
      issues: issues.length,
    },
    belts,
    exercises: exerciseRows,
    stories: content.stories,
    scenarios: content.scenarios,
    issues,
  };
}

export interface CurriculumFilters {
  belt?: Belt;
  status?: 'draft' | 'reviewed';
  query?: string;
}

/** Lowercase and strip accents, so "nao" finds "não". */
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function filterCurriculumItems(rows: CurriculumWordRow[], filters: CurriculumFilters): CurriculumWordRow[] {
  const query = filters.query?.trim() ? fold(filters.query.trim()) : undefined;
  return rows.filter(
    (row) =>
      (!filters.belt || row.belt === filters.belt) &&
      (!filters.status || row.status === filters.status) &&
      (!query || [row.id, row.en, row.pt].some((text) => fold(text).includes(query)))
  );
}
