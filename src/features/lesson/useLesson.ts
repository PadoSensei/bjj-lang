import { useState, useMemo, useEffect, useRef } from 'react';
import { CourseDirection } from '../../components/ui/CourseDirectionSelector';
import { MOCK_LESSONS } from '../../data/mockLessons';
import {
  Exercise,
  ExerciseResult,
  LessonData,
  LessonScore,
  MultipleChoiceExercise,
  SelfRating,
  TranslationRecallExercise,
} from '../../types/lesson';

export type LessonStep = 'vocabulary' | 'exercise' | 'completion';

export interface FormattedExerciseData {
  promptText: string;
  explanationText?: string;
  optionsText?: string[];
  targetAnswerText?: string;
}

export function getFormattedExerciseData(
  exercise: Exercise,
  direction: CourseDirection
): FormattedExerciseData {
  const isEnToPt = direction === 'en->pt-BR';

  if (exercise.type === 'multiple-choice') {
    const mc = exercise as MultipleChoiceExercise;
    return {
      promptText: isEnToPt ? mc.prompt.en : mc.prompt.pt,
      explanationText: isEnToPt ? mc.explanation?.en : mc.explanation?.pt,
      optionsText: mc.options.map((opt) => (isEnToPt ? opt.pt : opt.en)),
    };
  } else {
    const recall = exercise as TranslationRecallExercise;
    return {
      promptText: isEnToPt ? recall.prompt.en : recall.prompt.pt,
      explanationText: isEnToPt ? recall.explanation?.en : recall.explanation?.pt,
      targetAnswerText: isEnToPt ? recall.targetAnswer.pt : recall.targetAnswer.en,
    };
  }
}

export function calculateLessonScore(
  exercises: Exercise[],
  results: ExerciseResult[]
): LessonScore {
  let gradedTotal = 0;
  let gradedCorrect = 0;
  let recallTotal = 0;
  let recallCorrect = 0;

  const resultMap = new Map<string, ExerciseResult>();
  results.forEach((res) => resultMap.set(res.exerciseId, res));

  exercises.forEach((ex) => {
    const res = resultMap.get(ex.id);
    if (ex.type === 'multiple-choice') {
      gradedTotal++;
      if (res && res.type === 'multiple-choice' && res.isCorrect) {
        gradedCorrect++;
      }
    } else {
      recallTotal++;
      if (res && res.type === 'translation-recall' && res.selfRating === 'correct') {
        recallCorrect++;
      }
    }
  });

  const totalExercises = exercises.length;
  const totalCorrect = gradedCorrect + recallCorrect;
  const percentage =
    totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 100;

  return {
    gradedTotal,
    gradedCorrect,
    recallTotal,
    recallCorrect,
    totalExercises,
    totalCorrect,
    percentage,
  };
}

export interface UseLessonOptions {
  onComplete?: (lessonId: string) => void;
}

export function useLesson(
  lessonId: string | undefined,
  direction: CourseDirection,
  options?: UseLessonOptions
) {
  const lesson: LessonData | null = useMemo(() => {
    if (!lessonId) return null;
    return MOCK_LESSONS[lessonId] || null;
  }, [lessonId]);

  const [step, setStep] = useState<LessonStep>('vocabulary');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [recallRating, setRecallRating] = useState<SelfRating | null>(null);
  const [results, setResults] = useState<ExerciseResult[]>([]);

  const onCompleteRef = useRef(options?.onComplete);
  useEffect(() => {
    onCompleteRef.current = options?.onComplete;
  }, [options?.onComplete]);

  // Reset all state if lessonId changes
  useEffect(() => {
    setStep('vocabulary');
    setCurrentExerciseIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setIsAnswerRevealed(false);
    setRecallRating(null);
    setResults([]);
  }, [lessonId]);

  // Trigger onComplete callback when transitioning to completion step
  useEffect(() => {
    if (step === 'completion' && lesson?.id) {
      onCompleteRef.current?.(lesson.id);
    }
  }, [step, lesson?.id]);

  const currentExercise = useMemo(() => {
    if (!lesson || !lesson.exercises || lesson.exercises.length === 0) return null;
    return lesson.exercises[currentExerciseIndex] || null;
  }, [lesson, currentExerciseIndex]);

  const formattedExercise = useMemo(() => {
    if (!currentExercise) return null;
    return getFormattedExerciseData(currentExercise, direction);
  }, [currentExercise, direction]);

  const selectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const submitMultipleChoice = () => {
    if (
      !currentExercise ||
      currentExercise.type !== 'multiple-choice' ||
      selectedOptionIndex === null ||
      isSubmitted
    ) {
      return;
    }

    const isCorrect = selectedOptionIndex === currentExercise.correctIndex;
    setIsSubmitted(true);

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      type: 'multiple-choice',
      selectedIndex: selectedOptionIndex,
      isCorrect,
    };

    setResults((prev) => [...prev.filter((r) => r.exerciseId !== currentExercise.id), result]);
  };

  const revealRecallAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const submitRecallRating = (rating: SelfRating) => {
    if (
      !currentExercise ||
      currentExercise.type !== 'translation-recall' ||
      !isAnswerRevealed ||
      isSubmitted
    ) {
      return;
    }

    setRecallRating(rating);
    setIsSubmitted(true);

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      type: 'translation-recall',
      selfRating: rating,
    };

    setResults((prev) => [...prev.filter((r) => r.exerciseId !== currentExercise.id), result]);
  };

  const startExercises = () => {
    if (!lesson || lesson.exercises.length === 0) {
      setStep('completion');
      return;
    }
    setStep('exercise');
    setCurrentExerciseIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setIsAnswerRevealed(false);
    setRecallRating(null);
  };

  const nextStep = () => {
    if (step === 'vocabulary') {
      startExercises();
      return;
    }

    if (step === 'exercise') {
      if (lesson && currentExerciseIndex < lesson.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setSelectedOptionIndex(null);
        setIsSubmitted(false);
        setIsAnswerRevealed(false);
        setRecallRating(null);
      } else {
        setStep('completion');
      }
    }
  };

  const retryLesson = () => {
    setStep('vocabulary');
    setCurrentExerciseIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setIsAnswerRevealed(false);
    setRecallRating(null);
    setResults([]);
  };

  const score = useMemo(() => {
    if (!lesson) {
      return {
        gradedTotal: 0,
        gradedCorrect: 0,
        recallTotal: 0,
        recallCorrect: 0,
        totalExercises: 0,
        totalCorrect: 0,
        percentage: 0,
      };
    }
    return calculateLessonScore(lesson.exercises, results);
  }, [lesson, results]);

  const totalExercises = lesson ? lesson.exercises.length : 0;
  const progressText =
    step === 'exercise' && totalExercises > 0
      ? `Exercise ${currentExerciseIndex + 1} of ${totalExercises}`
      : step === 'vocabulary'
      ? 'Vocabulary Review'
      : 'Lesson Complete';

  const progressValue = useMemo(() => {
    if (step === 'vocabulary') return 0;
    if (step === 'completion') return 1;
    if (totalExercises === 0) return 1;
    return (currentExerciseIndex + (isSubmitted ? 1 : 0.5)) / totalExercises;
  }, [step, currentExerciseIndex, totalExercises, isSubmitted]);

  return {
    lesson,
    step,
    currentExercise,
    formattedExercise,
    currentExerciseIndex,
    totalExercises,
    selectedOptionIndex,
    isSubmitted,
    isAnswerRevealed,
    recallRating,
    score,
    progressText,
    progressValue,
    selectOption,
    submitMultipleChoice,
    revealRecallAnswer,
    submitRecallRating,
    startExercises,
    nextStep,
    retryLesson,
  };
}
