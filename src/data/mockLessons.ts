/**
 * Thin loader: lesson content lives in JSON files under
 * `content/curriculum/units/` (one file per lesson). Edit those files, not
 * this one. Each file is validated on load (`src/data/contentSchema.ts`); a
 * mistake fails with the file name and the field that is wrong.
 */
import { LessonData } from '../types/lesson';
import { parseLessonFile } from './contentSchema';

import lesson11 from '../../content/curriculum/units/unit-1/lesson-1-1.json';
import lesson12 from '../../content/curriculum/units/unit-1/lesson-1-2.json';
import lesson13 from '../../content/curriculum/units/unit-1/lesson-1-3.json';
import lesson21 from '../../content/curriculum/units/unit-2/lesson-2-1.json';
import lesson22 from '../../content/curriculum/units/unit-2/lesson-2-2.json';
import lesson31 from '../../content/curriculum/units/unit-3/lesson-3-1.json';
import lesson32 from '../../content/curriculum/units/unit-3/lesson-3-2.json';

const LESSON_FILES: [unknown, string][] = [
  [lesson11, 'units/unit-1/lesson-1-1.json'],
  [lesson12, 'units/unit-1/lesson-1-2.json'],
  [lesson13, 'units/unit-1/lesson-1-3.json'],
  [lesson21, 'units/unit-2/lesson-2-1.json'],
  [lesson22, 'units/unit-2/lesson-2-2.json'],
  [lesson31, 'units/unit-3/lesson-3-1.json'],
  [lesson32, 'units/unit-3/lesson-3-2.json'],
];

export const MOCK_LESSONS: Record<string, LessonData> = {};

for (const [raw, fileName] of LESSON_FILES) {
  const lesson = parseLessonFile(raw, fileName) as LessonData;
  MOCK_LESSONS[lesson.id] = lesson;
}

// The en->pt-BR course publishes '-pt' lesson IDs; they share the canonical lesson.
for (const lesson of Object.values({ ...MOCK_LESSONS })) {
  MOCK_LESSONS[`${lesson.id}-pt`] = lesson;
}
