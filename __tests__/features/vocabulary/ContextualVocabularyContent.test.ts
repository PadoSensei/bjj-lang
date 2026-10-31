import { MOCK_LESSONS } from '../../../src/data/mockLessons';
import { VocabularyItem } from '../../../src/types/lesson';

describe('M1.7 Vocabulary Content and Compatibility Audit', () => {
  const expectedVocabIds = [
    'vocab-1-1-1',
    'vocab-1-1-2',
    'vocab-1-1-3',
    'vocab-1-2-1',
    'vocab-1-2-2',
    'vocab-1-2-3',
    'vocab-2-1-1',
    'vocab-2-1-2',
  ];

  const allVocabEntries: { lessonId: string; item: VocabularyItem }[] = [];
  const lessons = ['lesson-1-1', 'lesson-1-2', 'lesson-2-1'];

  lessons.forEach((lessonId) => {
    const lesson = MOCK_LESSONS[lessonId];
    expect(lesson).toBeDefined();
    lesson.vocabulary.forEach((item) => {
      allVocabEntries.push({ lessonId, item });
    });
  });

  test('all 8 expected vocabulary IDs are present and preserved in order', () => {
    const actualVocabIds = allVocabEntries.map((e) => e.item.id);
    expect(actualVocabIds).toEqual(expectedVocabIds);
    expect(allVocabEntries).toHaveLength(8);
  });

  test('vocab-1-2-3 termPt is cleaned up to "Bater" with proper English translation', () => {
    const item = allVocabEntries.find((e) => e.item.id === 'vocab-1-2-3')?.item;
    expect(item).toBeDefined();
    expect(item?.termPt).toBe('Bater');
    expect(item?.termEn).toBe('Tap out / Signal submission');
  });

  test('all vocabulary entries have high-quality context and non-empty PT/EN examples', () => {
    allVocabEntries.forEach(({ item }) => {
      // Context checks
      expect(item.context).toBeDefined();
      expect(item.context?.pt?.trim().length).toBeGreaterThan(15);
      expect(item.context?.en?.trim().length).toBeGreaterThan(15);

      // Examples checks
      expect(item.examplePt).toBeDefined();
      expect(item.examplePt?.trim().length).toBeGreaterThan(10);
      expect(item.exampleEn).toBeDefined();
      expect(item.exampleEn?.trim().length).toBeGreaterThan(10);

      // Ensure no placeholder or empty markers
      expect(item.context?.pt).not.toMatch(/lorem|todo|tbd|placeholder/i);
      expect(item.context?.en).not.toMatch(/lorem|todo|tbd|placeholder/i);
      expect(item.examplePt).not.toMatch(/lorem|todo|tbd|placeholder/i);
      expect(item.exampleEn).not.toMatch(/lorem|todo|tbd|placeholder/i);
    });
  });

  test('lesson aliases (e.g., lesson-1-1-pt) reflect the updated vocabulary content', () => {
    expect(MOCK_LESSONS['lesson-1-1-pt'].vocabulary).toEqual(MOCK_LESSONS['lesson-1-1'].vocabulary);
    expect(MOCK_LESSONS['lesson-1-2-pt'].vocabulary).toEqual(MOCK_LESSONS['lesson-1-2'].vocabulary);
    expect(MOCK_LESSONS['lesson-2-1-pt'].vocabulary).toEqual(MOCK_LESSONS['lesson-2-1'].vocabulary);
  });
});
