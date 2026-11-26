/**
 * Canonical learning-content types (ADR-008).
 *
 * Every mode (Reader, Games, Adventure, Flashcards, Lessons) references this
 * content by stable ID. Existing `vocab-*`, `ex-*` and `lesson-*` IDs are frozen.
 */
import type { Exercise, LocalizedText, VocabularyItem } from '../../types/lesson';

export type { Exercise, LocalizedText };

/** Language-learning milestones, never martial-arts rank. Only white and blue are in the POC. */
export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export type Cefr = 'pre-A1' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

/** Level used for seeded content until an editor sets it explicitly. */
export const BELT_DEFAULT_CEFR: Record<Belt, Cefr> = {
  white: 'A1',
  blue: 'A2',
  purple: 'B1',
  brown: 'B2',
  black: 'C1',
};

export interface ContentReview {
  status: 'draft' | 'reviewed';
  /** Named bilingual, BJJ-aware reviewer (docs/content/CURRICULUM.md). */
  reviewer?: string;
}

/**
 * A word or phrase. Extends the legacy VocabularyItem so existing lesson and
 * review UI keeps working while content moves to the registry.
 */
export interface LexicalItem extends VocabularyItem {
  belt: Belt;
  cefr: Cefr;
  /** Whether meeting this item adds it to the flashcard decks (ADR-009). */
  reviewable: boolean;
  /** Explanation in the learner's support language. White Belt requires `pt`. */
  support?: { pt?: string; en?: string };
  /** First lesson that introduces the item, when it came from a lesson. */
  sourceLessonId?: string;
  review: ContentReview;
}

/** A lesson as a list of references into the registry. */
export interface ContentLesson {
  id: string;
  belt: Belt;
  itemIds: string[];
  exerciseIds: string[];
}

export interface StoryToken {
  text: string;
  /** Set when the token is a tappable lexical item. */
  itemId?: string;
}

export interface Story {
  id: string; // story-<belt>-<slug>
  belt: Belt;
  title: LocalizedText;
  pages: { id: string; tokens: StoryToken[]; pt: string }[];
  comprehensionExerciseIds: string[];
  review: ContentReview;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  itemIds: string[];
  feedback: LocalizedText;
  nextNodeId: string;
}

export interface ScenarioNode {
  narrative: LocalizedText;
  ending?: 'good' | 'retry';
  choices: ScenarioChoice[];
}

/** A Choose Your Own Adventure situation. */
export interface Scenario {
  id: string; // scn-<belt>-<slug>
  belt: Belt;
  title: LocalizedText;
  startNodeId: string;
  nodes: Record<string, ScenarioNode>;
  review: ContentReview;
}
