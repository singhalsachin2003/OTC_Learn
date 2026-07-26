import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

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
  color = colors.text.primary,
  backgroundColor = colors.track,
  style,
  testID,
}: BadgeProps) {
  return (
    <View testID={testID} style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

/** Green circular checkmark shown on completed products. */
export function CompletedBadge({ testID }: { testID?: string }) {
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel="Completed"
      style={styles.completed}
    >
      <Text style={styles.completedMark}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  completedMark: {
    ...typography.label,
    fontSize: 11,
    lineHeight: 14,
    color: colors.text.onDark,
  },
});
