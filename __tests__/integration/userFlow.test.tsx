import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { getProductById } from '../../src/data/products';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import { createStore } from '../../src/store';
import { loadProgress } from '../../src/store/thunks/progressThunks';
import { renderWithStore } from '../helpers/renderWithStore';

const irs = getProductById('irs')!;

/** Answers the current question correctly and advances. */
async function answerCorrectly(questionIndex: number) {
  const question = irs.quiz[questionIndex];
  await fireEvent.press(
    screen.getByTestId(
      question.correctAnswer ? 'quiz-answer-true' : 'quiz-answer-false',
    ),
  );
  await fireEvent.press(screen.getByTestId('quiz-advance'));
}

describe('Home → Category → Lesson → Quiz → Results', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('walks the full journey and records the result', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    // Home
    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(screen.getByText('0 / 10 products')).toBeTruthy();

    // Home → Category
    await fireEvent.press(screen.getByTestId('category-card-ir'));
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByText('Interest Rate')).toBeTruthy();

    // Category → Lesson, starting at step 1
    await fireEvent.press(screen.getByTestId('product-row-irs'));
    expect(screen.getByTestId('lesson-screen')).toBeTruthy();
    expect(screen.getByText('STEP 1 OF 3')).toBeTruthy();
    expect(screen.getByTestId('lesson-back-step')).toBeDisabled();

    // Step 1 → 2 → 3
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    expect(screen.getByText('STEP 2 OF 3')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    expect(screen.getByText('STEP 3 OF 3')).toBeTruthy();
    expect(screen.getByTestId('lesson-back-step')).not.toBeDisabled();

    // Lesson → Quiz
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();
    expect(screen.getByText('Question 1 of 3')).toBeTruthy();

    await answerCorrectly(0);
    expect(screen.getByText('Question 2 of 3')).toBeTruthy();
    await answerCorrectly(1);
    expect(screen.getByText('Question 3 of 3')).toBeTruthy();
    await answerCorrectly(2);

    // Results
    expect(screen.getByTestId('results-screen')).toBeTruthy();
    expect(screen.getByText('Perfect score!')).toBeTruthy();
    expect(screen.getByText('You scored 3/3 on Interest Rate Swap')).toBeTruthy();

    await waitFor(() => {
      expect(store.getState().progress.completedProductIds).toEqual(['irs']);
    });

    // Back to the category — the product is now checked off
    await fireEvent.press(screen.getByTestId('results-back'));
    expect(screen.getByTestId('product-done-irs')).toBeTruthy();
  });

  it('shows feedback and locks the answer buttons after answering', async () => {
    await renderWithStore(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('category-card-ir'));
    await fireEvent.press(screen.getByTestId('product-row-irs'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));

    // Q1 ("the notional principal is exchanged") is false — answer true.
    await fireEvent.press(screen.getByTestId('quiz-answer-true'));

    expect(screen.getByTestId('quiz-feedback')).toHaveTextContent(/Not quite/);
    expect(screen.queryByTestId('quiz-answer-true')).toBeNull();
    expect(screen.queryByTestId('quiz-answer-false')).toBeNull();
    expect(screen.getByTestId('quiz-advance')).toBeTruthy();
  });

  it('scores a partly-wrong run without claiming a perfect score', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('category-card-ir'));
    await fireEvent.press(screen.getByTestId('product-row-irs'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));

    // Deliberately miss Q1, then answer Q2 and Q3 correctly.
    await fireEvent.press(screen.getByTestId('quiz-answer-true'));
    await fireEvent.press(screen.getByTestId('quiz-advance'));
    await answerCorrectly(1);
    await answerCorrectly(2);

    expect(screen.getByText('Quiz complete')).toBeTruthy();
    expect(screen.getByText('You scored 2/3 on Interest Rate Swap')).toBeTruthy();

    // Completion is recorded regardless of score.
    await waitFor(() => {
      expect(store.getState().progress.completedProductIds).toEqual(['irs']);
    });
  });

  it('retries a quiz from the first question, keeping the product complete', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('category-card-ir'));
    await fireEvent.press(screen.getByTestId('product-row-irs'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
    await answerCorrectly(0);
    await answerCorrectly(1);
    await answerCorrectly(2);

    await waitFor(() => {
      expect(store.getState().progress.completedProductIds).toEqual(['irs']);
    });

    await fireEvent.press(screen.getByTestId('results-retry'));

    expect(screen.getByText('Question 1 of 3')).toBeTruthy();
    expect(store.getState().quiz.score).toBe(0);
    expect(store.getState().progress.completedProductIds).toEqual(['irs']);
  });

  it('restores completed products after a restart', async () => {
    const first = createStore();
    const { unmount } = await renderWithStore(<RootNavigator />, { store: first });

    await fireEvent.press(screen.getByTestId('category-card-ir'));
    await fireEvent.press(screen.getByTestId('product-row-irs'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
    await answerCorrectly(0);
    await answerCorrectly(1);
    await answerCorrectly(2);

    await waitFor(() => {
      expect(first.getState().progress.completedProductIds).toEqual(['irs']);
    });
    await unmount();

    // Fresh store, as on a cold launch, hydrating from AsyncStorage.
    const restarted = createStore();
    await restarted.dispatch(loadProgress());
    await renderWithStore(<RootNavigator />, { store: restarted });

    expect(screen.getByText('1 / 10 products')).toBeTruthy();
  });

  it('exits a quiz back to the category list', async () => {
    await renderWithStore(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('category-card-fx'));
    await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByText('FX')).toBeTruthy();
  });

  it('navigates home from a category', async () => {
    await renderWithStore(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('category-card-commodity'));
    await fireEvent.press(screen.getByTestId('category-back'));

    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });
});
