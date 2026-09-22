import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { layout, radius, shadows } from '../../theme';
import { useThemedStyles } from '../../hooks/useTheme';
import type { Palette } from '../../theme/colors';

export interface CardProps {
  children: ReactNode;
  /** Makes the whole card a touch target. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/** White surface with the standard 16px padding, 18px radius and card shadow. */
export function Card({
  children,
  onPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: CardProps) {
  const styles = useThemedStyles(makeStyles);
  if (onPress === undefined) {
    return (
      <View testID={testID} style={[styles.card, style]}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      {children}
    </Pressable>
  );
}

const makeStyles = ({ colors }: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: layout.cardPadding,
      ...shadows.card,
    },
    pressed: {
      opacity: 0.9,
    },
  });
