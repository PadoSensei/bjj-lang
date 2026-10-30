import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { useCourse } from '../src/context/CourseContext';
import { useReviewSession } from '../src/features/review/useReviewSession';
import { LessonHeader } from '../src/features/lesson/components/LessonHeader';
import {
  ReviewCard,
  ReviewEmptyView,
  ReviewCompletionView,
} from '../src/features/review/components';
import { spacing } from '../src/theme/tokens';

export default function ReviewScreen() {
  const router = useRouter();
  const { direction, nextReviewTimestamp } = useCourse();

  const session = useReviewSession(direction);

  const handleReturnToCourse = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const isEnToPt = direction === 'en->pt-BR';
  const headerTitle = isEnToPt
    ? 'Vocabulary Review (Portuguese)'
    : 'Vocabulary Review (English)';

  const progressText = session.totalSessionItems > 0
    ? `Item ${session.currentStepNumber} of ${session.totalSessionItems}`
    : 'Review Queue';

  const progressValue = session.totalSessionItems > 0
    ? (session.currentIndex + (session.isSubmitted ? 1 : 0.5)) / session.totalSessionItems
    : 1;

  return (
    <ScreenContainer testID="review-screen">
      <View style={styles.container}>
        <LessonHeader
          title={headerTitle}
          progressText={progressText}
          progressValue={progressValue}
          onClose={handleReturnToCourse}
        />

        <View style={styles.content}>
          {session.totalSessionItems === 0 && (
            <ReviewEmptyView
              nextReviewTimestamp={nextReviewTimestamp}
              onReturnToCourse={handleReturnToCourse}
            />
          )}

          {session.totalSessionItems > 0 && !session.isSessionComplete && session.currentVocab && (
            <ReviewCard
              formattedItem={session.currentVocab}
              isAnswerRevealed={session.isAnswerRevealed}
              isSubmitted={session.isSubmitted}
              lastOutcome={session.lastOutcome}
              onRevealAnswer={session.revealAnswer}
              onSubmitOutcome={session.submitOutcome}
              onNext={session.nextItem}
            />
          )}

          {session.totalSessionItems > 0 && session.isSessionComplete && (
            <ReviewCompletionView
              totalItemsReviewed={session.totalSessionItems}
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
