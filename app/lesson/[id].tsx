import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function LessonPlaceholderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer testID="lesson-placeholder-screen">
      <View style={styles.content}>
        <Card style={styles.card} testID="lesson-placeholder-card">
          <View style={styles.badge}>
            <Text style={styles.badgeText}>M1.2 Placeholder</Text>
          </View>
          <Text style={styles.title} testID="lesson-id-title">
            Lesson Route: {id || 'Unknown'}
          </Text>
          <Text style={styles.description}>
            Interactive lesson mechanics, flashcards, exercises, and audio controls
            will be fully implemented in Milestone M1.2.
          </Text>
        </Card>

        <Button
          title="Return to Learning Path"
          variant="primary"
          onPress={() => router.back()}
          testID="back-to-home-btn"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  card: {
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.xl,
  },
  badge: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.primary,
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
