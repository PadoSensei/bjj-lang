import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ViewStyle } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormattedExerciseData } from '../useLesson';
import { MultipleChoiceExercise } from '../../../types/lesson';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface MultipleChoiceViewProps {
  exercise: MultipleChoiceExercise;
  formatted: FormattedExerciseData;
  selectedOptionIndex: number | null;
  isSubmitted: boolean;
  onSelectOption: (index: number) => void;
  onSubmitAnswer: () => void;
  onNext: () => void;
}

export const MultipleChoiceView: React.FC<MultipleChoiceViewProps> = ({
  exercise,
  formatted,
  selectedOptionIndex,
  isSubmitted,
  onSelectOption,
  onSubmitAnswer,
  onNext,
}) => {
  const options = formatted.optionsText || [];
  const isCorrect =
    isSubmitted && selectedOptionIndex === exercise.correctIndex;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      testID="multiple-choice-view"
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.promptCard} testID="mc-prompt-card">
        <Text style={styles.badgeText}>Multiple Choice</Text>
        <Text style={styles.promptText} testID="mc-prompt-text">
          {formatted.promptText}
        </Text>
      </Card>

      <View style={styles.optionsList}>
        {options.map((optionText, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const cardStyles: ViewStyle[] = [styles.optionCard];

          if (isSubmitted) {
            if (idx === exercise.correctIndex) {
              cardStyles.push(styles.correctOptionCard);
            } else if (isSelected) {
              cardStyles.push(styles.incorrectOptionCard);
            } else {
              cardStyles.push(styles.disabledOptionCard);
            }
          } else if (isSelected) {
            cardStyles.push(styles.selectedOptionCard);
          }

          return (
            <Pressable
              key={idx}
              onPress={() => onSelectOption(idx)}
              disabled={isSubmitted}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled: isSubmitted }}
              accessibilityLabel={`Option ${idx + 1}: ${optionText}`}
              testID={`mc-option-${idx}`}
              style={({ pressed }) => [
                ...cardStyles,
                pressed && !isSubmitted ? styles.pressedCard : null,
              ]}
            >
              <Text style={styles.optionIndex}>{String.fromCharCode(65 + idx)}</Text>
              <Text style={styles.optionText}>{optionText}</Text>
              {isSubmitted && idx === exercise.correctIndex ? (
                <Text style={styles.feedbackBadgeText}>✓ Correct</Text>
              ) : isSubmitted && isSelected ? (
                <Text style={styles.feedbackBadgeTextErr}>✕ Incorrect</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {isSubmitted ? (
        <Card
          style={[styles.feedbackCard, isCorrect ? styles.feedbackCardSuccess : styles.feedbackCardError]}
          testID="mc-feedback-card"
        >
          <Text
            style={[styles.feedbackTitle, isCorrect ? styles.feedbackTitleSuccess : styles.feedbackTitleError]}
            testID="mc-feedback-title"
          >
            {isCorrect ? '✓ Correct!' : '✕ Incorrect'}
          </Text>
          {!isCorrect ? (
            <Text style={styles.correctAnswerDisclosure}>
              Correct answer: {options[exercise.correctIndex]}
            </Text>
          ) : null}
          {formatted.explanationText ? (
            <Text style={styles.explanationText}>{formatted.explanationText}</Text>
          ) : null}
          <Button
            title="Continue"
            variant="primary"
            onPress={onNext}
            testID="mc-continue-btn"
          />
        </Card>
      ) : (
        <Button
          title="Check Answer"
          variant="primary"
          disabled={selectedOptionIndex === null}
          onPress={onSubmitAnswer}
          testID="mc-check-btn"
        />
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
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  promptText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 26,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  selectedOptionCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHover,
  },
  correctOptionCard: {
    borderColor: colors.success,
    backgroundColor: colors.surfaceHover,
  },
  incorrectOptionCard: {
    borderColor: colors.error,
    backgroundColor: colors.surfaceHover,
  },
  disabledOptionCard: {
    opacity: 0.5,
  },
  pressedCard: {
    opacity: 0.8,
  },
  optionIndex: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  optionText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
  },
  feedbackBadgeText: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  feedbackBadgeTextErr: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  feedbackCard: {
    gap: spacing.xs,
    padding: spacing.md,
  },
  feedbackCardSuccess: {
    borderColor: colors.success,
    backgroundColor: colors.surfaceHover,
  },
  feedbackCardError: {
    borderColor: colors.error,
    backgroundColor: colors.surfaceHover,
  },
  feedbackTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  feedbackTitleSuccess: {
    color: colors.success,
  },
  feedbackTitleError: {
    color: colors.error,
  },
  correctAnswerDisclosure: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  explanationText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
});
