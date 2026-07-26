import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useProgress } from '../../../hooks/useProgress';
import { colors, spacing, typography } from '../../../theme';
import { formatProgressLabel } from '../../../utils/formatters';

/** "Your progress — 3 / 10 products" card with the overall completion bar. */
export function ProgressCard() {
  const { completedCount, totalCount, ratio } = useProgress();
  const label = formatProgressLabel(completedCount, totalCount);

  return (
    <Card testID="progress-card" style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Your progress</Text>
        <Text style={styles.count}>{label}</Text>
      </View>
      <ProgressBar
        testID="overall-progress"
        progress={ratio}
        accessibilityLabel={`Your progress: ${label}`}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg + 2,
    marginBottom: spacing.xxl - 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.label,
    color: colors.text.primary,
  },
  count: {
    ...typography.label,
    fontFamily: typography.bodyStrong.fontFamily,
    fontSize: 12,
    color: colors.text.secondary,
  },
});
