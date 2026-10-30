import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormattedReviewItem } from '../reviewScheduler';
import { ReviewOutcome } from '../../../types/review';
import { colors, spacing, typography } from '../../../theme/tokens';
import { ContextualVocabularyView } from '../../vocabulary/components/ContextualVocabularyView';

export interface ReviewCardProps {
  formattedItem: FormattedReviewItem;
  isAnswerRevealed: boolean;
  isSubmitted: boolean;
  lastOutcome: ReviewOutcome | null;
  onRevealAnswer: () => void;
  onSubmitOutcome: (outcome: ReviewOutcome) => void;
  onNext: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  formattedItem,
  isAnswerRevealed,
  isSubmitted,
  lastOutcome,
  onRevealAnswer,
  onSubmitOutcome,
  onNext,
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      testID="review-card-container"
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.promptCard} testID="review-prompt-card">
        <Text style={styles.badgeText}>Vocabulary Prompt</Text>
        <Text style={styles.promptText} testID="review-prompt-text">
          {formattedItem.promptTerm}
        </Text>
        <Text style={styles.subtext}>Try to recall the translation in your head or aloud.</Text>
      </Card>

      {!isAnswerRevealed ? (
        <Button
          title="Show Answer"
          variant="secondary"
          onPress={onRevealAnswer}
          testID="review-show-answer-btn"
        />
      ) : (
        <Card style={styles.revealedCard} testID="review-revealed-card">
          <Text style={styles.revealedLabel}>Target Translation</Text>
          <Text style={styles.targetTermText} testID="review-target-term-text">
            {formattedItem.targetTerm}
          </Text>

          {formattedItem.phonetic ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Pronunciation:</Text>
              <Text style={styles.metaValue} testID="review-phonetic-text">
                [{formattedItem.phonetic}]
              </Text>
            </View>
          ) : null}

          {formattedItem.rawVocab ? (
            <ContextualVocabularyView
              vocab={formattedItem.rawVocab}
              showTermHeader={false}
              testID="review-contextual-vocab"
            />
          ) : formattedItem.contextText || formattedItem.examplePt ? (
            <ContextualVocabularyView
              vocab={{
                id: formattedItem.vocabId,
                termPt: formattedItem.promptTerm,
                termEn: formattedItem.targetTerm,
                context: formattedItem.contextText
                  ? { pt: formattedItem.contextText, en: formattedItem.contextText }
                  : undefined,
                examplePt: formattedItem.examplePt,
                exampleEn: formattedItem.exampleEn,
              }}
              showTermHeader={false}
              testID="review-contextual-vocab"
            />
          ) : null}

          {!isSubmitted ? (
            <View style={styles.actionSection}>
              <Text style={styles.actionPrompt}>Did you remember this item?</Text>
              <View style={styles.buttonRow}>
                <Button
                  title="Needs Practice"
                  variant="outline"
                  onPress={() => onSubmitOutcome('needs-practice')}
                  testID="review-needs-practice-btn"
                />
                <Button
                  title="Remembered"
                  variant="primary"
                  onPress={() => onSubmitOutcome('remembered')}
                  testID="review-remembered-btn"
                />
              </View>
            </View>
          ) : (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackText} testID="review-feedback-text">
                {lastOutcome === 'remembered'
                  ? '✓ Recorded: Remembered (Scheduled for tomorrow)'
                  : '⚡ Recorded: Needs Practice (Re-queued for review)'}
              </Text>
              <Button
                title="Continue"
                variant="primary"
                onPress={onNext}
                testID="review-continue-btn"
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
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  promptText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
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
    letterSpacing: 0.8,
  },
  targetTermText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  metaValue: {
    color: colors.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  contextBox: {
    gap: 2,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 8,
  },
  contextLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  contextText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  actionSection: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.sm,
  },
  actionPrompt: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  buttonRow: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  feedbackSection: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.sm,
  },
  feedbackText: {
    color: colors.success,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
