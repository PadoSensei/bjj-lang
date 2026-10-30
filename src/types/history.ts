import { z } from 'zod';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { ReviewOutcome } from './review';

export interface ReviewHistoryEntry {
  id: string;
  vocabId: string;
  direction: CourseDirection;
  outcome: ReviewOutcome;
  completedAt: number;
}

export type DirectionHistoryMap = Record<CourseDirection, ReviewHistoryEntry[]>;

export const ReviewHistoryEntrySchema = z.object({
  id: z.string(),
  vocabId: z.string(),
  direction: z.enum(['pt-BR->en', 'en->pt-BR']),
  outcome: z.enum(['remembered', 'needs-practice']),
  completedAt: z.number(),
});

export const DirectionHistorySchema = z.object({
  'pt-BR->en': z.array(ReviewHistoryEntrySchema).optional().transform((arr) => arr ?? []),
  'en->pt-BR': z.array(ReviewHistoryEntrySchema).optional().transform((arr) => arr ?? []),
});
