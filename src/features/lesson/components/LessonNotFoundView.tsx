import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface LessonNotFoundViewProps {
  lessonId?: string;
  onReturnToCourse: () => void;
}

export const LessonNotFoundView: React.FC<LessonNotFoundViewProps> = ({
  lessonId,
  onReturnToCourse,
}) => {
  return (
    <View style={styles.container} testID="lesson-not-found-view">
      <Card style={styles.card} testID="lesson-not-found-card">
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Lesson Not Found</Text>
        </View>
        <Text style={styles.title} testID="not-found-title">
          Unknown Lesson ID
        </Text>
        <Text style={styles.description}>
          The requested lesson {lessonId ? `"${lessonId}"` : ''} could not be found or is not available in the curriculum.
        </Text>
        <Button
          title="Return to Learning Path"
          variant="primary"
          onPress={onReturnToCourse}
          testID="not-found-back-btn"
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.xl,
  },
  badge: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.error,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
