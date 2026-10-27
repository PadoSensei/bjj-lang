import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export interface ProgressBarProps {
  progress: number; // 0 to 1 (or 0 to 100 if specified)
  showPercentage?: boolean;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = false,
  color = colors.primary,
  height = 8,
  style,
  testID = 'progress-bar',
}) => {
  // Normalize progress between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress > 1 ? progress / 100 : progress, 0), 1);
  const percentageStr = `${Math.round(normalizedProgress * 100)}%`;

  return (
    <View style={[styles.wrapper, style]} testID={testID}>
      <View
        style={[styles.track, { height, borderRadius: radii.full }]}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(normalizedProgress * 100),
        }}
      >
        <View
          style={[
            styles.fill,
            {
              width: percentageStr,
              backgroundColor: color,
              borderRadius: radii.full,
            },
          ]}
          testID={`${testID}-fill`}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentageText} testID={`${testID}-percentage`}>
          {percentageStr}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    backgroundColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  percentageText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    minWidth: 32,
    textAlign: 'right',
  },
});
