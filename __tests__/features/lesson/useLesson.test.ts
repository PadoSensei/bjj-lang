import { renderHook, act } from '@testing-library/react-native';
import { useLesson, calculateLessonScore, getFormattedExerciseData } from '../../../src/features/lesson/useLesson';
import { Exercise, ExerciseResult } from '../../../src/types/lesson';

describe('Lesson Feature Logic (useLesson)', () => {
  describe('calculateLessonScore', () => {
    const exercises: Exercise[] = [
      {
        id: 'ex-1',
        type: 'multiple-choice',
        prompt: { pt: 'P1', en: 'P1' },
        options: [{ pt: 'A', en: 'A' }, { pt: 'B', en: 'B' }],
        correctIndex: 0,
      },
      {
        id: 'ex-2',
        type: 'translation-recall',
        prompt: { pt: 'P2', en: 'P2' },
        targetAnswer: { pt: 'A2', en: 'A2' },
      },
    ];

    it('calculates 100% when all exercises are correct', () => {
      const results: ExerciseResult[] = [
        { exerciseId: 'ex-1', type: 'multiple-choice', selectedIndex: 0, isCorrect: true },
        { exerciseId: 'ex-2', type: 'translation-recall', selfRating: 'correct' },
      ];

      const score = calculateLessonScore(exercises, results);
      expect(score.totalExercises).toBe(2);
      expect(score.totalCorrect).toBe(2);
      expect(score.percentage).toBe(100);
      expect(score.gradedCorrect).toBe(1);
      expect(score.recallCorrect).toBe(1);
    });

    it('calculates 50% when one exercise is incorrect', () => {
      const results: ExerciseResult[] = [
        { exerciseId: 'ex-1', type: 'multiple-choice', selectedIndex: 1, isCorrect: false },
        { exerciseId: 'ex-2', type: 'translation-recall', selfRating: 'correct' },
      ];

      const score = calculateLessonScore(exercises, results);
      expect(score.totalCorrect).toBe(1);
      expect(score.percentage).toBe(50);
      expect(score.gradedCorrect).toBe(0);
      expect(score.recallCorrect).toBe(1);
    });
  });

  describe('getFormattedExerciseData', () => {
    const exercise: Exercise = {
      id: 'ex-1',
      type: 'multiple-choice',
      prompt: { pt: 'Prompt PT', en: 'Prompt EN' },
      options: [
        { pt: 'Opt1 PT', en: 'Opt1 EN' },
        { pt: 'Opt2 PT', en: 'Opt2 EN' },
      ],
      correctIndex: 0,
      explanation: { pt: 'Exp PT', en: 'Exp EN' },
    };

    it('formats prompts and options correctly for en->pt-BR', () => {
      const formatted = getFormattedExerciseData(exercise, 'en->pt-BR');
      expect(formatted.promptText).toBe('Prompt EN');
      expect(formatted.optionsText).toEqual(['Opt1 PT', 'Opt2 PT']);
      expect(formatted.explanationText).toBe('Exp EN');
    });

    it('formats prompts and options correctly for pt-BR->en', () => {
      const formatted = getFormattedExerciseData(exercise, 'pt-BR->en');
      expect(formatted.promptText).toBe('Prompt PT');
      expect(formatted.optionsText).toEqual(['Opt1 EN', 'Opt2 EN']);
      expect(formatted.explanationText).toBe('Exp PT');
    });
  });

  describe('useLesson Hook State Transitions', () => {
    it('returns null lesson for non-existent ID', () => {
      const { result } = renderHook(() => useLesson('non-existent-id', 'pt-BR->en'));
      expect(result.current.lesson).toBeNull();
    });

    it('loads lesson and supports full exercise interaction cycle and retry', () => {
      const { result } = renderHook(() => useLesson('lesson-1-1', 'pt-BR->en'));

      expect(result.current.lesson).not.toBeNull();
      expect(result.current.step).toBe('vocabulary');

      // Start exercises
      act(() => {
        result.current.startExercises();
      });

      expect(result.current.step).toBe('exercise');
      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.currentExercise?.type).toBe('multiple-choice');

      // Select option and submit
      act(() => {
        result.current.selectOption(0);
      });
      expect(result.current.selectedOptionIndex).toBe(0);

      act(() => {
        result.current.submitMultipleChoice();
      });
      expect(result.current.isSubmitted).toBe(true);

      // Prevent duplicate option selection once submitted
      act(() => {
        result.current.selectOption(1);
      });
      expect(result.current.selectedOptionIndex).toBe(0);

      // Move to Exercise 2 (Translation Recall)
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentExerciseIndex).toBe(1);
      expect(result.current.currentExercise?.type).toBe('translation-recall');

      // Reveal answer and self-rate
      act(() => {
        result.current.revealRecallAnswer();
      });
      expect(result.current.isAnswerRevealed).toBe(true);

      act(() => {
        result.current.submitRecallRating('correct');
      });
      expect(result.current.recallRating).toBe('correct');

      // Move to Exercise 3 (Multiple Choice)
      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentExerciseIndex).toBe(2);

      act(() => {
        result.current.selectOption(1);
        result.current.submitMultipleChoice();
      });

      // Move to completion
      act(() => {
        result.current.nextStep();
      });
      expect(result.current.step).toBe('completion');
      expect(result.current.score.totalExercises).toBe(3);

      // Retry lesson
      act(() => {
        result.current.retryLesson();
      });
      expect(result.current.step).toBe('vocabulary');
      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.score.totalCorrect).toBe(0);
    });
  });
});
