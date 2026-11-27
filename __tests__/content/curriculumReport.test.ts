import { MOCK_LESSONS } from '../../src/data/mockLessons';
import { getContentSet, validateRegistry } from '../../src/content/registry';
import {
  buildCurriculumReport,
  filterCurriculumItems,
  lessonTitlesFromLegacy,
} from '../../src/content/curriculumReport';
import type { ContentIssue } from '../../src/domain/content/validate';

const report = () => buildCurriculumReport(getContentSet(), validateRegistry(), lessonTitlesFromLegacy(MOCK_LESSONS));

describe('buildCurriculumReport (curriculum review page)', () => {
  it('counts everything in the registry', () => {
    expect(report().totals).toEqual({
      words: 46,
      lessons: 7,
      exercises: 22,
      stories: 0,
      scenarios: 0,
      reviewed: 0,
      draft: 46,
      issues: 0,
    });
  });

  it('groups words and lessons by belt, White first, skipping empty belts', () => {
    const belts = report().belts;
    expect(belts.map((b) => b.belt)).toEqual(['white', 'blue', 'purple']);
    expect(belts.map((b) => b.words.length)).toEqual([15, 11, 20]);
    expect(belts.map((b) => b.lessons.map((l) => l.id))).toEqual([
      ['lesson-1-1', 'lesson-1-2', 'lesson-1-3'],
      ['lesson-2-1', 'lesson-2-2'],
      ['lesson-3-1', 'lesson-3-2'],
    ]);
  });

  it('puts English and Portuguese side by side with the Portuguese explanation', () => {
    const oss = report().belts[0].words.find((w) => w.id === 'vocab-1-1-1')!;
    expect(oss).toMatchObject({
      en: 'OSS (Respect greeting)',
      pt: 'OSS',
      cefr: 'A1',
      reviewable: true,
      status: 'draft',
      lessonIds: ['lesson-1-1'],
    });
    expect(oss.explanationPt).toBe(MOCK_LESSONS['lesson-1-1'].vocabulary[0].context!.pt);
  });

  it('prefers an item\'s own support.pt as its explanation', () => {
    const content = getContentSet();
    content.lexicalItems = content.lexicalItems.map((item) =>
      item.id === 'vocab-1-1-1'
        ? { ...item, support: { pt: 'Cumprimento de respeito.' }, review: { status: 'reviewed' as const, reviewer: 'Ana' } }
        : item
    );
    const oss = buildCurriculumReport(content, [], {}).belts[0].words.find((w) => w.id === 'vocab-1-1-1')!;
    expect(oss).toMatchObject({ explanationPt: 'Cumprimento de respeito.', status: 'reviewed', reviewer: 'Ana' });
  });

  it('gives lessons their titles, words and exercises', () => {
    const lesson = report().belts[0].lessons[0];
    expect(lesson).toEqual({
      id: 'lesson-1-1',
      title: MOCK_LESSONS['lesson-1-1'].title,
      itemIds: MOCK_LESSONS['lesson-1-1'].vocabulary.map((v) => v.id),
      exerciseIds: MOCK_LESSONS['lesson-1-1'].exercises.map((e) => e.id),
    });
  });

  it('describes exercises with their prompt and answer in both languages', () => {
    const exercises = report().exercises;
    expect(exercises).toHaveLength(22);
    const mc = MOCK_LESSONS['lesson-1-1'].exercises.find((e) => e.type === 'multiple-choice')!;
    const row = exercises.find((e) => e.id === mc.id)!;
    expect(row.type).toBe('multiple-choice');
    expect(row.prompt).toEqual(mc.prompt);
    expect(mc.type === 'multiple-choice' && row.answer).toEqual(mc.type === 'multiple-choice' && mc.options[mc.correctIndex]);
  });

  it('passes validation issues through', () => {
    const issue: ContentIssue = { code: 'dangling-reference', contentId: 'story-x', message: 'Story references unknown item vocab-nope.' };
    const r = buildCurriculumReport(getContentSet(), [issue], {});
    expect(r.issues).toEqual([issue]);
    expect(r.totals.issues).toBe(1);
  });
});

describe('filterCurriculumItems', () => {
  const words = () => report().belts.flatMap((b) => b.words);

  it('with no filters returns every word', () => {
    expect(filterCurriculumItems(words(), {})).toHaveLength(46);
  });

  it('filters by belt', () => {
    const blue = filterCurriculumItems(words(), { belt: 'blue' });
    expect(blue).toHaveLength(11);
    expect(blue.every((w) => w.belt === 'blue')).toBe(true);
  });

  it('filters by review status', () => {
    expect(filterCurriculumItems(words(), { status: 'reviewed' })).toHaveLength(0);
    expect(filterCurriculumItems(words(), { status: 'draft' })).toHaveLength(46);
  });

  it('searches ID, English and Portuguese, ignoring case and accents', () => {
    expect(filterCurriculumItems(words(), { query: 'vocab-1-3-6' }).map((w) => w.en)).toEqual(['Yes']);
    expect(filterCurriculumItems(words(), { query: 'yes' }).map((w) => w.id)).toContain('vocab-1-3-6');
    expect(filterCurriculumItems(words(), { query: 'SIM' }).map((w) => w.id)).toContain('vocab-1-3-6');
    const withAccent = words().find((w) => /[áéíóúãõç]/i.test(w.pt))!;
    const stripped = withAccent.pt.normalize('NFD').replace(/[̀-ͯ]/g, '');
    expect(filterCurriculumItems(words(), { query: stripped }).map((w) => w.id)).toContain(withAccent.id);
  });

  it('combines filters', () => {
    expect(filterCurriculumItems(words(), { belt: 'white', query: 'yes' }).map((w) => w.id)).toEqual(['vocab-1-3-6']);
    expect(filterCurriculumItems(words(), { belt: 'blue', query: 'yes' })).toEqual([]);
  });
});
