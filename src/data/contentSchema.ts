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
    itemIds: z.array(z.string().min(1)).optional(),
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
  itemIds: z.array(z.string().min(1)).optional(),
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
// Content packs (content/curriculum/<belt>/<theme>/), ADR-008
// ---------------------------------------------------------------------------

const BeltSchema = z.enum(['white', 'blue', 'purple', 'brown', 'black']);
const CefrSchema = z.enum(['pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1']);
const ReviewSchema = z.object({
  status: z.enum(['draft', 'reviewed']),
  reviewer: z.string().min(1).optional(),
});
const SupportSchema = z.object({ pt: z.string().min(1).optional(), en: z.string().min(1).optional() });

/** A new word: the vocabulary fields plus registry metadata. */
export const LexicalItemFileSchema = VocabularyItemSchema.extend({
  belt: BeltSchema,
  cefr: CefrSchema,
  reviewable: z.boolean(),
  support: SupportSchema.optional(),
  review: ReviewSchema,
});

/** Extra metadata for an existing word, which keeps its text and ID. */
export const AnnotationSchema = z.object({
  id: z.string().min(1),
  cefr: CefrSchema.optional(),
  reviewable: z.boolean().optional(),
  support: SupportSchema.optional(),
  review: ReviewSchema.optional(),
});

export const LexiconFileSchema = z.object({
  items: z.array(LexicalItemFileSchema),
  annotations: z.array(AnnotationSchema),
});

export const ExercisesFileSchema = z.array(ExerciseSchema);

export const StoryFileSchema = z.object({
  id: z.string().regex(/^story-/, 'story IDs start with "story-"'),
  belt: BeltSchema,
  title: LocalizedTextSchema,
  pages: z
    .array(
      z.object({
        id: z.string().min(1),
        pt: z.string().min(1),
        tokens: z.array(z.object({ text: z.string().min(1), itemId: z.string().min(1).optional() })).min(1),
      })
    )
    .min(1),
  comprehensionExerciseIds: z.array(z.string().min(1)),
  review: ReviewSchema,
});

const ScenarioChoiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  itemIds: z.array(z.string().min(1)),
  feedback: LocalizedTextSchema,
  nextNodeId: z.string().min(1),
});

export const ScenarioFileSchema = z.object({
  id: z.string().regex(/^scn-/, 'scenario IDs start with "scn-"'),
  belt: BeltSchema,
  title: LocalizedTextSchema,
  startNodeId: z.string().min(1),
  nodes: z.record(
    z.string(),
    z.object({
      narrative: LocalizedTextSchema,
      ending: z.enum(['good', 'retry']).optional(),
      choices: z.array(ScenarioChoiceSchema),
    })
  ),
  review: ReviewSchema,
});

/** Validate any content file against a schema. Throws an error naming the file and each bad field. */
export function parseContentFile<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, raw: unknown, fileName: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(describeIssues(fileName, result.error));
  }
  return result.data;
}

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
