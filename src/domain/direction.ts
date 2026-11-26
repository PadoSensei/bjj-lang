/**
 * The two isolated review directions (ADR-009).
 * - 'pt-BR->en': "Português → English", see Portuguese, recall English (production).
 * - 'en->pt-BR': "English → Português", see English, recall the Portuguese meaning (recognition).
 */
export type CourseDirection = 'pt-BR->en' | 'en->pt-BR';

export const COURSE_DIRECTIONS: readonly CourseDirection[] = ['pt-BR->en', 'en->pt-BR'];
