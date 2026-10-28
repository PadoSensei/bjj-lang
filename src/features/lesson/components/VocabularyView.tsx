import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CourseDirection } from '../../../components/ui/CourseDirectionSelector';
import { VocabularyItem } from '../../../types/lesson';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface VocabularyViewProps {
  objective: string;
  vocabulary: VocabularyItem[];
  direction: CourseDirection;
  onStartExercises: () => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  objective,
  vocabulary,
  direction,
  onStartExercises,
}) => {
  const isEnToPt = direction === 'en->pt-BR';

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      testID="vocabulary-view"
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.introCard} testID="vocabulary-intro-card">
        <Text style={styles.badgeText}>Lesson Objective</Text>
        <Text style={styles.objectiveText}>{objective}</Text>
      </Card>

      <Text style={styles.sectionHeader}>
        Key Vocabulary ({vocabulary.length})
      </Text>

      {vocabulary.map((item, idx) => {
        const primaryTerm = isEnToPt ? item.termPt : item.termEn;
        const secondaryTerm = isEnToPt ? item.termEn : item.termPt;
        const contextText = isEnToPt ? item.context?.pt || item.context?.en : item.context?.en || item.context?.pt;

        return (
          <Card key={item.id || idx} style={styles.vocabCard} testID={`vocab-card-${idx}`}>
            <View style={styles.termRow}>
              <Text style={styles.primaryTerm}>{primaryTerm}</Text>
              <Text style={styles.secondaryTerm}>• {secondaryTerm}</Text>
            </View>
            {contextText ? (
              <Text style={styles.contextText}>{contextText}</Text>
            ) : null}
          </Card>
        );
      })}

      <View style={styles.actionContainer}>
        <Button
          title="Start Exercises"
          variant="primary"
          onPress={onStartExercises}
          testID="start-exercises-btn"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  introCard: {
    gap: spacing.xs,
    backgroundColor: colors.surfaceHover,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  objectiveText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    lineHeight: 22,
  },
  sectionHeader: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },
  vocabCard: {
    gap: spacing.xs,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  primaryTerm: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryTerm: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  contextText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
});
