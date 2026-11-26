import { z } from 'zod';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { ENCOUNTER_SOURCES, EncounterSource } from './encounter';

export type ReviewOutcome = 'remembered' | 'needs-practice';

export interface ReviewRecord {
  id: string;
  vocabId: string;
  lessonId: string;
  direction: CourseDirection;
  addedAt: number;
  lastReviewedAt: number | null;
  dueAt: number;
  reviewCount: number;
  rememberedCount: number;
  needsPracticeCount: number;
  /** Where the learner first met the item. Absent on records from before the pivot. */
  source?: EncounterSource;
}

export type DirectionReviewMap = Record<CourseDirection, ReviewRecord[]>;

export const ReviewRecordSchema = z.object({
  id: z.string(),
  vocabId: z.string(),
  lessonId: z.string(),
  direction: z.enum(['pt-BR->en', 'en->pt-BR']),
  addedAt: z.number(),
  lastReviewedAt: z.number().nullable(),
  dueAt: z.number(),
  reviewCount: z.number().nonnegative(),
  rememberedCount: z.number().nonnegative(),
  needsPracticeCount: z.number().nonnegative(),
  // Optional so records saved before the pivot still load (ADR-008: additive changes only).
  source: z.enum(ENCOUNTER_SOURCES).optional(),
});

export const DirectionReviewSchema = z.object({
  'pt-BR->en': z.array(ReviewRecordSchema).optional().transform((arr) => arr ?? []),
  'en->pt-BR': z.array(ReviewRecordSchema).optional().transform((arr) => arr ?? []),
});
