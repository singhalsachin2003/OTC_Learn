import { StyleSheet, Text, View } from 'react-native';

import type { WorkedExample as WorkedExampleData } from '../../../data/types';
import { colors, radius, spacing, typography } from '../../../theme';

export interface WorkedExampleProps {
  example: WorkedExampleData;
  accent: string;
  soft: string;
}

/**
 * The numbers, laid out as a numbered sequence.
 *
 * Each line is a step in one calculation, so they are numbered rather than
 * bulleted — the order is the argument, and a reader who loses their place in
 * the middle of a cash-flow walkthrough has lost the point of it.
 */
export function WorkedExample({ example, accent, soft }: WorkedExampleProps) {
  return (
    <View testID="worked-example" style={[styles.card, { borderColor: accent }]}>
      <Text style={styles.title}>{example.title}</Text>

      {example.lines.map((line, index) => (
        <View key={line} style={styles.line}>
          <Text style={[styles.number, { backgroundColor: soft, color: accent }]}>
            {index + 1}
          </Text>
          <Text style={styles.lineText}>{line}</Text>
        </View>
      ))}

      <View style={[styles.takeaway, { backgroundColor: soft }]}>
        <Text style={[styles.takeawayLabel, { color: accent }]}>SO WHAT</Text>
        <Text style={styles.takeawayText}>{example.takeaway}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.label,
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  line: {
    flexDirection: 'row',
    columnGap: 10,
    marginBottom: spacing.sm,
  },
  number: {
    ...typography.micro,
    width: 18,
    height: 18,
    lineHeight: 18,
    borderRadius: 9,
    textAlign: 'center',
    overflow: 'hidden',
  },
  lineText: {
    ...typography.body2,
    color: colors.text.body,
    flex: 1,
  },
  takeaway: {
    borderRadius: radius.medium,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  takeawayLabel: {
    ...typography.micro,
    marginBottom: 4,
  },
  takeawayText: {
    ...typography.body2,
    color: colors.text.body,
  },
});
