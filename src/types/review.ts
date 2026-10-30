import { z } from 'zod';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';

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
});

export const DirectionReviewSchema = z.object({
  'pt-BR->en': z.array(ReviewRecordSchema).optional().transform((arr) => arr ?? []),
  'en->pt-BR': z.array(ReviewRecordSchema).optional().transform((arr) => arr ?? []),
});
