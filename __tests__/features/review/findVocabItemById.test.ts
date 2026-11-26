import { findVocabItemById } from '../../../src/features/review/useReviewSession';
import { MOCK_LESSONS } from '../../../src/data/mockLessons';

describe('findVocabItemById (backed by the content registry)', () => {
  it('returns the original vocabulary item and its lesson', () => {
    const original = MOCK_LESSONS['lesson-1-3'].vocabulary[2];
    const lookup = findVocabItemById(original.id);
    expect(lookup).toEqual({ vocab: original, lessonId: 'lesson-1-3' });
  });

  it('returns only vocabulary fields, not registry metadata', () => {
    const lookup = findVocabItemById('vocab-1-1-1');
    expect(lookup?.vocab).not.toHaveProperty('belt');
    expect(lookup?.vocab).not.toHaveProperty('review');
  });

  it('returns null for an unknown ID', () => {
    expect(findVocabItemById('vocab-9-9-9')).toBeNull();
  });
});
