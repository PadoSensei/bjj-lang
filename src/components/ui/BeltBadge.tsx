import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BeltType, colors, radii, spacing, typography } from '../../theme/tokens';

export interface BeltBadgeProps {
  belt: BeltType;
  label?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const BeltBadge: React.FC<BeltBadgeProps> = ({
  belt,
  label,
  size = 'md',
  style,
  testID = 'belt-badge',
}) => {
  const beltConfig = colors.belts[belt] || colors.belts.white;
  const displayLabel = label || beltConfig.label;

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        styles[size],
        {
          backgroundColor: beltConfig.belt,
          borderColor: beltConfig.border,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Belt milestone: ${displayLabel}`}
    >
      {/* Black rank bar on the belt */}
      <View
        style={[
          styles.blackBar,
          size === 'sm' ? styles.blackBarSm : styles.blackBarMd,
          belt === 'black' && styles.blackBarOnBlack,
        ]}
      />
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: beltConfig.text },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  blackBar: {
    backgroundColor: '#18181B',
    borderRadius: 2,
    marginRight: spacing.xs,
  },
  blackBarSm: {
    width: 6,
    height: 12,
  },
  blackBarMd: {
    width: 8,
    height: 16,
  },
  blackBarOnBlack: {
    backgroundColor: '#DC2626', // Red rank bar for black belt
  },
  text: {
    fontWeight: typography.fontWeight.bold,
  },
  textSm: {
    fontSize: typography.fontSize.xs,
  },
  textMd: {
    fontSize: typography.fontSize.sm,
  },
});
