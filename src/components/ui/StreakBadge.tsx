import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

export interface StreakBadgeProps {
  streak: number;
  testID?: string;
}

/** Dark pill showing the current day streak. */
export function StreakBadge({ streak, testID }: StreakBadgeProps) {
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={`${streak} day streak`}
      style={styles.pill}
    >
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.caption}>DAY STREAK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: radius.large,
    paddingVertical: spacing.sm,
    paddingHorizontal: 14,
  },
  count: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 16,
    lineHeight: 20,
    color: colors.text.onDark,
  },
  caption: {
    ...typography.micro,
    color: colors.text.onDarkMuted,
  },
});
