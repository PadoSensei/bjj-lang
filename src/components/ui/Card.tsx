import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  testID,
  accessibilityLabel,
}) => {
  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.base,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={[styles.base, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    padding: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
    opacity: 0.9,
  },
});
