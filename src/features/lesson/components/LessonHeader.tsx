import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface LessonHeaderProps {
  title: string;
  progressText: string;
  progressValue: number;
  onClose: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  progressText,
  progressValue,
  onClose,
}) => {
  return (
    <View style={styles.container} testID="lesson-header">
      <View style={styles.topRow}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Close lesson and return to learning path"
          testID="lesson-close-btn"
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.stepText} testID="lesson-step-text">
            {progressText}
          </Text>
        </View>
      </View>

      <ProgressBar progress={progressValue} testID="lesson-progress-bar" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.surfaceHover,
  },
  pressed: {
    opacity: 0.7,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
});
