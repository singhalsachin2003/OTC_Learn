import { StyleSheet, View } from 'react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { getCategoryById } from '../../data/categories';
import { getProductById } from '../../data/products';
import {
  useAppDispatch,
  useAppSelector,
  useSelectedCategoryId,
  useSelectedProductId,
} from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { navigateToQuiz } from '../../store/slices/appSlice';
import { resetQuiz } from '../../store/slices/quizSlice';
import { getCategoryColors, spacing } from '../../theme';
import { formatScore } from '../../utils/formatters';
import { ResultsCard } from './components/ResultsCard';

export function QuizResults() {
  const dispatch = useAppDispatch();
  const { goToCategory } = useNavigation();
  const productId = useSelectedProductId();
  const categoryId = useSelectedCategoryId();
  const score = useAppSelector((state) => state.quiz.score);

  const product = getProductById(productId);
  const category = getCategoryById(categoryId ?? product?.categoryId ?? null);
  const { accent, soft } = getCategoryColors(category?.id ?? '');

  const total = product?.quiz.length ?? 0;
  const perfect = total > 0 && score === total;
  const categoryName = category?.name ?? 'Home';

  // Completion was already recorded when the quiz finished, so a retry only
  // clears the score — the product stays marked complete.
  const retry = () => {
    dispatch(resetQuiz());
    dispatch(navigateToQuiz());
  };

  return (
    <SafeAreaWrapper testID="results-screen">
      <View style={styles.body}>
        <ResultsCard
          perfect={perfect}
          accent={accent}
          accentSoft={soft}
          title={perfect ? 'Perfect score!' : 'Quiz complete'}
          subtitle={`You scored ${formatScore(score, total)} on ${
            product?.name ?? 'this product'
          }`}
        />

        <Button
          testID="results-retry"
          label="Retry quiz"
          variant="outline"
          onPress={retry}
          style={styles.button}
        />
        <Button
          testID="results-back"
          label={`Back to ${categoryName}`}
          onPress={() => goToCategory(category?.id ?? '')}
          style={styles.button}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    marginBottom: 10,
  },
});
