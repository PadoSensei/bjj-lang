import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../../theme/tokens';

/**
 * Shown while stored progress is loading, so a reload or deep link to the
 * review screen never flashes the "All Caught Up!" empty state by mistake.
 */
export const ReviewLoadingView: React.FC = () => (
  <View
    style={styles.container}
    testID="review-loading"
    accessibilityRole="progressbar"
    accessibilityLabel="Loading your review"
  >
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.text}>Loading your review…</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
