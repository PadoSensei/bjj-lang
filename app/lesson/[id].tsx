import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { useCourse } from '../../src/context/CourseContext';
import { useLesson } from '../../src/features/lesson/useLesson';
import {
  LessonHeader,
  VocabularyView,
  MultipleChoiceView,
  TranslationRecallView,
  LessonCompletionView,
  LessonNotFoundView,
} from '../../src/features/lesson/components';
import { MultipleChoiceExercise, TranslationRecallExercise } from '../../src/types/lesson';
import { spacing } from '../../src/theme/tokens';

export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { direction, markLessonComplete } = useCourse();

  const lessonState = useLesson(id, direction, {
    onComplete: (completedLessonId) => {
      markLessonComplete(completedLessonId);
    },
  });

  const handleReturnToCourse = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (!lessonState.lesson) {
    return (
      <ScreenContainer testID="lesson-screen-not-found">
        <LessonNotFoundView lessonId={id} onReturnToCourse={handleReturnToCourse} />
      </ScreenContainer>
    );
  }

  const localizedTitle =
    direction === 'en->pt-BR'
      ? lessonState.lesson.title.en
      : lessonState.lesson.title.pt;

  const localizedObjective =
    direction === 'en->pt-BR'
      ? lessonState.lesson.objective.en
      : lessonState.lesson.objective.pt;

  return (
    <ScreenContainer testID="lesson-screen">
      <View style={styles.container}>
        <LessonHeader
          title={localizedTitle}
          progressText={lessonState.progressText}
          progressValue={lessonState.progressValue}
          onClose={handleReturnToCourse}
        />

        <View style={styles.content}>
          {lessonState.step === 'vocabulary' && (
            <VocabularyView
              objective={localizedObjective}
              vocabulary={lessonState.lesson.vocabulary}
              direction={direction}
              onStartExercises={lessonState.startExercises}
            />
          )}

          {lessonState.step === 'exercise' && lessonState.currentExercise && lessonState.formattedExercise && (
            <>
              {lessonState.currentExercise.type === 'multiple-choice' ? (
                <MultipleChoiceView
                  exercise={lessonState.currentExercise as MultipleChoiceExercise}
                  formatted={lessonState.formattedExercise}
                  selectedOptionIndex={lessonState.selectedOptionIndex}
                  isSubmitted={lessonState.isSubmitted}
                  onSelectOption={lessonState.selectOption}
                  onSubmitAnswer={lessonState.submitMultipleChoice}
                  onNext={lessonState.nextStep}
                />
              ) : (
                <TranslationRecallView
                  exercise={lessonState.currentExercise as TranslationRecallExercise}
                  formatted={lessonState.formattedExercise}
                  isAnswerRevealed={lessonState.isAnswerRevealed}
                  isSubmitted={lessonState.isSubmitted}
                  recallRating={lessonState.recallRating}
                  onRevealAnswer={lessonState.revealRecallAnswer}
                  onSubmitRating={lessonState.submitRecallRating}
                  onNext={lessonState.nextStep}
                />
              )}
            </>
          )}

          {lessonState.step === 'completion' && (
            <LessonCompletionView
              lessonTitle={localizedTitle}
              score={lessonState.score}
              onRetry={lessonState.retryLesson}
              onReturnToCourse={handleReturnToCourse}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: spacing.xs,
  },
});
