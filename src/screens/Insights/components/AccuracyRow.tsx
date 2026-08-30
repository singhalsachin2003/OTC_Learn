import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  radius,
  spacing,
  tabularNumbers,
  typography,
} from '../../../theme';

export interface AccuracyRowProps {
  label: string;
  accuracyPercent: number;
  answered: number;
  /** Below the sample floor the figure is shown but never ranked or tinted. */
  confident: boolean;
  /** Accent for the filled portion. Defaults to the neutral progress fill. */
  tint?: string;
  testID?: string;
}

/**
 * One labelled accuracy bar.
 *
 * A row under the confidence floor still shows its percentage — hiding it
 * would imply there is nothing there — but renders untinted and captions the
 * sample size, so a 0% drawn from two answers cannot be read as a verdict.
 */
export function AccuracyRow({
  label,
  accuracyPercent,
  answered,
  confident,
  tint = colors.progressFill,
  testID,
}: AccuracyRowProps) {
  const fill = confident ? tint : colors.line.strong;

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={
        answered === 0
          ? `${label}. No questions answered yet.`
          : `${label}. ${accuracyPercent} percent correct from ${answered} ${
              answered === 1 ? 'answer' : 'answers'
            }.${confident ? '' : ' Too few to draw a conclusion.'}`
      }
      style={styles.row}
    >
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.percent, !confident && styles.percentMuted]}>
          {answered === 0 ? '—' : `${accuracyPercent}%`}
        </Text>
      </View>

      <View style={styles.track} accessibilityElementsHidden>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(0, Math.min(100, accuracyPercent))}%`,
              backgroundColor: fill,
            },
          ]}
        />
      </View>

      <Text style={styles.caption}>
        {answered === 0
          ? 'Not attempted'
          : confident
            ? `${answered} answered`
            : `${answered} answered · too few to rank`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body2,
    color: colors.text.primary,
    flexShrink: 1,
    paddingRight: spacing.sm,
  },
  percent: {
    ...typography.bodyStrong,
    ...tabularNumbers,
    color: colors.text.primary,
  },
  percentMuted: {
    color: colors.text.tertiary,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.line.soft,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  caption: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
