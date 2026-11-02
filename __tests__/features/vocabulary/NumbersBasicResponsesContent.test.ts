import { MOCK_LESSONS } from '../../../src/data/mockLessons';
import { MOCK_COURSES } from '../../../src/data/mockCourseData';
import { VocabularyItem } from '../../../src/types/lesson';

describe('M1.8 Numbers & Basic Responses Lesson Content and Integrity', () => {
  const expectedVocabItems = [
    { id: 'vocab-1-3-1', pt: 'Um', en: 'One' },
    { id: 'vocab-1-3-2', pt: 'Dois', en: 'Two' },
    { id: 'vocab-1-3-3', pt: 'Três', en: 'Three' },
    { id: 'vocab-1-3-4', pt: 'Quatro', en: 'Four' },
    { id: 'vocab-1-3-5', pt: 'Cinco', en: 'Five' },
    { id: 'vocab-1-3-6', pt: 'Sim', en: 'Yes' },
    { id: 'vocab-1-3-7', pt: 'Não', en: 'No' },
    { id: 'vocab-1-3-8', pt: 'Pronto', en: 'Ready' },
    { id: 'vocab-1-3-9', pt: 'Entendi', en: 'I understand / Got it' },
  ];

  const lesson = MOCK_LESSONS['lesson-1-3'];
  const lessonPt = MOCK_LESSONS['lesson-1-3-pt'];

  test('lesson-1-3 exists and is linked properly with unit-1', () => {
    expect(lesson).toBeDefined();
    expect(lesson.id).toBe('lesson-1-3');
    expect(lesson.unitId).toBe('unit-1');
    expect(lesson.title.pt).toBe('Números e Respostas Básicas');
    expect(lesson.title.en).toBe('Numbers & Basic Responses');
    expect(lesson.objective.pt.length).toBeGreaterThan(10);
    expect(lesson.objective.en.length).toBeGreaterThan(10);
  });

  test('en->pt-BR alias lesson-1-3-pt is consistent with lesson-1-3', () => {
    expect(lessonPt).toBeDefined();
    expect(lessonPt).toEqual(lesson);
  });

  test('contains all 9 expected vocabulary items in sequence with correct terms and IDs', () => {
    expect(lesson.vocabulary).toHaveLength(9);
    expectedVocabItems.forEach((expected, index) => {
      const vocab: VocabularyItem = lesson.vocabulary[index];
      expect(vocab.id).toBe(expected.id);
      expect(vocab.termPt).toBe(expected.pt);
      expect(vocab.termEn).toBe(expected.en);
    });
  });

  test('all 9 vocabulary items have natural contextual explanations and realistic BJJ examples', () => {
    lesson.vocabulary.forEach((item) => {
      expect(item.context).toBeDefined();
      expect(item.context?.pt.trim().length).toBeGreaterThan(15);
      expect(item.context?.en.trim().length).toBeGreaterThan(15);

      expect(item.examplePt).toBeDefined();
      expect(item.examplePt?.trim().length).toBeGreaterThan(10);
      expect(item.exampleEn).toBeDefined();
      expect(item.exampleEn?.trim().length).toBeGreaterThan(10);

      // Verify no placeholder words
      expect(item.context?.pt).not.toMatch(/\b(todo|placeholder|lorem)\b/i);
      expect(item.context?.en).not.toMatch(/\b(todo|placeholder|lorem)\b/i);
      expect(item.examplePt).not.toMatch(/\b(todo|placeholder|lorem)\b/i);
      expect(item.exampleEn).not.toMatch(/\b(todo|placeholder|lorem)\b/i);
    });
  });

  test('contains 4 balanced exercises: 2 multiple-choice and 2 translation-recall', () => {
    expect(lesson.exercises).toHaveLength(4);
    const mcExercises = lesson.exercises.filter((ex) => ex.type === 'multiple-choice');
    const recallExercises = lesson.exercises.filter((ex) => ex.type === 'translation-recall');

    expect(mcExercises).toHaveLength(2);
    expect(recallExercises).toHaveLength(2);

    mcExercises.forEach((mc) => {
      expect(mc.prompt.pt).toBeDefined();
      expect(mc.prompt.en).toBeDefined();
      expect(mc.options.length).toBe(4);
      expect(mc.correctIndex).toBeGreaterThanOrEqual(0);
      expect(mc.correctIndex).toBeLessThan(4);
      expect(mc.explanation?.pt).toBeDefined();
      expect(mc.explanation?.en).toBeDefined();
    });

    recallExercises.forEach((recall) => {
      expect(recall.prompt.pt).toBeDefined();
      expect(recall.prompt.en).toBeDefined();
      expect(recall.targetAnswer.pt).toBeDefined();
      expect(recall.targetAnswer.en).toBeDefined();
      expect(recall.explanation?.pt).toBeDefined();
      expect(recall.explanation?.en).toBeDefined();
    });
  });

  test('MOCK_COURSES includes lesson-1-3 with completed: false and conceptCount: 9 in both directions', () => {
    const ptCourseUnit1 = MOCK_COURSES['pt-BR->en'].units.find((u) => u.id === 'unit-1-en');
    expect(ptCourseUnit1).toBeDefined();
    const lesson13Pt = ptCourseUnit1?.lessons.find((l) => l.id === 'lesson-1-3');
    expect(lesson13Pt).toBeDefined();
    expect(lesson13Pt?.title).toBe('Números e Respostas Básicas');
    expect(lesson13Pt?.completed).toBe(false);
    expect(lesson13Pt?.conceptCount).toBe(9);

    const enCourseUnit1 = MOCK_COURSES['en->pt-BR'].units.find((u) => u.id === 'unit-1-pt');
    expect(enCourseUnit1).toBeDefined();
    const lesson13En = enCourseUnit1?.lessons.find((l) => l.id === 'lesson-1-3-pt');
    expect(lesson13En).toBeDefined();
    expect(lesson13En?.title).toBe('Numbers & Basic Responses');
    expect(lesson13En?.completed).toBe(false);
    expect(lesson13En?.conceptCount).toBe(9);
  });

  test('vocabulary items are uniquely identified and compatible with review record schemas', () => {
    const vocabIds = lesson.vocabulary.map((v) => v.id);
    const uniqueIds = new Set(vocabIds);
    expect(uniqueIds.size).toBe(9);
    // Ensure all 9 start with 'vocab-1-3-'
    vocabIds.forEach((id) => {
      expect(id).toMatch(/^vocab-1-3-\d+$/);
    });
  });
});
