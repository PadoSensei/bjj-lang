/**
 * Runtime Zod schemas for curriculum JSON content.
 *
 * These schemas validate JSON files loaded from `content/curriculum/` at the
 * import boundary. They are intentionally separate from the TypeScript
 * interfaces in `src/types/lesson.ts` (compile-time) and
 * `src/data/mockCourseData.ts` (compile-time) — Zod is the runtime layer.
 *
 * Usage: `LessonContentSchema.parse(rawJson)` throws a `ZodError` with a
 * descriptive message if the JSON is malformed, so content editors get
 * immediate feedback rather than silent runtime failures.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const LocalizedTextSchema = z.object({
  pt: z.string().min(1, 'pt text must not be empty'),
  en: z.string().min(1, 'en text must not be empty'),
});

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

export const VocabularyItemSchema = z.object({
  id: z.string().min(1),
  termPt: z.string().min(1),
  termEn: z.string().min(1),
  phonetic: z.string().optional(),
  context: LocalizedTextSchema.optional(),
  examplePt: z.string().optional(),
  exampleEn: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

export const MultipleChoiceOptionSchema = z.object({
  pt: z.string().min(1),
  en: z.string().min(1),
});

export const MultipleChoiceExerciseSchema = z
  .object({
    id: z.string().min(1),
    type: z.literal('multiple-choice'),
    prompt: LocalizedTextSchema,
    options: z.array(MultipleChoiceOptionSchema).min(2),
    correctIndex: z.number().int().min(0),
    explanation: LocalizedTextSchema.optional(),
  })
  .refine((exercise) => exercise.correctIndex < exercise.options.length, {
    message: 'correctIndex must point at one of the options',
    path: ['correctIndex'],
  });

export const TranslationRecallExerciseSchema = z.object({
  id: z.string().min(1),
  type: z.literal('translation-recall'),
  prompt: LocalizedTextSchema,
  targetAnswer: LocalizedTextSchema,
  hint: LocalizedTextSchema.optional(),
  explanation: LocalizedTextSchema.optional(),
});

// A plain union (not discriminatedUnion) so the multiple-choice refinement can apply.
export const ExerciseSchema = z.union([MultipleChoiceExerciseSchema, TranslationRecallExerciseSchema]);

// ---------------------------------------------------------------------------
// Lesson content (one JSON file per lesson)
// ---------------------------------------------------------------------------

export const LessonContentSchema = z.object({
  id: z.string().min(1),
  unitId: z.string().min(1),
  title: LocalizedTextSchema,
  objective: LocalizedTextSchema,
  vocabulary: z.array(VocabularyItemSchema).min(1),
  exercises: z.array(ExerciseSchema).min(1),
});

export type LessonContent = z.infer<typeof LessonContentSchema>;

// ---------------------------------------------------------------------------
// Course metadata (courses.json)
// ---------------------------------------------------------------------------

const LessonSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  estimatedMinutes: z.number().int().min(1),
  conceptCount: z.number().int().min(0),
  completed: z.boolean().optional(),
});

const BeltTypeSchema = z.enum(['white', 'blue', 'purple', 'brown', 'black']);

const UnitSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  belt: BeltTypeSchema,
  description: z.string(),
  // `progress` is a runtime-computed value; we accept but do not require it
  // from the JSON (CourseContext overwrites it at runtime).
  progress: z.number().min(0).max(1).optional().default(0),
  lessons: z.array(LessonSummarySchema).min(1),
});

const CourseDirectionSchema = z.enum(['pt-BR->en', 'en->pt-BR']);

const CourseDataSchema = z.object({
  direction: CourseDirectionSchema,
  title: z.string().min(1),
  subtitle: z.string(),
  targetLanguage: z.string().min(1),
  nativeLanguage: z.string().min(1),
  units: z.array(UnitSummarySchema).min(1),
});

export const CoursesSchema = z.record(CourseDirectionSchema, CourseDataSchema);

export type CoursesContent = z.infer<typeof CoursesSchema>;

// ---------------------------------------------------------------------------
// Parsing with readable errors
// ---------------------------------------------------------------------------

/** Turn a Zod error into "file: field.path: message" lines an editor can act on. */
function describeIssues(fileName: string, error: z.ZodError): string {
  const lines = error.issues.map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  return `Invalid curriculum file ${fileName}:\n${lines.join('\n')}`;
}

/** Validate one lesson file. Throws an error naming the file and each bad field. */
export function parseLessonFile(raw: unknown, fileName: string): LessonContent {
  const result = LessonContentSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(describeIssues(fileName, result.error));
  }
  return result.data;
}

/** Validate courses.json. Throws an error naming the file and each bad field. */
export function parseCoursesFile(raw: unknown, fileName: string): CoursesContent {
  const result = CoursesSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(describeIssues(fileName, result.error));
  }
  return result.data;
}
