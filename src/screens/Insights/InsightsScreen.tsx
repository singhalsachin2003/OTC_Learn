import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { StatTile } from '../../components/ui/StatTile';
import { getCategoryById } from '../../data/categories';
import { getProductById, TOTAL_PRODUCTS } from '../../data/products';
import { useInsights } from '../../hooks/useInsights';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import type { LessonStepNumber } from '../../data/types';
import type { RecommendationReason } from '../../utils/insights';
import {
  colors,
  getCategoryColors,
  masteryColors,
  radius,
  spacing,
  typography,
} from '../../theme';
import { AccuracyRow } from './components/AccuracyRow';

/**
 * What the numbers add up to.
 *
 * The screen answers three questions in order — how am I doing, where am I
 * weak, what should I do next — because that is the order they are useful in.
 * A weakness with no suggested action is just a criticism.
 *
 * Nothing here is a new measurement: every figure is derived from mastery and
 * the question history the app already keeps, so this screen can never
 * disagree with the ones it summarises.
 */

/**
 * Every product's lesson follows the same five-step arc, so a step number means
 * the same thing catalogue-wide and can be labelled once here. Verified against
 * the content: steps 1, 3 and 5 carry an identical title in 35 or 36 of the 36
 * products, and the handful of step 2 and 4 variants are on the same theme.
 */
const STEP_LABELS: Record<LessonStepNumber, string> = {
  1: 'What it is',
  2: 'How it works',
  3: "Why it's used",
  4: 'Key terms',
  5: 'Risks to watch',
};

const REASON_LABELS: Record<RecommendationReason, string> = {
  'nearly-there': 'One good session from mastered',
  shaky: 'Started, but not sticking yet',
  'continue-category': 'Next in an asset class you have begun',
  'start-here': 'A good place to start',
};

export function InsightsScreen() {
  const { goToTab, goToProduct } = useNavigation();
  const { accuracyPercent, questionsAnswered } = useProgress();
  const {
    accuracyByCategory,
    weakestSteps,
    accuracyByStep,
    distribution,
    consistency,
    recommendations,
    tooEarly,
  } = useInsights();

  return (
    <SafeAreaWrapper testID="insights-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="insights-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Insights
        </Text>
        <Text style={styles.subtitle}>
          Drawn from every question you have answered.
        </Text>

        <View style={styles.statRow}>
          <StatTile
            testID="insights-accuracy"
            value={questionsAnswered === 0 ? '—' : `${accuracyPercent}%`}
            label="Accuracy"
            tint={colors.progressFillText}
          />
          <StatTile
            testID="insights-answered"
            value={`${questionsAnswered}`}
            label="Answered"
          />
          <StatTile
            testID="insights-consistency"
            value={`${consistency.studied}/${consistency.window}`}
            label="Days studied"
          />
        </View>

        {tooEarly ? (
          <View style={styles.empty} testID="insights-too-early">
            <Text style={styles.emptyTitle}>Not enough to go on yet</Text>
            <Text style={styles.emptyBody}>
              Finish a few more quizzes and this screen will show where you are
              strong, which parts of a lesson trip you up, and what to study next.
              Rankings stay hidden until there are enough answers to mean something.
            </Text>
          </View>
        ) : (
          <>
            <Section
              title="Where the gaps are"
              blurb="Accuracy on each part of a lesson, across every product. The five steps follow the same arc everywhere, so a weak step is a weak habit rather than a weak product."
            >
              {(weakestSteps.length > 0 ? weakestSteps : accuracyByStep).map(
                (bucket) => (
                  <AccuracyRow
                    key={bucket.step}
                    testID={`insights-step-${bucket.step}`}
                    label={STEP_LABELS[bucket.step]}
                    accuracyPercent={bucket.accuracyPercent}
                    answered={bucket.answered}
                    confident={bucket.confident}
                  />
                ),
              )}
            </Section>

            <Section
              title="By asset class"
              blurb="How each class is going. A class you have barely touched is marked rather than ranked."
            >
              {accuracyByCategory.map((bucket) => (
                <AccuracyRow
                  key={bucket.categoryId}
                  testID={`insights-category-${bucket.categoryId}`}
                  label={
                    getCategoryById(bucket.categoryId)?.name ?? bucket.categoryId
                  }
                  accuracyPercent={bucket.accuracyPercent}
                  answered={bucket.answered}
                  confident={bucket.confident}
                  tint={getCategoryColors(bucket.categoryId).accent}
                />
              ))}
            </Section>
          </>
        )}

        {recommendations.length > 0 && (
          <Section
            title="Study next"
            blurb="Ordered by what a single session would buy you, not by lowest score."
          >
            {recommendations.map((entry) => {
              const product = getProductById(entry.productId);
              if (product === undefined) {
                return null;
              }
              return (
                <Text
                  key={entry.productId}
                  testID={`insights-next-${entry.productId}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${product.name}. ${REASON_LABELS[entry.reason]}. Mastery ${entry.mastery} percent.`}
                  onPress={() => goToProduct(entry.productId)}
                  style={styles.recommendation}
                >
                  <Text style={styles.recommendationName}>{product.name}</Text>
                  {'\n'}
                  <Text style={styles.recommendationReason}>
                    {REASON_LABELS[entry.reason]}
                    {entry.mastery > 0 ? ` · ${entry.mastery}% mastery` : ''}
                  </Text>
                </Text>
              );
            })}
          </Section>
        )}

        <Section
          title="Catalogue"
          blurb={`Where the ${TOTAL_PRODUCTS} products stand.`}
        >
          <View style={styles.bands}>
            <Band
              label="Strong"
              count={distribution.strong}
              tint={masteryColors.strong}
            />
            <Band
              label="Building"
              count={distribution.building}
              tint={masteryColors.building}
            />
            <Band
              label="Shaky"
              count={distribution.shaky}
              tint={masteryColors.shaky}
            />
            <Band
              label="Not started"
              count={distribution['not started']}
              tint={masteryColors.none}
            />
          </View>
        </Section>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function Section({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      <Text style={styles.sectionBlurb}>{blurb}</Text>
      {children}
    </View>
  );
}

function Band({
  label,
  count,
  tint,
}: {
  label: string;
  count: number;
  tint: string;
}) {
  return (
    <View
      style={styles.band}
      accessibilityRole="text"
      accessibilityLabel={`${count} ${label}`}
    >
      <View style={[styles.bandDot, { backgroundColor: tint }]} />
      <Text style={styles.bandCount}>{count}</Text>
      <Text style={styles.bandLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    columnGap: spacing.sm,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  sectionBlurb: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyBody: {
    ...typography.body2,
    color: colors.text.body,
  },
  recommendation: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recommendationName: {
    ...typography.bodyStrong,
    color: colors.text.primary,
  },
  recommendationReason: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  bands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  band: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    columnGap: spacing.xs,
  },
  bandDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  bandCount: {
    ...typography.bodyStrong,
    color: colors.text.primary,
  },
  bandLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
});
