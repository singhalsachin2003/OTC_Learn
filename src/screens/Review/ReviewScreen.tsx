import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { StatTile } from '../../components/ui/StatTile';
import { useNavigation } from '../../hooks/useNavigation';
import { useQuiz } from '../../hooks/useQuiz';
import { useReview } from '../../hooks/useReview';
import { useSettings } from '../../hooks/useAppState';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';
import { daysBetween, toDateKey } from '../../utils/formatters';
import { BASE_INTERVALS } from '../../utils/review';

export function ReviewScreen() {
  const { due, dueCount, queuedCount, nextDueOn } = useReview();
  const { startReview } = useQuiz();
  const { goToReviewQuiz, goToTab } = useNavigation();
  const settings = useSettings();

  const begin = () => {
    startReview();
    goToReviewQuiz();
  };

  return (
    <SafeAreaWrapper testID="review-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Review
        </Text>
        <Text style={styles.intro}>
          Questions you have missed come back on a widening schedule — tomorrow,
          then in {BASE_INTERVALS[1]} days, then in {BASE_INTERVALS[2]}. Answer one
          correctly enough times and it retires.
        </Text>

        {!settings.spacedRepetition && (
          <View testID="review-disabled" style={styles.notice}>
            <Text style={styles.noticeText}>
              Spaced repetition is switched off, so nothing new is being queued.
              Turn it back on in Profile.
            </Text>
          </View>
        )}

        <View style={styles.tiles}>
          <StatTile
            testID="review-due-tile"
            value={String(dueCount)}
            label="Due now"
            tint={dueCount > 0 ? colors.progressFillText : colors.text.primary}
          />
          <StatTile value={String(queuedCount)} label="In queue" />
          <StatTile
            value={nextDueOn === null ? '—' : whenLabel(nextDueOn)}
            label="Next up"
          />
        </View>

        {dueCount > 0 ? (
          <Button
            testID="review-start"
            label={`Review ${Math.min(dueCount, settings.sessionSize)} ${
              Math.min(dueCount, settings.sessionSize) === 1
                ? 'question'
                : 'questions'
            }`}
            onPress={begin}
            style={styles.start}
          />
        ) : (
          <View testID="review-empty" style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {queuedCount === 0 ? 'Nothing queued yet' : 'All caught up'}
            </Text>
            <Text style={styles.emptyBody}>
              {queuedCount === 0
                ? 'Questions you get wrong in a quiz land here automatically. Take a quiz to start building the queue.'
                : `Nothing is due today. The next question comes back ${
                    nextDueOn === null ? 'soon' : whenLabel(nextDueOn).toLowerCase()
                  }.`}
            </Text>
            <Button
              testID="review-browse"
              label="Browse products"
              variant="outline"
              onPress={() => goToTab('products')}
              style={styles.browse}
            />
          </View>
        )}

        {due.length > 0 && (
          <View style={styles.list}>
            <Text style={styles.sectionTitle}>WAITING FOR YOU</Text>
            {due.map(({ item, question, product }) => {
              const { accent, soft } = getCategoryColors(product.categoryId);
              return (
                <View key={item.id} style={styles.row}>
                  <View style={[styles.lapses, { backgroundColor: soft }]}>
                    <Text style={[styles.lapsesText, { color: accent }]}>
                      {item.lapses}×
                    </Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text numberOfLines={2} style={styles.prompt}>
                      {question.prompt}
                    </Text>
                    <Text style={styles.rowMeta}>{product.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

/** "Tomorrow", "In 3 days" — a date key on its own means nothing to a reader. */
function whenLabel(dateKey: string): string {
  const days = daysBetween(toDateKey(), dateKey);
  if (Number.isNaN(days)) {
    return '—';
  }
  if (days <= 0) {
    return 'Today';
  }
  return days === 1 ? 'Tomorrow' : `In ${days} days`;
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  intro: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  notice: {
    backgroundColor: colors.error.bgSoft,
    borderRadius: radius.large,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noticeText: {
    ...typography.labelSmall,
    color: colors.error.text,
  },
  tiles: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  start: {
    marginTop: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 6,
  },
  emptyBody: {
    ...typography.body2,
    color: colors.text.muted,
    textAlign: 'center',
  },
  browse: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  list: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  lapses: {
    width: 34,
    height: 34,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lapsesText: {
    ...typography.micro,
    fontSize: 11,
  },
  rowText: {
    flex: 1,
  },
  prompt: {
    ...typography.body2,
    color: colors.text.body,
  },
  rowMeta: {
    ...typography.labelSmall,
    color: colors.text.tertiary,
    marginTop: 3,
  },
});
