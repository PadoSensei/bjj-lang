import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
  ...pressableProps
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <Pressable
      testID={testID}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && isInteractive && pressedVariantStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textInverse : colors.primary}
          testID={testID ? `${testID}-loading` : 'button-loading'}
        />
      ) : (
        <Text
          style={[
            styles.textBase,
            textSizeStyles[size],
            textVariantStyles[variant],
            disabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44, // Minimum touch target size
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  textDisabled: {
    color: colors.textMuted,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const pressedVariantStyles: Record<ButtonVariant, ViewStyle> = StyleSheet.create({
  primary: {
    backgroundColor: colors.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.surfaceHover,
  },
  outline: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  ghost: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

const textSizeStyles: Record<ButtonSize, TextStyle> = StyleSheet.create({
  sm: {
    fontSize: typography.fontSize.sm,
  },
  md: {
    fontSize: typography.fontSize.md,
  },
  lg: {
    fontSize: typography.fontSize.lg,
  },
});

const textVariantStyles: Record<ButtonVariant, TextStyle> = StyleSheet.create({
  primary: {
    color: colors.textInverse,
  },
  secondary: {
    color: colors.textPrimary,
  },
  outline: {
    color: colors.primary,
  },
  ghost: {
    color: colors.primary,
  },
});
