import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { BeltBadge } from '../../../components/ui/BeltBadge';
import { LessonScore } from '../../../types/lesson';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface LessonCompletionViewProps {
  lessonTitle: string;
  score: LessonScore;
  onRetry: () => void;
  onReturnToCourse: () => void;
}

export const LessonCompletionView: React.FC<LessonCompletionViewProps> = ({
  lessonTitle,
  score,
  onRetry,
  onReturnToCourse,
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      testID="lesson-completion-view"
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.card} testID="completion-card">
        <BeltBadge belt="white" label="Lesson Completed!" testID="completion-badge" />

        <Text style={styles.title}>{lessonTitle}</Text>
        <Text style={styles.subtitle}>Great job finishing this BJJ vocabulary lesson!</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scorePercentage} testID="score-percentage">
            {score.percentage}%
          </Text>
          <Text style={styles.scoreFraction} testID="score-fraction">
            {score.totalCorrect} / {score.totalExercises} Correct
          </Text>
        </View>

        <View style={styles.breakdownContainer}>
          {score.gradedTotal > 0 ? (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Multiple Choice (Graded):</Text>
              <Text style={styles.breakdownValue}>
                {score.gradedCorrect} / {score.gradedTotal}
              </Text>
            </View>
          ) : null}

          {score.recallTotal > 0 ? (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Translation Recall (Self-Rated):</Text>
              <Text style={styles.breakdownValue}>
                {score.recallCorrect} / {score.recallTotal}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Retry Lesson"
            variant="secondary"
            onPress={onRetry}
            testID="retry-lesson-btn"
          />
          <Button
            title="Back to Learning Path"
            variant="primary"
            onPress={onReturnToCourse}
            testID="completion-back-btn"
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  card: {
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceHover,
    borderRadius: 16,
    width: '100%',
  },
  scorePercentage: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  scoreFraction: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  breakdownContainer: {
    width: '100%',
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  actionsContainer: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
