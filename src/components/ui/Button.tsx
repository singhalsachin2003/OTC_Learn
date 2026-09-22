import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { layout, radius, typography } from '../../theme';
import { useThemedStyles } from '../../hooks/useTheme';
import type { Palette } from '../../theme/colors';

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'success' | 'danger';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Flex weight when laid out in a row of buttons. */
  flex?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  flex,
  style,
  textStyle,
  testID,
  accessibilityHint,
}: ButtonProps) {
  const styles = useThemedStyles(makeStyles);
  const variantStyle = useThemedStyles(makeVariants)[variant];

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        flex !== undefined && { flex },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, variantStyle.label, textStyle]}>{label}</Text>
    </Pressable>
  );
}

/**
 * Built per palette like the stylesheet below it, and cached the same way — the
 * five variants are colour and nothing else, so they cannot be a module
 * constant once there are two palettes.
 */
const makeVariants = ({
  colors,
}: Palette): Record<ButtonVariant, { container: ViewStyle; label: TextStyle }> =>
  ({
    primary: {
      container: { backgroundColor: colors.primaryFill },
      label: { color: colors.text.onPrimary },
    },
    secondary: {
      container: { backgroundColor: colors.track },
      label: { color: colors.secondaryButtonText },
    },
    outline: {
      container: {
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.border,
      },
      label: { color: colors.text.primary },
    },
    success: {
      container: {
        backgroundColor: colors.success.bgSoft,
        borderWidth: 2,
        borderColor: colors.success.strong,
      },
      label: {
        color: colors.success.text,
        fontFamily: typography.h3.fontFamily,
        fontSize: 14,
      },
    },
    danger: {
      container: {
        backgroundColor: colors.error.bgSoft,
        borderWidth: 2,
        borderColor: colors.error.strong,
      },
      label: {
        color: colors.error.text,
        fontFamily: typography.h3.fontFamily,
        fontSize: 14,
      },
    },
  }) as const;

const makeStyles = (_: Palette) =>
  StyleSheet.create({
    base: {
      minHeight: layout.minTouchTarget,
      paddingVertical: 14,
      paddingHorizontal: layout.cardPadding,
      borderRadius: radius.large,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      ...typography.label,
      fontSize: 13.5,
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.4,
    },
    pressed: {
      opacity: 0.85,
    },
  });
