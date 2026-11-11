import React from 'react';
import { renderHook, act as hookAct } from '@testing-library/react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LESSONS } from '../../../src/data/mockLessons';
import { MOCK_COURSES } from '../../../src/data/mockCourseData';
import { useLesson, getFormattedExerciseData } from '../../../src/features/lesson/useLesson';
import { CourseProvider, useCourse } from '../../../src/context/CourseContext';
import { VocabularyItem, MultipleChoiceExercise, TranslationRecallExercise } from '../../../src/types/lesson';

describe('M2.3 Sparring & Mat Dialogue (Unit 3 Lesson 2) Content & Integration', () => {
  const lessonPtToEn = MOCK_LESSONS['lesson-3-2'];
  const lessonEnToPt = MOCK_LESSONS['lesson-3-2-pt'];

  const expectedVocabItems = [
    { id: 'vocab-3-2-1', pt: 'Rola / Rolar', en: 'Roll / Rolling (Sparring)' },
    { id: 'vocab-3-2-2', pt: 'Quer rolar? / Vamos rolar?', en: 'Want to roll? / Would you like to roll?' },
    { id: 'vocab-3-2-3', pt: 'Soltinho / Treino leve', en: 'Flow roll / Light roll' },
    { id: 'vocab-3-2-4', pt: 'Pegou!', en: 'Got me! / It caught!' },
    { id: 'vocab-3-2-5', pt: 'Mais um?', en: 'One more round?' },
    { id: 'vocab-3-2-6', pt: 'Volta no meio', en: 'Reset to the center / Back to center' },
    { id: 'vocab-3-2-7', pt: 'Começa de pé ou de baixo?', en: 'Start standing or on the knees/ground?' },
    { id: 'vocab-3-2-8', pt: 'Posso passar ou você puxa?', en: 'Can I pass or are you pulling?' },
    { id: 'vocab-3-2-9', pt: 'Devagar / Com calma', en: 'Slow down / Take it easy' },
    { id: 'vocab-3-2-10', pt: 'Obrigado pelo treino', en: 'Thank you for the roll / training' },
  ];

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('Lesson Content Integrity & Structure', () => {
    test('both lesson-3-2 and lesson-3-2-pt resolve to valid playable LessonData', () => {
      expect(lessonPtToEn).toBeDefined();
      expect(lessonEnToPt).toBeDefined();
      expect(lessonPtToEn.id).toBe('lesson-3-2');
      expect(lessonPtToEn.unitId).toBe('unit-3');
      expect(lessonPtToEn.title.pt).toBe('Sparring e Diálogo no Tatame');
      expect(lessonPtToEn.title.en).toBe('Sparring & Mat Dialogue');
      expect(lessonPtToEn.objective.pt.length).toBeGreaterThan(15);
      expect(lessonPtToEn.objective.en.length).toBeGreaterThan(15);
      expect(lessonEnToPt).toEqual(lessonPtToEn);
    });

    test('contains exactly 10 distinct vocabulary concepts with expected IDs and terminology', () => {
      expect(lessonPtToEn.vocabulary).toHaveLength(10);
      expectedVocabItems.forEach((expected, index) => {
        const item: VocabularyItem = lessonPtToEn.vocabulary[index];
        expect(item.id).toBe(expected.id);
        expect(item.termPt).toBe(expected.pt);
        expect(item.termEn).toBe(expected.en);
      });
    });

    test('all vocabulary items have non-empty contextual explanations, phonetics, and authentic BJJ examples in PT and EN', () => {
      lessonPtToEn.vocabulary.forEach((item) => {
        expect(item.phonetic).toBeDefined();
        expect(item.phonetic?.trim().length).toBeGreaterThan(3);
        expect(item.context).toBeDefined();
        expect(item.context?.pt.trim().length).toBeGreaterThan(20);
        expect(item.context?.en.trim().length).toBeGreaterThan(20);
        expect(item.examplePt).toBeDefined();
        expect(item.examplePt?.trim().length).toBeGreaterThan(15);
        expect(item.exampleEn).toBeDefined();
        expect(item.exampleEn?.trim().length).toBeGreaterThan(15);

        // Disallow placeholder strings
        expect(item.context?.pt).not.toMatch(/(^|\s)(todo|placeholder|lorem)($|\s)/i);
        expect(item.context?.en).not.toMatch(/(^|\s)(todo|placeholder|lorem)($|\s)/i);
        expect(item.examplePt).not.toMatch(/(^|\s)(todo|placeholder|lorem)($|\s)/i);
        expect(item.exampleEn).not.toMatch(/(^|\s)(todo|placeholder|lorem)($|\s)/i);
      });
    });

    test('contextual explanations accurately reflect nuanced academy usage for soltinho and pegou', () => {
      const soltinho = lessonPtToEn.vocabulary.find((v) => v.id === 'vocab-3-2-3');
      expect(soltinho).toBeDefined();
      expect(soltinho?.context?.pt.toLowerCase()).toContain('informal');
      expect(soltinho?.context?.en.toLowerCase()).toContain('flow roll');

      const pegou = lessonPtToEn.vocabulary.find((v) => v.id === 'vocab-3-2-4');
      expect(pegou).toBeDefined();
      expect(pegou?.context?.pt.toLowerCase()).toContain('aviso de segurança');
      expect(pegou?.context?.en.toLowerCase()).toContain('safety reset');
    });

    test('contains 4 balanced exercises: 2 multiple-choice and 2 translation-recall', () => {
      expect(lessonPtToEn.exercises).toHaveLength(4);
      const mc = lessonPtToEn.exercises.filter((ex) => ex.type === 'multiple-choice') as MultipleChoiceExercise[];
      const recall = lessonPtToEn.exercises.filter((ex) => ex.type === 'translation-recall') as TranslationRecallExercise[];

      expect(mc).toHaveLength(2);
      expect(recall).toHaveLength(2);

      // Verify Multiple Choice exercise integrity
      mc.forEach((exercise) => {
        expect(exercise.id).toMatch(/^ex-3-2-mc\d+$/);
        expect(exercise.prompt.pt.trim().length).toBeGreaterThan(10);
        expect(exercise.prompt.en.trim().length).toBeGreaterThan(10);
        expect(exercise.options.length).toBe(4);
        expect(exercise.correctIndex).toBeGreaterThanOrEqual(0);
        expect(exercise.correctIndex).toBeLessThan(exercise.options.length);
        expect(exercise.explanation?.pt.trim().length).toBeGreaterThan(10);
        expect(exercise.explanation?.en.trim().length).toBeGreaterThan(10);
      });

      // Verify Recall exercise integrity
      recall.forEach((exercise) => {
        expect(exercise.id).toMatch(/^ex-3-2-recall\d+$/);
        expect(exercise.prompt.pt.trim().length).toBeGreaterThan(5);
        expect(exercise.prompt.en.trim().length).toBeGreaterThan(5);
        expect(exercise.targetAnswer.pt.trim().length).toBeGreaterThan(5);
        expect(exercise.targetAnswer.en.trim().length).toBeGreaterThan(5);
        expect(exercise.hint?.pt.trim().length).toBeGreaterThan(5);
        expect(exercise.hint?.en.trim().length).toBeGreaterThan(5);
        expect(exercise.explanation?.pt.trim().length).toBeGreaterThan(10);
        expect(exercise.explanation?.en.trim().length).toBeGreaterThan(10);
      });
    });

    test('all vocabulary and exercise IDs are globally unique across all existing lessons and do not overwrite prior concepts', () => {
      const allVocabIds: string[] = [];
      const allExerciseIds: string[] = [];

      const uniqueLessonKeys = [
        'lesson-1-1',
        'lesson-1-2',
        'lesson-1-3',
        'lesson-2-1',
        'lesson-2-2',
        'lesson-3-1',
        'lesson-3-2',
      ];
      uniqueLessonKeys.forEach((key) => {
        const l = MOCK_LESSONS[key];
        expect(l).toBeDefined();
        l.vocabulary.forEach((v) => allVocabIds.push(v.id));
        l.exercises.forEach((e) => allExerciseIds.push(e.id));
      });

      expect(new Set(allVocabIds).size).toBe(allVocabIds.length);
      expect(new Set(allExerciseIds).size).toBe(allExerciseIds.length);

      // Verify lesson-3-2 specifically introduced 10 new unique vocab IDs and 4 exercise IDs
      const l32Vocabs = lessonPtToEn.vocabulary.map((v) => v.id);
      expect(l32Vocabs).toHaveLength(10);
      expect(new Set(l32Vocabs).size).toBe(10);

      const l32Exercises = lessonPtToEn.exercises.map((e) => e.id);
      expect(l32Exercises).toHaveLength(4);
      expect(new Set(l32Exercises).size).toBe(4);
    });
  });

  describe('Course Metadata Integration', () => {
    test('Unit 3 includes lesson-3-2 in pt-BR->en course data with matching metadata', () => {
      const course = MOCK_COURSES['pt-BR->en'];
      const unit3 = course.units.find((u) => u.id === 'unit-3-en');
      expect(unit3).toBeDefined();

      const summary = unit3?.lessons.find((l) => l.id === 'lesson-3-2');
      expect(summary).toBeDefined();
      expect(summary?.title).toBe('Sparring e Diálogo no Tatame');
      expect(summary?.description).toContain('soltinho');
      expect(summary?.conceptCount).toBe(10);
      expect(summary?.estimatedMinutes).toBe(10);
      expect(summary?.completed).toBe(false);
    });

    test('Unit 3 includes lesson-3-2-pt in en->pt-BR course data with matching metadata', () => {
      const course = MOCK_COURSES['en->pt-BR'];
      const unit3 = course.units.find((u) => u.id === 'unit-3-pt');
      expect(unit3).toBeDefined();

      const summary = unit3?.lessons.find((l) => l.id === 'lesson-3-2-pt');
      expect(summary).toBeDefined();
      expect(summary?.title).toBe('Sparring & Mat Dialogue');
      expect(summary?.description).toContain('light roll');
      expect(summary?.conceptCount).toBe(10);
      expect(summary?.estimatedMinutes).toBe(10);
      expect(summary?.completed).toBe(false);
    });
  });

  describe('Direction-Specific Formatting & Lesson Runner', () => {
    test('getFormattedExerciseData outputs correct direction text for pt-BR->en', () => {
      const mc = lessonPtToEn.exercises[0] as MultipleChoiceExercise;
      const formatted = getFormattedExerciseData(mc, 'pt-BR->en', lessonPtToEn.vocabulary);

      expect(formatted.promptText).toBe(mc.prompt.pt);
      expect(formatted.explanationText).toBe(mc.explanation?.pt);
      expect(formatted.optionsText).toEqual(mc.options.map((o) => o.en));
    });

    test('getFormattedExerciseData outputs correct direction text for en->pt-BR', () => {
      const mc = lessonPtToEn.exercises[0] as MultipleChoiceExercise;
      const formatted = getFormattedExerciseData(mc, 'en->pt-BR', lessonPtToEn.vocabulary);

      expect(formatted.promptText).toBe(mc.prompt.en);
      expect(formatted.explanationText).toBe(mc.explanation?.en);
      expect(formatted.optionsText).toEqual(mc.options.map((o) => o.pt));
    });

    test('plays lesson-3-2 through useLesson hook to 100% completion for pt-BR->en', () => {
      let completedLessonId: string | null = null;
      const { result } = renderHook(() =>
        useLesson('lesson-3-2', 'pt-BR->en', {
          onComplete: (id) => {
            completedLessonId = id;
          },
        })
      );

      expect(result.current.step).toBe('vocabulary');
      expect(result.current.lesson?.id).toBe('lesson-3-2');

      // Start exercises
      hookAct(() => {
        result.current.startExercises();
      });
      expect(result.current.step).toBe('exercise');
      expect(result.current.currentExerciseIndex).toBe(0);

      // Exercise 0: Multiple Choice
      hookAct(() => {
        result.current.selectOption(1);
      });
      expect(result.current.selectedOptionIndex).toBe(1);

      hookAct(() => {
        result.current.submitMultipleChoice();
      });
      expect(result.current.isSubmitted).toBe(true);

      hookAct(() => {
        result.current.nextStep();
      });
      expect(result.current.currentExerciseIndex).toBe(1);

      // Exercise 1: Multiple Choice
      hookAct(() => {
        result.current.selectOption(1);
      });
      hookAct(() => {
        result.current.submitMultipleChoice();
      });
      hookAct(() => {
        result.current.nextStep();
      });
      expect(result.current.currentExerciseIndex).toBe(2);

      // Exercise 2: Recall
      hookAct(() => {
        result.current.revealRecallAnswer();
      });
      expect(result.current.isAnswerRevealed).toBe(true);

      hookAct(() => {
        result.current.submitRecallRating('correct');
      });
      expect(result.current.isSubmitted).toBe(true);

      hookAct(() => {
        result.current.nextStep();
      });
      expect(result.current.currentExerciseIndex).toBe(3);

      // Exercise 3: Recall
      hookAct(() => {
        result.current.revealRecallAnswer();
      });
      expect(result.current.isAnswerRevealed).toBe(true);

      hookAct(() => {
        result.current.submitRecallRating('correct');
      });
      expect(result.current.isSubmitted).toBe(true);

      hookAct(() => {
        result.current.nextStep();
      });

      // Completion step reached
      expect(result.current.step).toBe('completion');
      expect(completedLessonId).toBe('lesson-3-2');
      expect(result.current.score.percentage).toBe(100);
      expect(result.current.score.totalCorrect).toBe(4);
      expect(result.current.score.totalExercises).toBe(4);
    });

    test('plays lesson-3-2-pt through useLesson hook to 100% completion for en->pt-BR', () => {
      let completedLessonId: string | null = null;
      const { result } = renderHook(() =>
        useLesson('lesson-3-2-pt', 'en->pt-BR', {
          onComplete: (id) => {
            completedLessonId = id;
          },
        })
      );

      expect(result.current.step).toBe('vocabulary');
      expect(result.current.lesson?.id).toBe('lesson-3-2');

      hookAct(() => {
        result.current.startExercises();
      });
      expect(result.current.step).toBe('exercise');

      // Complete all 4 exercises
      for (let i = 0; i < 4; i++) {
        const ex = result.current.currentExercise;
        if (ex && ex.type === 'multiple-choice') {
          hookAct(() => {
            result.current.selectOption(ex.correctIndex);
          });
          hookAct(() => {
            result.current.submitMultipleChoice();
          });
        } else {
          hookAct(() => {
            result.current.revealRecallAnswer();
          });
          hookAct(() => {
            result.current.submitRecallRating('correct');
          });
        }
        hookAct(() => {
          result.current.nextStep();
        });
      }

      expect(result.current.step).toBe('completion');
      expect(completedLessonId).toBe('lesson-3-2');
      expect(result.current.score.percentage).toBe(100);
    });
  });

  describe('Direction-Isolated Review Queue Integration', () => {
    const DirectionIsolatedTestComponent = () => {
      const {
        direction,
        setDirection,
        markLessonComplete,
        dueReviewCount,
        activeReviewRecords,
      } = useCourse();

      return (
        <>
          <Text testID="direction-text">{direction}</Text>
          <Text testID="due-count">{dueReviewCount}</Text>
          <Text testID="total-records-count">{activeReviewRecords.length}</Text>

          <Button
            testID="switch-to-pt-btn"
            title="Switch to PT"
            onPress={() => setDirection('en->pt-BR')}
          />
          <Button
            testID="switch-to-en-btn"
            title="Switch to EN"
            onPress={() => setDirection('pt-BR->en')}
          />
          <Button
            testID="complete-lesson-3-2-btn"
            title="Complete Lesson 3-2"
            onPress={() => markLessonComplete('lesson-3-2')}
          />
          <Button
            testID="complete-lesson-3-2-pt-btn"
            title="Complete Lesson 3-2-pt"
            onPress={() => markLessonComplete('lesson-3-2-pt')}
          />
        </>
      );
    };

    it('enqueues all 10 vocabulary items into the review queue on completing lesson-3-2 without leaking to en->pt-BR', async () => {
      const { getByTestId } = render(
        <CourseProvider
          initialDirection="pt-BR->en"
          initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
          initialReviewRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
          initialHistoryRecords={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        >
          <DirectionIsolatedTestComponent />
        </CourseProvider>
      );

      expect(getByTestId('due-count').props.children).toBe(0);
      expect(getByTestId('total-records-count').props.children).toBe(0);

      // Complete lesson-3-2 in pt-BR->en
      await act(async () => {
        fireEvent.press(getByTestId('complete-lesson-3-2-btn'));
      });

      // Expect exactly 10 review items added and due
      expect(getByTestId('due-count').props.children).toBe(10);
      expect(getByTestId('total-records-count').props.children).toBe(10);

      // Switch to en->pt-BR direction: queue should remain completely empty (direction isolation)
      await act(async () => {
        fireEvent.press(getByTestId('switch-to-pt-btn'));
      });

      expect(getByTestId('direction-text').props.children).toBe('en->pt-BR');
      expect(getByTestId('due-count').props.children).toBe(0);
      expect(getByTestId('total-records-count').props.children).toBe(0);

      // Complete lesson-3-2-pt in en->pt-BR
      await act(async () => {
        fireEvent.press(getByTestId('complete-lesson-3-2-pt-btn'));
      });

      // Now en->pt-BR should also have 10 review records
      expect(getByTestId('due-count').props.children).toBe(10);
      expect(getByTestId('total-records-count').props.children).toBe(10);
    });
  });
});
