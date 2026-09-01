import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '../../../components/ui/ProgressBar';
import { orderedProductIds } from '../../../data/paths';
import { getProductById } from '../../../data/products';
import { useAccess } from '../../../hooks/useAccess';
import { useNavigation } from '../../../hooks/useNavigation';
import { useProgress } from '../../../hooks/useProgress';
import { colors, radius, spacing, typography } from '../../../theme';
import { MASTERY_COMPLETE } from '../../../utils/mastery';

/**
 * "Pick up where you left off".
 *
 * Picks the product most worth returning to: something started but not yet
 * mastered, else the first untouched one. Deliberately not the most recently
 * opened — after finishing a product, the useful suggestion is the next gap,
 * not the thing just completed.
 *
 * "First" means first along the learning path, not first in the catalogue.
 * Catalogue order is the order products were written, and going by it offered
 * Swaption — an advanced option *on* a swap — to people who had never opened
 * the app, purely because it was authored second.
 */
export function ResumeCard() {
  const { goToProduct } = useNavigation();
  const { progressFor, masteryFor } = useProgress();
  const { productLocked } = useAccess();

  // "Pick up where you left off" has to name something that opens. The free
  // asset class is always in here, so this can never empty the list.
  const ordered = orderedProductIds().filter((id) => !productLocked(id));
  const inProgress = ordered.find((id) => {
    const mastery = masteryFor(id);
    return mastery > 0 && mastery < MASTERY_COMPLETE;
  });
  const untouched = ordered.find((id) => progressFor(id).attempts === 0);
  const resume = getProductById(inProgress ?? untouched ?? ordered[0]);

  if (resume === undefined) {
    return null;
  }

  const mastery = masteryFor(resume.id);
  const started = progressFor(resume.id).attempts > 0;

  return (
    <View>
      <Text style={styles.eyebrow}>
        {started ? 'PICK UP WHERE YOU LEFT OFF' : 'START HERE'}
      </Text>
      <Pressable
        testID="resume-card"
        onPress={() => goToProduct(resume.id)}
        accessibilityRole="button"
        accessibilityLabel={`${resume.name}. ${mastery} percent mastery. ${resume.hook}`}
        accessibilityHint="Opens this product"
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.row}>
          <Text style={styles.status}>
            {started ? 'IN PROGRESS' : resume.difficulty.toUpperCase()}
          </Text>
          <Text style={styles.percent}>{mastery}%</Text>
        </View>
        <Text style={styles.name}>{resume.name}</Text>
        <Text style={styles.hook}>{resume.hook}</Text>
        <ProgressBar
          testID="resume-progress"
          progress={mastery / 100}
          height={4}
          color={colors.text.onDark}
          style={styles.bar}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.dark,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  status: {
    ...typography.micro,
    color: colors.text.onDarkMuted,
  },
  percent: {
    ...typography.micro,
    fontSize: 11,
    color: colors.text.onDarkMuted,
  },
  name: {
    ...typography.h3,
    color: colors.text.onDark,
    marginTop: spacing.sm,
  },
  hook: {
    ...typography.labelSmall,
    color: colors.text.onDarkMuted,
    marginTop: 4,
  },
  bar: {
    marginTop: spacing.md,
    // The dark card needs a lighter track than the default page background.
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
});
