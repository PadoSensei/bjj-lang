import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface ReviewEmptyViewProps {
  nextReviewTimestamp: number | null;
  onReturnToCourse: () => void;
}

export function formatNextReviewTime(nextTimestamp: number | null, now: number = Date.now()): string {
  if (!nextTimestamp) {
    return 'No upcoming reviews scheduled yet. Complete more lessons to unlock review items!';
  }

  const diffMs = nextTimestamp - now;
  if (diffMs <= 0) {
    return 'Your next review is ready now!';
  }

  const diffMinutes = Math.ceil(diffMs / (60 * 1000));
  if (diffMinutes < 60) {
    return `Next review available in ~${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}.`;
  }

  const diffHours = Math.ceil(diffMs / (60 * 60 * 1000));
  if (diffHours < 24) {
    return `Next review available in ~${diffHours} hour${diffHours === 1 ? '' : 's'}.`;
  }

  const dateStr = new Date(nextTimestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `Next review scheduled for ${dateStr}.`;
}

export const ReviewEmptyView: React.FC<ReviewEmptyViewProps> = ({
  nextReviewTimestamp,
  onReturnToCourse,
}) => {
  const nextReviewMessage = formatNextReviewTime(nextReviewTimestamp);

  return (
    <View style={styles.container} testID="review-empty-view">
      <Card style={styles.card}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title} testID="review-empty-title">
          All Caught Up!
        </Text>
        <Text style={styles.description}>
          You have reviewed all available vocabulary items due for this learning direction.
        </Text>

        <View style={styles.nextInfoBox} testID="next-review-info-box">
          <Text style={styles.nextInfoText} testID="next-review-info-text">
            {nextReviewMessage}
          </Text>
        </View>

        <Button
          title="Return to Course"
          variant="primary"
          onPress={onReturnToCourse}
          testID="review-empty-return-btn"
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  card: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  nextInfoBox: {
    backgroundColor: colors.surfaceHover,
    padding: spacing.md,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  nextInfoText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
});
