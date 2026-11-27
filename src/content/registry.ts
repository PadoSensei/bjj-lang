/**
 * The canonical content registry (ADR-008, issue #37).
 *
 * Every mode looks content up here by stable ID. The existing lessons in
 * `src/data/mockLessons.ts` are the source of the seeded lexical items and
 * exercises; new content (stories, scenarios, White Belt pack) is added here
 * directly. Lookups never throw: unknown IDs return undefined.
 */
import { MOCK_LESSONS } from '../data/mockLessons';
import { MOCK_COURSES } from '../data/mockCourseData';
import type { VocabularyItem } from '../types/lesson';
import {
  BELT_DEFAULT_CEFR,
  Belt,
  ContentLesson,
  Exercise,
  LexicalItem,
  Scenario,
  Story,
} from '../domain/content/types';
import { ContentIndex, ContentIssue, ContentSet, validateAll } from '../domain/content/validate';

const lexicalItems = new Map<string, LexicalItem>();
const exercises = new Map<string, Exercise>();
const lessons = new Map<string, ContentLesson>();
const stories = new Map<string, Story>();
const scenarios = new Map<string, Scenario>();

/** Belt of each canonical lesson, from the unit that publishes it. */
function lessonBelts(): Map<string, Belt> {
  const belts = new Map<string, Belt>();
  for (const unit of MOCK_COURSES['pt-BR->en'].units) {
    for (const lesson of unit.lessons) {
      belts.set(lesson.id, unit.belt);
    }
  }
  return belts;
}

function seedFromLegacyLessons(): void {
  const belts = lessonBelts();
  const canonicalIds = Object.keys(MOCK_LESSONS).filter((id) => !id.endsWith('-pt'));

  for (const lessonId of canonicalIds) {
    const legacy = MOCK_LESSONS[lessonId];
    const belt = belts.get(lessonId);
    if (!belt) {
      throw new Error(`Content registry: lesson ${lessonId} is not published in any unit`);
    }

    for (const vocab of legacy.vocabulary) {
      if (!lexicalItems.has(vocab.id)) {
        lexicalItems.set(vocab.id, {
          ...vocab,
          belt,
          cefr: BELT_DEFAULT_CEFR[belt],
          reviewable: true,
          sourceLessonId: lessonId,
          review: { status: 'draft' },
        });
      }
    }

    for (const exercise of legacy.exercises) {
      exercises.set(exercise.id, exercise);
    }

    lessons.set(lessonId, {
      id: lessonId,
      belt,
      itemIds: legacy.vocabulary.map((v) => v.id),
      exerciseIds: legacy.exercises.map((e) => e.id),
    });
  }
}

seedFromLegacyLessons();

export const getLexicalItem = (id: string): LexicalItem | undefined => lexicalItems.get(id);

/** The legacy vocabulary fields of an item, without registry metadata. */
export function toVocabularyItem(item: LexicalItem): VocabularyItem {
  const vocab: VocabularyItem = { id: item.id, termPt: item.termPt, termEn: item.termEn };
  if (item.phonetic !== undefined) vocab.phonetic = item.phonetic;
  if (item.context !== undefined) vocab.context = item.context;
  if (item.examplePt !== undefined) vocab.examplePt = item.examplePt;
  if (item.exampleEn !== undefined) vocab.exampleEn = item.exampleEn;
  return vocab;
}
export const getExercise = (id: string): Exercise | undefined => exercises.get(id);
export const getLesson = (id: string): ContentLesson | undefined => lessons.get(id);
export const getStory = (id: string): Story | undefined => stories.get(id);
export const getScenario = (id: string): Scenario | undefined => scenarios.get(id);

export const listLexicalItems = (): LexicalItem[] => [...lexicalItems.values()];
export const listByBelt = (belt: Belt): LexicalItem[] =>
  listLexicalItems().filter((item) => item.belt === belt);
export const listLessons = (): ContentLesson[] => [...lessons.values()];
export const listExercises = (): Exercise[] => [...exercises.values()];
export const listStories = (): Story[] => [...stories.values()];
export const listScenarios = (): Scenario[] => [...scenarios.values()];

/** Every ID across all kinds of content, for uniqueness checks. */
export const listAllContentIds = (): string[] => [
  ...lexicalItems.keys(),
  ...exercises.keys(),
  ...lessons.keys(),
  ...stories.keys(),
  ...scenarios.keys(),
];

/** How validators look content up in this registry. */
export const contentIndex: ContentIndex = {
  getItemBelt: (id) => lexicalItems.get(id)?.belt,
  hasExercise: (id) => exercises.has(id),
};

/** Everything in the registry, in the shape the validators take. */
export const getContentSet = (): ContentSet => ({
  lexicalItems: listLexicalItems(),
  exercises: listExercises(),
  lessons: listLessons(),
  stories: listStories(),
  scenarios: listScenarios(),
  allIds: listAllContentIds(),
});

/** Run every content validator over the registry. An empty list means valid. */
export const validateRegistry = (): ContentIssue[] => validateAll(getContentSet(), contentIndex);
