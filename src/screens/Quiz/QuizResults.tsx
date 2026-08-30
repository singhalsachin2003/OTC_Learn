import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { Ring } from '../../components/ui/Ring';
import { masteryFill } from '../../components/ui/ProductRow';
import { getAchievementById } from '../../data/achievements';
import { getCategoryById } from '../../data/categories';
import { examScopeName } from '../../data/examScopes';
import { getProductById, getQuestionById } from '../../data/products';
import {
  useAppDispatch,
  useAppSelector,
  useSelectedCategoryId,
  useSelectedProductId,
} from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import { navigateToQuiz } from '../../store/slices/appSlice';
import { resetQuiz } from '../../store/slices/quizSlice';
import { EXAM_PASS_MARK } from '../../utils/exam';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';
import { formatScore } from '../../utils/formatters';
import { formatElapsed } from './components/QuizTimer';
import { ResultsCard } from './components/ResultsCard';
import { StepBreakdown } from './components/StepBreakdown';

export function QuizResults() {
  const dispatch = useAppDispatch();
  const { goToExam, goToProduct, goToTab } = useNavigation();
  const productId = useSelectedProductId();
  const categoryId = useSelectedCategoryId();
  const quiz = useAppSelector((state) => state.quiz);
  const justEarned = useAppSelector((state) => state.progress.recentlyUnlockedIds);
  const { masteryFor } = useProgress();

  const isReview = quiz.mode === 'review';
  const isExam = quiz.mode === 'exam';
  const examScope = examScopeName(quiz.scopeId);
  const product = getProductById(productId);
  const category = getCategoryById(categoryId ?? product?.categoryId ?? null);
  const { accent, soft } = getCategoryColors(category?.id ?? '');

  const total = quiz.questions.length;
  const score = quiz.score;
  const perfect = total > 0 && score === total;
  const examPassed =
    total > 0 && Math.round((score / total) * 100) >= EXAM_PASS_MARK;
  const mastery = product === undefined ? 0 : masteryFor(product.id);

  // Everything was recorded when the quiz finished, so a retake only clears the
  // sitting — mastery and the review queue keep what the last attempt earned.
  const retry = () => {
    dispatch(resetQuiz());
    dispatch(navigateToQuiz());
  };

  const missed = quiz.answers.filter((record) => !record.correct);
  const newBadges = justEarned
    .map(getAchievementById)
    .filter((badge) => badge !== undefined);

  return (
    <SafeAreaWrapper testID="results-screen">
      {/* The two action buttons live outside the ScrollView, mirroring
          QuizScreen's own QuizButtons — otherwise a sitting with a fresh
          achievement or several missed questions pushes the primary "back"
          button below the fold, reachable only after scrolling past every
          informational card first. */}
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ResultsCard
            perfect={perfect}
            accent={accent}
            accentSoft={soft}
            title={
              perfect
                ? 'Perfect score'
                : isExam
                  ? examPassed
                    ? 'Exam passed'
                    : 'Exam complete'
                  : 'Quiz complete'
            }
            subtitle={
              isReview
                ? `You scored ${formatScore(score, total)} on your review`
                : isExam
                  ? `You scored ${formatScore(score, total)} on the ${examScope} exam · ${
                      examPassed ? 'pass' : `${EXAM_PASS_MARK}% to pass`
                    }`
                  : `You scored ${formatScore(score, total)} on ${product?.name ?? 'this product'}`
            }
          />

          {/*
            An exam deliberately moves no mastery, so it shows no mastery ring —
            see `completeExamSession`. Rendering one here would imply a
            measurement the sitting did not make.
          */}
          {!isReview && !isExam && product !== undefined && (
            <View testID="results-mastery" style={styles.masteryRow}>
              <Ring
                size={72}
                innerSize={54}
                percent={mastery}
                fillColor={masteryFill(mastery)}
                accessibilityLabel={`Mastery now ${mastery} percent`}
              >
                <Text style={styles.ringValue}>{mastery}%</Text>
              </Ring>
              <View style={styles.masteryText}>
                <Text style={styles.masteryTitle}>Mastery in {product.name}</Text>
                <Text style={styles.masteryNote}>
                  Mastery moves toward each score rather than replacing it, so a
                  second run on this product counts for more than a lucky first.
                </Text>
              </View>
            </View>
          )}

          {quiz.finishedInMs !== null && (
            <Text testID="results-time" style={styles.time}>
              Finished in {formatElapsed(quiz.finishedInMs)}
            </Text>
          )}

          <StepBreakdown answers={quiz.answers} accent={accent} />

          {missed.length > 0 && (
            <View testID="results-review-note" style={styles.reviewNote}>
              <Text style={styles.reviewTitle}>
                {missed.length} {missed.length === 1 ? 'question' : 'questions'}{' '}
                added to review
              </Text>
              <Text style={styles.reviewBody}>
                {missed
                  .map((record) => getQuestionById(record.questionId)?.product.name)
                  .filter(
                    (name, index, all) =>
                      name !== undefined && all.indexOf(name) === index,
                  )
                  .join(', ')}{' '}
                — back tomorrow, then in four days, then in ten.
              </Text>
            </View>
          )}

          {newBadges.length > 0 && (
            <View testID="results-badges" style={styles.badges}>
              {newBadges.map((badge) => (
                <View
                  key={badge.id}
                  style={[styles.badge, { backgroundColor: soft }]}
                >
                  <Text style={[styles.badgeGlyph, { color: accent }]}>
                    {badge.glyph}
                  </Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.actions}>
          {!isReview && (
            <Button
              testID="results-retry"
              label="Retake with different questions"
              variant="outline"
              onPress={retry}
              style={styles.button}
            />
          )}
          <Button
            testID="results-back"
            label={
              isExam
                ? 'Back to exams'
                : isReview
                  ? 'Back to review'
                  : `Back to ${product?.name ?? 'products'}`
            }
            onPress={() => {
              if (isExam) {
                goToExam();
                return;
              }
              if (isReview || product === undefined) {
                goToTab('review');
                return;
              }
              goToProduct(product.id);
            }}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  ringValue: {
    ...typography.label,
    fontSize: 14,
    color: colors.text.primary,
  },
  masteryText: {
    flex: 1,
  },
  masteryTitle: {
    ...typography.label,
    fontSize: 13.5,
    color: colors.text.primary,
    marginBottom: 4,
  },
  masteryNote: {
    ...typography.labelSmall,
    color: colors.text.muted,
  },
  time: {
    ...typography.labelSmall,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  reviewNote: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md + 2,
    marginTop: spacing.lg,
  },
  reviewTitle: {
    ...typography.label,
    fontSize: 13,
    color: colors.text.primary,
    marginBottom: 4,
  },
  reviewBody: {
    ...typography.labelSmall,
    color: colors.text.muted,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badgeGlyph: {
    ...typography.label,
    fontSize: 13,
  },
  badgeName: {
    ...typography.labelSmall,
    color: colors.text.primary,
  },
  actions: {
    marginTop: spacing.xl,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    marginBottom: 10,
  },
});
