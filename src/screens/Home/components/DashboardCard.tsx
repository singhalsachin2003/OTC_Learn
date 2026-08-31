import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ring } from '../../../components/ui/Ring';
import { TOTAL_QUESTIONS } from '../../../data/products';
import { useLongestStreak, useStreak } from '../../../hooks/useAppState';
import { useNavigation } from '../../../hooks/useNavigation';
import { useProgress } from '../../../hooks/useProgress';
import { useReview } from '../../../hooks/useReview';
import {
  colors,
  masteryColors,
  radius,
  spacing,
  tabularNumbers,
  typography,
} from '../../../theme';
import { masteryBand } from '../../../utils/mastery';

/**
 * The headline card: overall mastery as a ring, with the two numbers most
 * likely to bring someone back — the streak they would break, and the reviews
 * waiting for them.
 */
export function DashboardCard() {
  const { overallPercent, masteredCount, totalCount, questionsAnswered } =
    useProgress();
  const streak = useStreak();
  const longest = useLongestStreak();
  const { dueCount } = useReview();
  const { goToTab } = useNavigation();

  const band = masteryBand(overallPercent);
  const fill =
    band === 'strong'
      ? masteryColors.strong
      : band === 'building'
        ? masteryColors.building
        : band === 'shaky'
          ? masteryColors.shaky
          : masteryColors.none;

  return (
    <Pressable
      testID="dashboard-card"
      onPress={() => goToTab('profile')}
      accessibilityRole="button"
      accessibilityLabel={`Overall mastery ${overallPercent} percent. ${leadLine(masteredCount, totalCount)}`}
      accessibilityHint="Opens your full profile and stats"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Ring
        testID="overall-ring"
        size={86}
        innerSize={66}
        percent={overallPercent}
        fillColor={fill}
        accessibilityLabel={`Overall mastery ${overallPercent} percent`}
      >
        <Text style={styles.ringValue}>{overallPercent}%</Text>
        <Text style={styles.ringLabel}>MASTERY</Text>
      </Ring>

      <View style={styles.detail}>
        <Text style={styles.lead}>{leadLine(masteredCount, totalCount)}</Text>
        <Text style={styles.secondary}>
          {pacingLine(overallPercent, questionsAnswered)}
        </Text>

        <View style={styles.stats}>
          <Stat
            value={String(streak)}
            // "Best streak" is only worth saying once there is a run worth
            // beating; on day one it is true but reads as faint praise.
            label={streak > 1 && streak === longest ? 'BEST STREAK' : 'DAY STREAK'}
            tint={colors.progressFillText}
          />
          <View style={styles.divider} />
          <Stat value={String(dueCount)} label="DUE NOW" />
        </View>
      </View>

      {/* The whole card is now a real button — QuickActions and CategoryGrid
          already taught that pattern below it, so this needs the same
          affordance mark rather than looking identical while doing nothing. */}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function Stat({
  value,
  label,
  tint = colors.text.primary,
}: {
  value: string;
  label: string;
  tint?: string;
}) {
  return (
    // Shrinkable, so the label wraps instead of the row running off the card.
    // At the largest text sizes "DUE NOW" was rendering as "DUE NO", which
    // reads as a different phrase rather than as a cut-off one.
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function leadLine(mastered: number, total: number): string {
  if (mastered === 0) {
    return `${total} products to learn`;
  }
  if (mastered === total) {
    return 'Every product mastered';
  }
  return `${mastered} of ${total} products mastered`;
}

/**
 * Honest pacing copy derived from the actual numbers rather than a fixed
 * string — nothing here claims progress the user has not made.
 */
function pacingLine(percent: number, answered: number): string {
  if (answered === 0) {
    return `${TOTAL_QUESTIONS} questions are waiting. Start anywhere.`;
  }
  if (percent >= 70) {
    return 'Strong across the book. Keep the review queue clear.';
  }
  if (percent >= 35) {
    return 'Building well. Retakes are what move mastery.';
  }
  return 'Early days — one product a day adds up quickly.';
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  chevron: {
    ...typography.h3,
    color: colors.chevron,
  },
  ringValue: {
    ...typography.h3,
    ...tabularNumbers,
    fontSize: 18,
    color: colors.text.primary,
  },
  ringLabel: {
    ...typography.micro,
    fontSize: 8,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  detail: {
    flex: 1,
  },
  lead: {
    ...typography.bodyStrong,
    color: colors.text.primary,
  },
  secondary: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 3,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    marginTop: spacing.md,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
  },
  stat: {
    flexShrink: 1,
  },
  statValue: {
    ...typography.h3,
    ...tabularNumbers,
    fontSize: 17,
  },
  statLabel: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: 3,
  },
});
