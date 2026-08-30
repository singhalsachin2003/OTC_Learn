import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { SegmentedBar, segmentColors } from '../../components/ui/SegmentedBar';
import { getCategoryById } from '../../data/categories';
import { getProductById, getQuestionById } from '../../data/products';
import { isChoiceQuestion } from '../../data/types';
import {
  useSelectedCategoryId,
  useSelectedProductId,
  useSettings,
} from '../../hooks/useAppState';
import { useQuiz } from '../../hooks/useQuiz';
import { useQuizExit } from '../../hooks/useQuizExit';
import { colors, getCategoryColors, spacing, typography } from '../../theme';
import { formatStepLabel } from '../../utils/formatters';
import { ChoiceOptions } from './components/ChoiceOptions';
import { QuizButtons } from './components/QuizButtons';
import { QuizFeedback } from './components/QuizFeedback';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizTimer } from './components/QuizTimer';

export function QuizScreen() {
  const productId = useSelectedProductId();
  const categoryId = useSelectedCategoryId();
  const settings = useSettings();
  const exitQuiz = useQuizExit();
  const {
    question,
    questionIndex,
    totalQuestions,
    isAnswered,
    feedback,
    isLastQuestion,
    answers,
    mode,
    startedAt,
    timeLimitMs,
    start,
    answer,
    advance,
    expire,
  } = useQuiz();

  // Draw the paper on arrival. A quiz reached from the product page, a deep
  // link or a retake all land here with an empty session, and the draw is
  // random — so it happens once, in an effect, rather than during render.
  useEffect(() => {
    if (totalQuestions === 0 && mode === 'product' && productId !== null) {
      start(productId);
    }
    // `start` changes identity whenever question history does; re-running on
    // that would redraw the paper mid-quiz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, totalQuestions, mode]);

  const owner =
    mode === 'review' && question !== null
      ? getQuestionById(question.id)?.product
      : getProductById(productId);
  const category = getCategoryById(
    mode === 'review'
      ? (owner?.categoryId ?? null)
      : (categoryId ?? owner?.categoryId ?? null),
  );
  const { accent } = getCategoryColors(category?.id ?? '');

  if (question === null) {
    return (
      <SafeAreaWrapper testID="quiz-screen">
        <View style={styles.body}>
          <BackButton
            label="Exit quiz"
            accessibilityLabel="Exit quiz"
            onPress={exitQuiz}
            testID="quiz-back"
          />
          <Text style={styles.counter}>This quiz is unavailable.</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  const counter = `Question ${formatStepLabel(questionIndex, totalQuestions)}`;
  const selectedIndex =
    isAnswered && isChoiceQuestion(question)
      ? ((answers[answers.length - 1]?.answer as number | undefined) ?? null)
      : null;

  return (
    <SafeAreaWrapper testID="quiz-screen">
      <View style={styles.body}>
        <View style={styles.topRow}>
          <BackButton
            label="Exit quiz"
            accessibilityLabel="Exit quiz"
            onPress={exitQuiz}
            testID="quiz-back"
          />
          {/*
            An exam states a time limit on its setup screen, so it shows the
            clock whatever the user's preference — the preference governs
            whether ordinary practice is timed, not whether a stated limit is
            visible while it runs.
          */}
          {(settings.timedQuizzes || mode === 'exam') && (
            <QuizTimer
              startedAt={startedAt}
              limitMs={mode === 'exam' ? timeLimitMs : null}
              onExpire={expire}
            />
          )}
        </View>

        <View style={styles.meta}>
          <Text style={styles.counter}>{counter}</Text>
          {mode === 'review' && owner !== undefined && (
            <Text testID="quiz-review-source" style={styles.source}>
              {owner.name}
            </Text>
          )}
        </View>

        <SegmentedBar
          testID="quiz-progress"
          segments={totalQuestions}
          accessibilityLabel={counter}
          colorAt={(index) => {
            const record = answers[index];
            if (record !== undefined) {
              return record.correct
                ? segmentColors.correct
                : segmentColors.incorrect;
            }
            return index === questionIndex ? accent : segmentColors.pending;
          }}
          style={styles.progress}
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <QuizQuestion question={question.prompt}>
            {isChoiceQuestion(question) && (
              <ChoiceOptions
                options={question.options}
                isAnswered={isAnswered}
                selectedIndex={selectedIndex}
                correctIndex={question.correctIndex}
                onSelect={answer}
              />
            )}
            {isAnswered && feedback !== null && (
              <QuizFeedback
                correct={feedback.correct}
                explanation={feedback.explanation}
                correctLabel={feedback.correct ? undefined : feedback.correctLabel}
              />
            )}
          </QuizQuestion>
        </ScrollView>

        <QuizButtons
          kind={question.kind}
          isAnswered={isAnswered}
          isLastQuestion={isLastQuestion}
          onAnswer={answer}
          onAdvance={advance}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: spacing.sm,
  },
  counter: {
    ...typography.label,
    fontSize: 12,
    color: colors.text.secondary,
  },
  source: {
    ...typography.labelSmall,
    color: colors.text.tertiary,
  },
  progress: {
    marginBottom: spacing.lg,
  },
  /**
   * Top-aligned, not centred.
   *
   * Centring looked balanced on a two-line true/false question and wrong
   * everywhere else: revealing the feedback grows the card, and a centred card
   * grows in both directions, so the question the user is still reading slides
   * up the screen at the moment they most need it to hold still. Anchoring to
   * the top means the question never moves and the feedback arrives beneath it.
   */
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: spacing.lg,
  },
});
