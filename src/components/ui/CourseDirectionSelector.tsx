import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export type CourseDirection = 'pt-BR->en' | 'en->pt-BR';

export interface CourseDirectionSelectorProps {
  activeDirection: CourseDirection;
  onDirectionChange: (direction: CourseDirection) => void;
  testID?: string;
}

export const CourseDirectionSelector: React.FC<CourseDirectionSelectorProps> = ({
  activeDirection,
  onDirectionChange,
  testID = 'course-direction-selector',
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        testID={`${testID}-option-pt-BR->en`}
        onPress={() => onDirectionChange('pt-BR->en')}
        accessibilityRole="button"
        accessibilityState={{ selected: activeDirection === 'pt-BR->en' }}
        style={[
          styles.option,
          activeDirection === 'pt-BR->en' && styles.optionActive,
        ]}
      >
        <Text style={styles.flag}>🇧🇷 ➔ 🇺🇸</Text>
        <Text
          style={[
            styles.label,
            activeDirection === 'pt-BR->en' && styles.labelActive,
          ]}
        >
          PT ➔ EN
        </Text>
      </Pressable>

      <Pressable
        testID={`${testID}-option-en->pt-BR`}
        onPress={() => onDirectionChange('en->pt-BR')}
        accessibilityRole="button"
        accessibilityState={{ selected: activeDirection === 'en->pt-BR' }}
        style={[
          styles.option,
          activeDirection === 'en->pt-BR' && styles.optionActive,
        ]}
      >
        <Text style={styles.flag}>🇺🇸 ➔ 🇧🇷</Text>
        <Text
          style={[
            styles.label,
            activeDirection === 'en->pt-BR' && styles.labelActive,
          ]}
        >
          EN ➔ PT
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    padding: spacing.xs,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    gap: spacing.xs,
    minHeight: 36,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  flag: {
    fontSize: typography.fontSize.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.textInverse,
  },
});
