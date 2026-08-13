import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import { getProductById, TOTAL_PRODUCTS } from '../../src/data/products';
import {
  isBooleanQuestion,
  isChoiceQuestion,
  type Question,
} from '../../src/data/types';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import type { AppStore } from '../../src/store';
import { startQuiz } from '../../src/store/slices/quizSlice';
import { renderWithStore } from '../helpers/renderWithStore';

const irs = getProductById('irs')!;

/** Counts come from the catalogue, never from literals. */
const LESSON_STEPS = irs.lessons.length;

/**
 * How many questions one sitting holds: the session-size setting, capped by
 * the bank, which is deliberately larger than any single paper.
 */
function paperSize(store: AppStore): number {
  const { sessionSize } = store.getState().settings.settings;
  return Math.min(sessionSize, irs.quiz.length);
}

/**
 * The question on screen.
 *
 * Read from the store rather than assumed: the paper is drawn at random from
 * the bank, so neither which questions appear nor whether the first one is
 * true/false or multiple choice is knowable in advance.
 */
function currentQuestion(store: AppStore): Question {
  const { questions, currentIndex } = store.getState().quiz;
  return questions[currentIndex];
}

function drawnIds(store: AppStore): string[] {
  return store.getState().quiz.questions.map((question) => question.id);
}

/** Answers the question on screen with the control its kind renders. */
async function answerCurrent(store: AppStore, correctly: boolean) {
  const question = currentQuestion(store);

  if (isChoiceQuestion(question)) {
    const index = correctly
      ? question.correctIndex
      : (question.correctIndex + 1) % question.options.length;
    await fireEvent.press(screen.getByTestId(`quiz-option-${index}`));
  } else {
    const said = correctly ? question.correctAnswer : !question.correctAnswer;
    await fireEvent.press(
      screen.getByTestId(said ? 'quiz-answer-true' : 'quiz-answer-false'),
    );
  }

  await fireEvent.press(screen.getByTestId('quiz-advance'));
}

/** Answers whatever is left of the paper correctly, landing on the results. */
async function finishPaperCorrectly(store: AppStore) {
  const { questions, currentIndex } = store.getState().quiz;
  for (let index = currentIndex; index < questions.length; index += 1) {
    await answerCurrent(store, true);
  }
}

async function walkLessonToEnd() {
  for (let step = 1; step < LESSON_STEPS; step += 1) {
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
  }
}

/** Home → category → product → lesson → quiz, the way a user reaches it. */
async function openQuizThroughLesson(categoryId: string, productId: string) {
  await fireEvent.press(screen.getByTestId(`category-card-${categoryId}`));
  await fireEvent.press(screen.getByTestId(`product-row-${productId}`));
  await fireEvent.press(screen.getByTestId('product-start-lesson'));
  await walkLessonToEnd();
  await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
}

/**
 * Replaces the drawn paper with a single chosen question. A test about one
 * kind of answer control seeds the kind it means to exercise, because the real
 * draw could hand it either.
 */
async function seedPaper(store: AppStore, question: Question) {
  await act(async () => {
    store.dispatch(
      startQuiz({
        questions: [question],
        mode: 'product',
        productId: irs.id,
        startedAt: Date.now(),
      }),
    );
  });
}

/**
 * Lets the results screen's mastery ring finish its sweep inside `act`.
 * Without it the animation's next frame lands after the test has ended and
 * React warns about an update outside `act`.
 */
async function settleRing() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  });
}

/** Ids of the product rows currently rendered, in order. */
function productRowIds(): string[] {
  return screen
    .queryAllByTestId(/^product-row-/)
    .map((row) => String(row.props.testID).replace('product-row-', ''));
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('Home → category → product → lesson → quiz → results', () => {
  it('walks the whole journey and records mastery for the product', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    // Home
    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(screen.getByText(`${TOTAL_PRODUCTS} products to learn`)).toBeTruthy();
    expect(screen.getByTestId('tab-bar')).toBeTruthy();

    // Home → category
    await fireEvent.press(screen.getByTestId('category-card-ir'));
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByText('Interest Rate')).toBeTruthy();

    // Category → product page. A product row no longer drops straight into the
    // lesson; the page between them is where the reference material lives.
    await fireEvent.press(screen.getByTestId('product-row-irs'));
    expect(screen.getByTestId('product-screen')).toBeTruthy();
    expect(screen.getByText(irs.name)).toBeTruthy();
    expect(screen.getByTestId('tab-bar')).toBeTruthy();

    // Product → lesson
    await fireEvent.press(screen.getByTestId('product-start-lesson'));
    expect(screen.getByTestId('lesson-screen')).toBeTruthy();
    expect(screen.getByText(`STEP 1 OF ${LESSON_STEPS}`)).toBeTruthy();
    expect(screen.getByTestId('lesson-back-step')).toBeDisabled();
    expect(screen.queryByTestId('tab-bar')).toBeNull();

    for (let step = 2; step <= LESSON_STEPS; step += 1) {
      await fireEvent.press(screen.getByTestId('lesson-next-step'));
      expect(screen.getByText(`STEP ${step} OF ${LESSON_STEPS}`)).toBeTruthy();
    }
    expect(screen.getByTestId('lesson-back-step')).not.toBeDisabled();

    // Lesson → quiz. The paper is a draw from the bank, not the whole bank.
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();
    expect(screen.queryByTestId('tab-bar')).toBeNull();

    const total = paperSize(store);
    expect(total).toBeLessThan(irs.quiz.length);
    expect(drawnIds(store)).toHaveLength(total);

    for (let index = 0; index < total; index += 1) {
      expect(screen.getByText(`Question ${index + 1} of ${total}`)).toBeTruthy();
      await answerCurrent(store, true);
    }

    // Results
    expect(screen.getByTestId('results-screen')).toBeTruthy();
    expect(screen.getByText('Perfect score')).toBeTruthy();
    expect(
      screen.getByText(`You scored ${total}/${total} on ${irs.name}`),
    ).toBeTruthy();
    expect(screen.queryByTestId('tab-bar')).toBeNull();
    await settleRing();

    // Mastery moves 35% of the way toward the score rather than replacing it,
    // so even a flawless first sitting lands well short of mastered.
    await waitFor(() => {
      expect(store.getState().progress.byProduct[irs.id]).toEqual({
        mastery: 35,
        attempts: 1,
        bestScorePct: 100,
        lastStudiedOn: expect.any(String),
      });
    });
    expect(screen.getByTestId('results-mastery')).toBeTruthy();

    // Every question answered is folded into the history that weights the
    // next paper.
    const history = store.getState().progress.questionHistory;
    expect(Object.keys(history)).toHaveLength(total);
    expect(Object.values(history).every((stat) => stat.right === 1)).toBe(true);

    // Results → product page, with the tab bar back
    await fireEvent.press(screen.getByTestId('results-back'));
    expect(screen.getByTestId('product-screen')).toBeTruthy();
    expect(screen.getByTestId('tab-bar')).toBeTruthy();
    expect(screen.getByTestId('product-stats')).toHaveTextContent(
      /1 attempt · best 100%/,
    );

    // …and the category list shows the ring rather than a completed tick,
    // because 35% is not mastery.
    await fireEvent.press(screen.getByTestId('product-back'));
    expect(screen.getByTestId('product-ring-irs')).toBeTruthy();
    expect(screen.queryByTestId('product-done-irs')).toBeNull();
    await settleRing();
  });

  it('scores a partly-wrong run and queues the missed question', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openQuizThroughLesson('ir', irs.id);

    const total = paperSize(store);
    const missed = currentQuestion(store).id;
    await answerCurrent(store, false);
    await finishPaperCorrectly(store);
    await settleRing();

    expect(screen.getByText('Quiz complete')).toBeTruthy();
    expect(
      screen.getByText(`You scored ${total - 1}/${total} on ${irs.name}`),
    ).toBeTruthy();
    expect(screen.getByTestId('results-review-note')).toBeTruthy();

    const scorePct = Math.round(((total - 1) / total) * 100);
    await waitFor(() => {
      const progress = store.getState().progress.byProduct[irs.id];
      expect(progress.bestScorePct).toBe(scorePct);
      expect(progress.attempts).toBe(1);
    });

    // Only mistakes enter the review queue.
    expect(store.getState().review.queue.map((item) => item.id)).toEqual([missed]);
  });
});

describe('Answering', () => {
  it('answers a multiple-choice question by tapping an option', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openQuizThroughLesson('ir', irs.id);

    const question = irs.quiz.find(isChoiceQuestion)!;
    await seedPaper(store, question);

    expect(screen.getByTestId('quiz-options')).toBeTruthy();
    // Multiple choice is answered from the options, so the true/false pair is
    // not rendered at all.
    expect(screen.queryByTestId('quiz-answer-true')).toBeNull();

    const wrong = (question.correctIndex + 1) % question.options.length;
    await fireEvent.press(screen.getByTestId(`quiz-option-${wrong}`));

    expect(store.getState().quiz.answers).toEqual([
      {
        questionId: question.id,
        answer: wrong,
        correct: false,
        step: question.step,
      },
    ]);
    expect(screen.getByTestId('quiz-feedback')).toHaveTextContent(/Not quite/);
    expect(screen.getByTestId('quiz-feedback-answer')).toHaveTextContent(
      `The answer was: ${question.options[question.correctIndex]}`,
    );

    // Answering locks every option, so a second tap cannot re-score it.
    for (let index = 0; index < question.options.length; index += 1) {
      expect(screen.getByTestId(`quiz-option-${index}`)).toBeDisabled();
    }
    await fireEvent.press(screen.getByTestId(`quiz-option-${wrong}`));
    expect(store.getState().quiz.answers).toHaveLength(1);

    await fireEvent.press(screen.getByTestId('quiz-advance'));
    expect(screen.getByTestId('results-screen')).toBeTruthy();
    expect(screen.getByText('You scored 0/1 on Interest Rate Swap')).toBeTruthy();
    await settleRing();
  });

  it('answers a true/false question with the True and False buttons', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openQuizThroughLesson('ir', irs.id);

    const question = irs.quiz.find(isBooleanQuestion)!;
    await seedPaper(store, question);

    expect(screen.queryByTestId('quiz-options')).toBeNull();
    await fireEvent.press(
      screen.getByTestId(
        question.correctAnswer ? 'quiz-answer-true' : 'quiz-answer-false',
      ),
    );

    expect(store.getState().quiz.score).toBe(1);
    expect(screen.getByTestId('quiz-feedback')).toHaveTextContent(/Correct/);
    // The answer controls are swapped out for the advance button, which is
    // what locks the answer in.
    expect(screen.queryByTestId('quiz-answer-true')).toBeNull();
    expect(screen.queryByTestId('quiz-answer-false')).toBeNull();

    await fireEvent.press(screen.getByTestId('quiz-advance'));
    expect(screen.getByText('Perfect score')).toBeTruthy();
    expect(screen.getByText('You scored 1/1 on Interest Rate Swap')).toBeTruthy();
    await settleRing();
  });
});

describe('Retaking a quiz', () => {
  it('draws a different paper each time it is retaken', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openQuizThroughLesson('ir', irs.id);

    const papers = [drawnIds(store)];
    for (let retake = 0; retake < 2; retake += 1) {
      await finishPaperCorrectly(store);
      await fireEvent.press(screen.getByTestId('results-retry'));
      expect(screen.getByTestId('quiz-screen')).toBeTruthy();
      papers.push(drawnIds(store));
    }

    const bank = irs.quiz.map((question) => question.id);
    for (const paper of papers) {
      expect(paper).toHaveLength(paperSize(store));
      expect(new Set(paper).size).toBe(paper.length);
      expect(paper.every((id) => bank.includes(id))).toBe(true);
    }

    // The draw is random, so "this retake differs" is not a safe assertion —
    // a repeat is unlikely but possible. Two retakes both reproducing the
    // first selection is not, so the suite asserts that instead of a single
    // comparison that would flake.
    const selections = papers.map((paper) => [...paper].sort().join(','));
    expect(selections.slice(1).some((ids) => ids !== selections[0])).toBe(true);

    // A retake is a fresh sitting, not a continuation.
    expect(store.getState().quiz.score).toBe(0);
    expect(store.getState().quiz.answers).toEqual([]);
    expect(screen.getByText(`Question 1 of ${paperSize(store)}`)).toBeTruthy();

    // Both sittings were recorded, so mastery has moved twice.
    await waitFor(() => {
      expect(store.getState().progress.byProduct[irs.id].attempts).toBe(2);
    });
  });
});

describe('The tab bar', () => {
  it('switches between home, products, review and profile', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    expect(screen.getByTestId('home-screen')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('tab-products'));
    expect(screen.getByTestId('products-screen')).toBeTruthy();
    expect(screen.getByTestId('tab-products')).toBeSelected();

    await fireEvent.press(screen.getByTestId('tab-review'));
    expect(screen.getByTestId('review-screen')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('tab-profile'));
    expect(screen.getByTestId('profile-screen')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('tab-home'));
    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(store.getState().app.currentTab).toBe('home');
  });

  it('keeps highlighting the tab a detail screen was opened from', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    await fireEvent.press(screen.getByTestId('tab-products'));
    await fireEvent.press(screen.getByTestId(`product-row-${irs.id}`));

    expect(screen.getByTestId('product-screen')).toBeTruthy();
    expect(store.getState().app.currentTab).toBe('products');
    expect(screen.getByTestId('tab-products')).toBeSelected();
  });
});

describe('Searching the products tab', () => {
  it('filters the list to the products that match the query', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('tab-products'));

    expect(productRowIds()).toHaveLength(TOTAL_PRODUCTS);

    // The swaption is the only product that names itself in the fields the
    // search covers — name, hook, summary and key terms.
    await fireEvent.changeText(screen.getByTestId('product-search'), 'swaption');
    expect(productRowIds()).toEqual(['swaption']);
    expect(screen.queryByTestId('products-empty')).toBeNull();

    await fireEvent.changeText(screen.getByTestId('product-search'), 'zzzz');
    expect(productRowIds()).toEqual([]);
    expect(screen.getByTestId('products-empty')).toBeTruthy();

    // Clearing the box restores the full list.
    await fireEvent.changeText(screen.getByTestId('product-search'), '');
    expect(productRowIds()).toHaveLength(TOTAL_PRODUCTS);
  });

  it('opens a product found by searching a key term', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('tab-products'));

    await fireEvent.changeText(screen.getByTestId('product-search'), 'variance');
    await fireEvent.press(screen.getByTestId('product-row-varswap'));

    expect(screen.getByTestId('product-screen')).toBeTruthy();
    // The query survives the detour, so going back lands on the same results.
    expect(store.getState().app.productQuery).toBe('variance');
  });
});
