/**
 * Encounter and enqueue policy (ADR-008, ADR-009, issue #39).
 *
 * Pure functions: a word met anywhere is noted once per encounter, and a
 * reviewable word gets one independent card in each flashcard deck.
 */
import type { LexicalItem } from '../content/types';
import { COURSE_DIRECTIONS } from '../direction';
import type { EncounterMap, EncounterSource } from '../../types/encounter';
import type { DirectionReviewMap, ReviewRecord } from '../../types/review';

export interface EnqueueContext {
  now: number;
  source: EncounterSource;
  /** The story, scenario, exercise set or lesson the item was met in. */
  contentId?: string;
}

/**
 * New cards to add for an item: one per deck that does not have it yet.
 * Non-reviewable items never get cards. Existing cards are never touched.
 */
export function planEnqueue(item: LexicalItem, decks: DirectionReviewMap, context: EnqueueContext): ReviewRecord[] {
  if (!item.reviewable) {
    return [];
  }
  const lessonId = context.contentId ?? item.sourceLessonId ?? '';

  return COURSE_DIRECTIONS.filter((direction) => !(decks[direction] || []).some((r) => r.vocabId === item.id)).map(
    (direction) => ({
      id: item.id,
      vocabId: item.id,
      lessonId,
      direction,
      addedAt: context.now,
      lastReviewedAt: null,
      dueAt: context.now, // Immediately eligible for first review
      reviewCount: 0,
      rememberedCount: 0,
      needsPracticeCount: 0,
      source: context.source,
    })
  );
}

/** Append records to their own deck. Returns the same map when there is nothing to add. */
export function addRecords(decks: DirectionReviewMap, records: ReviewRecord[]): DirectionReviewMap {
  if (records.length === 0) {
    return decks;
  }
  const next: DirectionReviewMap = { 'pt-BR->en': [...(decks['pt-BR->en'] || [])], 'en->pt-BR': [...(decks['en->pt-BR'] || [])] };
  for (const record of records) {
    next[record.direction].push(record);
  }
  return next;
}

/** Note one encounter with an item. Returns a new map. */
export function noteEncounter(
  encounters: EncounterMap,
  itemId: string,
  source: EncounterSource,
  now: number
): EncounterMap {
  const previous = encounters[itemId];
  return {
    ...encounters,
    [itemId]: previous
      ? {
          firstSeenAt: previous.firstSeenAt,
          sources: previous.sources.includes(source) ? previous.sources : [...previous.sources, source],
          lookups: previous.lookups + 1,
        }
      : { firstSeenAt: now, sources: [source], lookups: 1 },
  };
}
