import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '../../../hooks/useNavigation';
import { useReview } from '../../../hooks/useReview';
import { colors, radius, spacing, typography } from '../../../theme';
import { toDateKey } from '../../../utils/formatters';

/** Two half-width shortcuts: the review queue and the full product list. */
export function QuickActions() {
  const { goToTab } = useNavigation();
  const { dueCount, queuedCount, nextDueOn } = useReview();

  return (
    <View style={styles.row}>
      <Action
        testID="quick-review"
        title="Review queue"
        subtitle={reviewSubtitle(dueCount, queuedCount, nextDueOn)}
        highlighted={dueCount > 0}
        onPress={() => goToTab('review')}
      />
      <Action
        testID="quick-products"
        title="All products"
        subtitle="Browse and search"
        onPress={() => goToTab('products')}
      />
    </View>
  );
}

function reviewSubtitle(
  due: number,
  queued: number,
  nextDueOn: string | null,
): string {
  if (due > 0) {
    return `${due} due today`;
  }
  if (queued === 0) {
    return 'Nothing queued';
  }
  // Everything queued is scheduled ahead, so say when rather than "0 due".
  return nextDueOn === toDateKey() ? 'All caught up' : 'All caught up for today';
}

function Action({
  title,
  subtitle,
  onPress,
  highlighted = false,
  testID,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  highlighted?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [
        styles.action,
        highlighted && styles.highlighted,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.title, highlighted && styles.titleHighlighted]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, highlighted && styles.subtitleHighlighted]}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    columnGap: spacing.md,
    marginTop: spacing.md,
  },
  action: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md + 2,
  },
  highlighted: {
    backgroundColor: colors.success.bgSoft,
    borderColor: colors.success.strong,
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    ...typography.label,
    fontSize: 13.5,
    color: colors.text.primary,
  },
  titleHighlighted: {
    color: colors.success.text,
  },
  subtitle: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 3,
  },
  subtitleHighlighted: {
    color: colors.success.text,
  },
});
