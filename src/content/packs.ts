/**
 * Content packs: themed sets of new content in JSON (ADR-008).
 *
 * A pack lives in content/curriculum/<belt>/<theme>/ as four files:
 * lexicon.json (new words, plus annotations on existing words), exercises.json,
 * story.json and scenario.json. Each file is validated on load with an error
 * that names the file and field. The registry adds every pack after seeding
 * the legacy lessons.
 */
import {
  AnnotationSchema,
  ExercisesFileSchema,
  LexiconFileSchema,
  ScenarioFileSchema,
  StoryFileSchema,
  parseContentFile,
} from '../data/contentSchema';
import type { Exercise, LexicalItem, Scenario, Story } from '../domain/content/types';
import type { z } from 'zod';

import whiteFirstClassLexicon from '../../content/curriculum/white/first-class/lexicon.json';
import whiteFirstClassExercises from '../../content/curriculum/white/first-class/exercises.json';
import whiteFirstClassStory from '../../content/curriculum/white/first-class/story.json';
import whiteFirstClassScenario from '../../content/curriculum/white/first-class/scenario.json';

export type ItemAnnotation = z.infer<typeof AnnotationSchema>;

export interface ContentPack {
  id: string;
  /** New words, with IDs not used anywhere else. */
  items: LexicalItem[];
  /** Extra metadata for existing words; their text and ID never change. */
  annotations: ItemAnnotation[];
  exercises: Exercise[];
  stories: Story[];
  scenarios: Scenario[];
}

function loadPack(
  id: string,
  folder: string,
  files: { lexicon: unknown; exercises: unknown; story: unknown; scenario: unknown }
): ContentPack {
  const lexicon = parseContentFile(LexiconFileSchema, files.lexicon, `${folder}/lexicon.json`);
  return {
    id,
    items: lexicon.items as LexicalItem[],
    annotations: lexicon.annotations,
    exercises: parseContentFile(ExercisesFileSchema, files.exercises, `${folder}/exercises.json`) as Exercise[],
    stories: [parseContentFile(StoryFileSchema, files.story, `${folder}/story.json`) as Story],
    scenarios: [parseContentFile(ScenarioFileSchema, files.scenario, `${folder}/scenario.json`) as Scenario],
  };
}

export const CONTENT_PACKS: ContentPack[] = [
  loadPack('white-first-class', 'white/first-class', {
    lexicon: whiteFirstClassLexicon,
    exercises: whiteFirstClassExercises,
    story: whiteFirstClassStory,
    scenario: whiteFirstClassScenario,
  }),
];

/**
 * The registry entries a pack adds: its new words, existing words with the
 * pack's annotations applied, and its exercises, stories and scenarios.
 * Throws, naming the pack, if a new word's ID is taken or an annotation
 * points at a word that does not exist.
 */
export function buildPackEntries(
  pack: ContentPack,
  getExisting: (id: string) => LexicalItem | undefined
): Pick<ContentPack, 'items' | 'exercises' | 'stories' | 'scenarios'> {
  for (const item of pack.items) {
    if (getExisting(item.id)) {
      throw new Error(`Content pack ${pack.id}: new word ${item.id} uses an ID that already exists.`);
    }
  }

  const annotated = pack.annotations.map((annotation) => {
    const existing = getExisting(annotation.id);
    if (!existing) {
      throw new Error(`Content pack ${pack.id}: annotation for unknown word ${annotation.id}.`);
    }
    return {
      ...existing,
      ...(annotation.cefr !== undefined && { cefr: annotation.cefr }),
      ...(annotation.reviewable !== undefined && { reviewable: annotation.reviewable }),
      ...(annotation.review !== undefined && { review: annotation.review }),
      ...(annotation.support !== undefined && { support: { ...existing.support, ...annotation.support } }),
    };
  });

  return {
    items: [...pack.items, ...annotated],
    exercises: pack.exercises,
    stories: pack.stories,
    scenarios: pack.scenarios,
  };
}
