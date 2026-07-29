import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { getCategoryById } from '../../data/categories';
import { getProductById } from '../../data/products';
import {
  useSelectedCategoryId,
  useSelectedProductId,
} from '../../hooks/useAppState';
import { useQuiz } from '../../hooks/useQuiz';
import { useQuizExit } from '../../hooks/useQuizExit';
import { colors, getCategoryColors, spacing, typography } from '../../theme';
import { formatStepLabel } from '../../utils/formatters';
import { QuizButtons } from './components/QuizButtons';
import { QuizFeedback } from './components/QuizFeedback';
import { QuizQuestion } from './components/QuizQuestion';

export function QuizScreen() {
  const productId = useSelectedProductId();
  const categoryId = useSelectedCategoryId();
  const exitQuiz = useQuizExit();
  const {
    question,
    questionIndex,
    totalQuestions,
    isAnswered,
    feedback,
    isLastQuestion,
    progress,
    answer,
    advance,
  } = useQuiz();

  const product = getProductById(productId);
  const category = getCategoryById(categoryId ?? product?.categoryId ?? null);
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

  return (
    <SafeAreaWrapper testID="quiz-screen">
      <View style={styles.body}>
        <BackButton
          label="Exit quiz"
          accessibilityLabel="Exit quiz"
          onPress={exitQuiz}
          testID="quiz-back"
        />

        <Text style={styles.counter}>{counter}</Text>
        <ProgressBar
          testID="quiz-progress"
          progress={progress}
          color={accent}
          height={6}
          style={styles.progress}
          accessibilityLabel={counter}
        />

        <QuizQuestion question={question.question}>
          {isAnswered && feedback !== null && (
            <QuizFeedback
              correct={feedback.correct}
              explanation={feedback.explanation}
            />
          )}
        </QuizQuestion>

        <QuizButtons
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
  counter: {
    ...typography.label,
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 14,
    marginBottom: spacing.sm,
  },
  progress: {
    marginBottom: spacing.xxl,
  },
});
