import frozen from '../fixtures/frozenContentIds.json';
import { MOCK_LESSONS } from '../../src/data/mockLessons';
import {
  getLexicalItem,
  getExercise,
  getLesson,
  getStory,
  getScenario,
  listLexicalItems,
  listByBelt,
  listStories,
  listScenarios,
  listAllContentIds,
} from '../../src/content/registry';
import { BELT_DEFAULT_CEFR, Belt } from '../../src/domain/content/types';
import { BeltType } from '../../src/theme/tokens';

const canonicalLessonIds = Object.keys(MOCK_LESSONS).filter((id) => !id.endsWith('-pt'));

describe('content registry (issue #37, ADR-008)', () => {
  describe('frozen IDs', () => {
    it('still contains every lesson, vocabulary and exercise ID that stored data may reference', () => {
      for (const id of frozen.lessons) expect(getLesson(id)).toBeDefined();
      for (const id of frozen.vocabulary) expect(getLexicalItem(id)).toBeDefined();
      for (const id of frozen.exercises) expect(getExercise(id)).toBeDefined();
    });

    it('MOCK_LESSONS still contains every frozen ID (legacy lesson screens)', () => {
      const vocab = new Set(canonicalLessonIds.flatMap((l) => MOCK_LESSONS[l].vocabulary.map((v) => v.id)));
      const exercises = new Set(canonicalLessonIds.flatMap((l) => MOCK_LESSONS[l].exercises.map((e) => e.id)));
      expect(canonicalLessonIds).toEqual(expect.arrayContaining(frozen.lessons));
      for (const id of frozen.vocabulary) expect(vocab.has(id)).toBe(true);
      for (const id of frozen.exercises) expect(exercises.has(id)).toBe(true);
    });
  });

  describe('lexical items seeded from the existing lessons', () => {
    it('keeps every original vocabulary field unchanged', () => {
      for (const lessonId of canonicalLessonIds) {
        for (const vocab of MOCK_LESSONS[lessonId].vocabulary) {
          expect(getLexicalItem(vocab.id)).toMatchObject(vocab);
        }
      }
    });

    it('records the first lesson that introduces each item', () => {
      expect(getLexicalItem('vocab-1-1-1')?.sourceLessonId).toBe('lesson-1-1');
      expect(getLexicalItem('vocab-3-2-1')?.sourceLessonId).toBe('lesson-3-2');
    });

    it('takes each item\'s belt from its unit and a default CEFR level from the belt', () => {
      expect(getLexicalItem('vocab-1-1-1')).toMatchObject({ belt: 'white', cefr: 'A1' });
      expect(getLexicalItem('vocab-2-1-1')).toMatchObject({ belt: 'blue', cefr: 'A2' });
      expect(getLexicalItem('vocab-3-1-1')).toMatchObject({ belt: 'purple', cefr: 'B1' });
      for (const item of listLexicalItems()) {
        expect(item.cefr).toBe(BELT_DEFAULT_CEFR[item.belt]);
      }
    });

    it('marks seeded items reviewable and as unreviewed drafts', () => {
      for (const item of listLexicalItems()) {
        expect(item.reviewable).toBe(true);
        expect(item.review.status).toBe('draft');
      }
    });

    it('lists items by belt', () => {
      expect(listByBelt('white')).toHaveLength(15);
      expect(listByBelt('blue')).toHaveLength(11);
      expect(listByBelt('purple')).toHaveLength(20);
      expect(listByBelt('brown')).toHaveLength(0);
      expect(listLexicalItems()).toHaveLength(46);
    });

    it('uses belt names the theme understands', () => {
      const belt: Belt = getLexicalItem('vocab-1-1-1')!.belt;
      const asTheme: BeltType = belt; // compile-time check: every domain belt is a theme belt
      expect(asTheme).toBe('white');
    });
  });

  describe('lessons and exercises', () => {
    it('describes each lesson by belt and the IDs it references', () => {
      for (const lessonId of canonicalLessonIds) {
        const legacy = MOCK_LESSONS[lessonId];
        expect(getLesson(lessonId)).toEqual({
          id: lessonId,
          belt: getLexicalItem(legacy.vocabulary[0].id)!.belt,
          itemIds: legacy.vocabulary.map((v) => v.id),
          exerciseIds: legacy.exercises.map((e) => e.id),
        });
      }
    });

    it('returns each exercise unchanged', () => {
      for (const lessonId of canonicalLessonIds) {
        for (const exercise of MOCK_LESSONS[lessonId].exercises) {
          expect(getExercise(exercise.id)).toEqual(exercise);
        }
      }
    });

    it('only registers canonical lessons, not the -pt aliases', () => {
      expect(getLesson('lesson-1-1-pt')).toBeUndefined();
    });
  });

  describe('lookups', () => {
    it('returns undefined for unknown IDs', () => {
      expect(getLexicalItem('vocab-9-9-9')).toBeUndefined();
      expect(getExercise('ex-9-9-1')).toBeUndefined();
      expect(getLesson('lesson-9-9')).toBeUndefined();
      expect(getStory('story-white-nope')).toBeUndefined();
      expect(getScenario('scn-white-nope')).toBeUndefined();
    });

    it('has no stories or scenarios yet (they arrive with the White Belt pack)', () => {
      expect(listStories()).toEqual([]);
      expect(listScenarios()).toEqual([]);
    });

    it('never uses the same ID for two kinds of content', () => {
      const ids = listAllContentIds();
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBe(46 + 22 + 7);
    });
  });
});
