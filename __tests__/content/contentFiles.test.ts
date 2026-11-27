import { MOCK_LESSONS } from '../../src/data/mockLessons';
import { MOCK_COURSES } from '../../src/data/mockCourseData';
import { parseCoursesFile, parseLessonFile } from '../../src/data/contentSchema';

// Node built-ins, typed just enough for these checks (the project has no @types/node).
declare const __dirname: string;
const fs = jest.requireActual('fs') as {
  readdirSync(dir: string): string[];
  readFileSync(file: string, encoding: 'utf8'): string;
};
const path = jest.requireActual('path') as { join(...parts: string[]): string };

const UNITS_DIR = path.join(__dirname, '../../content/curriculum/units');

/** Every lesson file on disk: { unit folder, file name, parsed JSON }. */
const lessonFiles = () =>
  fs.readdirSync(UNITS_DIR).flatMap((unit) =>
    fs
      .readdirSync(path.join(UNITS_DIR, unit))
      .filter((file) => file.endsWith('.json'))
      .map((file) => ({
        unit,
        file,
        json: JSON.parse(fs.readFileSync(path.join(UNITS_DIR, unit, file), 'utf8')),
      }))
  );

describe('curriculum content files (content/curriculum, issue P2-8)', () => {
  it('has one file per lesson, named after the lesson, in its unit folder', () => {
    const files = lessonFiles();
    expect(files.map((f) => f.json.id).sort()).toEqual(
      Object.keys(MOCK_LESSONS).filter((id) => !id.endsWith('-pt')).sort()
    );
    for (const { unit, file, json } of files) {
      expect(file).toBe(`${json.id}.json`);
      expect(unit).toBe(json.unitId);
    }
  });

  it('loads every lesson file exactly as written', () => {
    for (const { json } of lessonFiles()) {
      expect(MOCK_LESSONS[json.id]).toEqual(json);
    }
  });

  it('keeps the -pt aliases pointing at the same lesson', () => {
    for (const { json } of lessonFiles()) {
      expect(MOCK_LESSONS[`${json.id}-pt`]).toBe(MOCK_LESSONS[json.id]);
    }
  });

  it('has a lesson file for every lesson either course publishes', () => {
    const onDisk = new Set(lessonFiles().map((f) => f.json.id));
    for (const course of Object.values(MOCK_COURSES)) {
      for (const unit of course.units) {
        for (const lesson of unit.lessons) {
          expect(onDisk.has(lesson.id.replace(/-pt$/, ''))).toBe(true);
        }
      }
    }
  });

  it('loads courses.json exactly as written', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/curriculum/courses.json'), 'utf8'));
    expect(MOCK_COURSES).toEqual(raw);
  });
});

describe('content schema errors say which file and field is wrong', () => {
  const goodLesson = () => JSON.parse(JSON.stringify(MOCK_LESSONS['lesson-1-1']));

  it('accepts a valid lesson', () => {
    expect(parseLessonFile(goodLesson(), 'unit-1/lesson-1-1.json')).toEqual(MOCK_LESSONS['lesson-1-1']);
  });

  it('names the file and the field for a missing word', () => {
    const broken = goodLesson();
    delete broken.vocabulary[1].termEn;
    expect(() => parseLessonFile(broken, 'unit-1/lesson-1-1.json')).toThrow(
      /unit-1\/lesson-1-1\.json.*vocabulary\.1\.termEn/s
    );
  });

  it('rejects a multiple-choice answer that points past the options', () => {
    const broken = goodLesson();
    const mc = broken.exercises.find((e: { type: string }) => e.type === 'multiple-choice');
    mc.correctIndex = mc.options.length;
    expect(() => parseLessonFile(broken, 'unit-1/lesson-1-1.json')).toThrow(/correctIndex/);
  });

  it('rejects an unknown exercise type', () => {
    const broken = goodLesson();
    broken.exercises[0].type = 'essay';
    expect(() => parseLessonFile(broken, 'unit-1/lesson-1-1.json')).toThrow(/unit-1\/lesson-1-1\.json.*exercises\.0/s);
  });

  it('names courses.json and the field for a bad belt', () => {
    const broken = JSON.parse(JSON.stringify(MOCK_COURSES));
    broken['pt-BR->en'].units[0].belt = 'green';
    expect(() => parseCoursesFile(broken, 'courses.json')).toThrow(/courses\.json.*units\.0\.belt/s);
  });
});
