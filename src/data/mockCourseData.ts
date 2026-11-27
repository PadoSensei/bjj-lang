/**
 * Thin loader: imports pre-validated course metadata from
 * `content/curriculum/courses.json`.
 *
 * Content editors should edit the JSON file directly — not this file.
 * Runtime Zod validation lives in `src/data/contentSchema.ts`.
 *
 * NOTE: The `progress` field on each unit in the JSON is a static initializer
 * (snapshot from initial seed data). At runtime, `CourseContext` overwrites
 * it with computed progress. The JSON value is accepted by the schema but
 * treated as a default baseline only.
 */

import { BeltType } from '../theme/tokens';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { parseCoursesFile } from './contentSchema';

import _coursesRaw from '../../content/curriculum/courses.json';

// ---------------------------------------------------------------------------
// Re-export domain interfaces (unchanged — consumers import from here)
// ---------------------------------------------------------------------------

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  conceptCount: number;
  completed?: boolean;
}

export interface UnitSummary {
  id: string;
  title: string;
  subtitle: string;
  belt: BeltType;
  description: string;
  lessons: LessonSummary[];
  progress: number; // 0 to 1
}

export interface CourseData {
  direction: CourseDirection;
  title: string;
  subtitle: string;
  targetLanguage: string;
  nativeLanguage: string;
  units: UnitSummary[];
}

// ---------------------------------------------------------------------------
// Validate at the import boundary and cast to domain types
// ---------------------------------------------------------------------------

export const MOCK_COURSES: Record<CourseDirection, CourseData> = parseCoursesFile(
  _coursesRaw,
  'courses.json'
) as Record<CourseDirection, CourseData>;
