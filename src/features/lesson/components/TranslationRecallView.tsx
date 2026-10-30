import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormattedExerciseData } from '../useLesson';
import { SelfRating, TranslationRecallExercise } from '../../../types/lesson';
import { colors, spacing, typography } from '../../../theme/tokens';
import { ContextualVocabularyView } from '../../vocabulary/components/ContextualVocabularyView';

export interface TranslationRecallViewProps {
  exercise: TranslationRecallExercise;
  formatted: FormattedExerciseData;
  isAnswerRevealed: boolean;
  isSubmitted: boolean;
  recallRating: SelfRating | null;
  onRevealAnswer: () => void;
  onSubmitRating: (rating: SelfRating) => void;
  onNext: () => void;
}

export const TranslationRecallView: React.FC<TranslationRecallViewProps> = ({
  formatted,
  isAnswerRevealed,
  isSubmitted,
  recallRating,
  onRevealAnswer,
  onSubmitRating,
  onNext,
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      testID="translation-recall-view"
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.promptCard} testID="recall-prompt-card">
        <Text style={styles.badgeText}>Translation Recall</Text>
        <Text style={styles.promptText} testID="recall-prompt-text">
          {formatted.promptText}
        </Text>
        <Text style={styles.subtext}>Try to recall the target translation in your head or aloud.</Text>
      </Card>

      {!isAnswerRevealed ? (
        <Button
          title="Show Answer"
          variant="secondary"
          onPress={onRevealAnswer}
          testID="show-answer-btn"
        />
      ) : (
        <Card style={styles.revealedCard} testID="revealed-answer-card">
          <Text style={styles.revealedLabel}>Target Translation:</Text>
          <Text style={styles.targetAnswerText} testID="target-answer-text">
            {formatted.targetAnswerText}
          </Text>

          {formatted.explanationText ? (
            <Text style={styles.explanationText}>{formatted.explanationText}</Text>
          ) : null}

          {formatted.matchedVocab ? (
            <ContextualVocabularyView
              vocab={formatted.matchedVocab}
              showTermHeader={false}
              testID="recall-contextual-vocab"
            />
          ) : null}

          {!isSubmitted ? (
            <View style={styles.ratingSection}>
              <Text style={styles.ratingPrompt}>How well did you recall this?</Text>
              <View style={styles.ratingButtonsRow}>
                <Button
                  title="Needs Practice"
                  variant="outline"
                  onPress={() => onSubmitRating('needs-practice')}
                  testID="rate-needs-practice-btn"
                />
                <Button
                  title="I Got It Right"
                  variant="primary"
                  onPress={() => onSubmitRating('correct')}
                  testID="rate-correct-btn"
                />
              </View>
            </View>
          ) : (
            <View style={styles.feedbackSection}>
              <Text style={styles.recordedRatingText} testID="recorded-rating-text">
                Recorded: {recallRating === 'correct' ? '✓ Correct' : '⚡ Needs Practice'}
              </Text>
              <Button
                title="Continue"
                variant="primary"
                onPress={onNext}
                testID="recall-continue-btn"
              />
            </View>
          )}
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  promptCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    alignItems: 'center',
    textAlign: 'center',
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  promptText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  subtext: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
  revealedCard: {
    gap: spacing.md,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHover,
  },
  revealedLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  targetAnswerText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  explanationText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  ratingSection: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.sm,
  },
  ratingPrompt: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  ratingButtonsRow: {
    gap: spacing.sm,
  },
  feedbackSection: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.sm,
  },
  recordedRatingText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
