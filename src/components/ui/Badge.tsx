import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';

import { radius, spacing, typography } from '../../theme';
import { useTheme, useThemedStyles } from '../../hooks/useTheme';
import type { Palette } from '../../theme/colors';

export interface BadgeProps {
  label: string;
  /** Text colour; also drives the default tinted background. */
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Small tinted pill — used for the "STEP 1 OF 3" tag on lesson cards. */
export function Badge({
  label,
  color,
  backgroundColor,
  style,
  testID,
}: BadgeProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      testID={testID}
      style={[
        styles.badge,
        { backgroundColor: backgroundColor ?? colors.track },
        style,
      ]}
    >
      <Text style={[styles.label, { color: color ?? colors.text.primary }]}>
        {label}
      </Text>
    </View>
  );
}

/** Green circular checkmark shown on completed products. */
export function CompletedBadge({ testID }: { testID?: string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel="Completed"
      style={styles.completed}
    >
      {/* A drawn checkmark rather than "✓" — Plus Jakarta Sans lacks the
          glyph, the same font-substitution risk fixed elsewhere already. */}
      <Check size={12} strokeWidth={3} color={colors.text.onDark} />
    </View>
  );
}

const makeStyles = ({ colors }: Palette) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.xs,
      paddingHorizontal: 10,
      borderRadius: radius.small,
    },
    label: {
      ...typography.label,
      fontSize: 11,
      letterSpacing: 0.33,
    },
    completed: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.success.strong,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
