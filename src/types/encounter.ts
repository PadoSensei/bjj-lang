import { z } from 'zod';

/** Where a learner met a word (ADR-008). */
export const ENCOUNTER_SOURCES = ['reader', 'game', 'adventure', 'lesson'] as const;
export type EncounterSource = (typeof ENCOUNTER_SOURCES)[number];

export interface VocabEncounter {
  /** When the learner first met the item. */
  firstSeenAt: number;
  /** Each mode the item was met in, in the order first seen. */
  sources: EncounterSource[];
  /** How many times the item was met in total (taps, answers, choices, lessons). */
  lookups: number;
}

/** Encounters keyed by lexical item ID. Direction-independent. */
export type EncounterMap = Record<string, VocabEncounter>;

export const VocabEncounterSchema = z.object({
  firstSeenAt: z.number(),
  sources: z.array(z.enum(ENCOUNTER_SOURCES)),
  lookups: z.number().int().nonnegative(),
});

export const EncounterMapSchema = z.record(z.string(), VocabEncounterSchema);
