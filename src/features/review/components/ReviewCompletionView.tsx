import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface ReviewCompletionViewProps {
  totalItemsReviewed: number;
  onReturnToCourse: () => void;
}

export const ReviewCompletionView: React.FC<ReviewCompletionViewProps> = ({
  totalItemsReviewed,
  onReturnToCourse,
}) => {
  return (
    <View style={styles.container} testID="review-completion-view">
      <Card style={styles.card}>
        <Text style={styles.icon}>🥋</Text>
        <Text style={styles.title} testID="review-completion-title">
          Session Complete!
        </Text>
        <Text style={styles.description}>
          Great work! You reviewed {totalItemsReviewed} vocabulary item{totalItemsReviewed === 1 ? '' : 's'}. Keeping your recall sharp is the key to mastering Jiu-Jitsu terminology.
        </Text>

        <Button
          title="Return to Course"
          variant="primary"
          onPress={onReturnToCourse}
          testID="review-completion-return-btn"
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
});
