import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CourseDirection } from '../../../domain/direction';
import { colors, radii, spacing, typography } from '../../../theme/tokens';

/** The two flashcard decks, named as the learner sees them (ADR-009). */
export const DECK_OPTIONS: { direction: CourseDirection; label: string; testID: string }[] = [
  { direction: 'pt-BR->en', label: 'Português → English', testID: 'deck-toggle-pt-en' },
  { direction: 'en->pt-BR', label: 'English → Português', testID: 'deck-toggle-en-pt' },
];

export interface DeckToggleProps {
  selected: CourseDirection;
  /** A number shown on each deck, such as cards due or history entries. */
  dueCounts: Record<CourseDirection, number>;
  onSelect: (direction: CourseDirection) => void;
  /** How the count is read out to screen readers. */
  countLabel?: string;
}

export const DeckToggle: React.FC<DeckToggleProps> = ({
  selected,
  dueCounts,
  onSelect,
  countLabel = 'para revisar',
}) => (
  <View style={styles.row} accessibilityRole="tablist" testID="deck-toggle">
    {DECK_OPTIONS.map(({ direction, label, testID }) => {
      const isSelected = direction === selected;
      return (
        <Pressable
          key={direction}
          testID={testID}
          accessibilityRole="tab"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${label}, ${dueCounts[direction]} ${countLabel}`}
          onPress={() => {
            if (!isSelected) onSelect(direction);
          }}
          style={({ pressed }) => [styles.option, isSelected && styles.optionSelected, pressed && styles.optionPressed]}
        >
          <Text style={[styles.label, isSelected && styles.labelSelected]} testID={`${testID}-label`}>
            {label}
          </Text>
          <Text style={[styles.count, isSelected && styles.labelSelected]} testID={`${testID}-count`}>
            {dueCounts[direction]}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  option: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHover,
  },
  optionPressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    flexShrink: 1,
  },
  labelSelected: {
    color: colors.textPrimary,
  },
  count: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.sm,
  },
});
