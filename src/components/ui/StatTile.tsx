import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, tabularNumbers, typography } from '../../theme';

export interface StatTileProps {
  value: string;
  label: string;
  /** Tints the figure — used to mark a streak or an accuracy band. */
  tint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** A boxed figure with a caption. Three across is the standard row. */
export function StatTile({
  value,
  label,
  tint = colors.text.primary,
  style,
  testID,
}: StatTileProps) {
  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${value} ${label}`}
      style={[styles.tile, style]}
    >
      <Text
        style={[styles.value, { color: tint }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  value: {
    ...typography.h2,
    ...tabularNumbers,
    fontSize: 20,
  },
  label: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
