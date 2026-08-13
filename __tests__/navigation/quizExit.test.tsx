import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { Alert, BackHandler } from 'react-native';

import { getProductById } from '../../src/data/products';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import { createStore, type AppStore } from '../../src/store';
import {
  navigateToCategory,
  navigateToQuiz,
} from '../../src/store/slices/appSlice';
import { startQuiz } from '../../src/store/slices/quizSlice';
import { renderWithStore } from '../helpers/renderWithStore';

type BackPressHandler = () => boolean;
type AlertButton = { text?: string; onPress?: () => void };

const fxfwd = getProductById('fxfwd')!;

let handlers: BackPressHandler[];
let addEventListener: jest.SpyInstance;
let alert: jest.SpyInstance;

async function pressBack() {
  let handled = false;
  await act(async () => {
    handled = handlers[handlers.length - 1]();
  });
  return handled;
}

/** Taps a button on the most recent Alert, as the OS dialog would. */
async function pressAlertButton(text: string) {
  const buttons = alert.mock.calls[alert.mock.calls.length - 1][2] as
    AlertButton[] | undefined;
  const button = buttons?.find((b) => b.text === text);
  if (button === undefined) {
    throw new Error(`No "${text}" button on the alert`);
  }
  await act(async () => {
    button.onPress?.();
  });
}

/**
 * Lets a mastery ring finish its sweep inside `act`. Without it the animation's
 * next frame lands mid-test and React warns about an update outside `act`.
 */
async function settleRings() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  });
}

/** Answers whichever kind of question is on screen. */
async function answerCurrentQuestion() {
  const trueButton = screen.queryByTestId('quiz-answer-true');
  if (trueButton === null) {
    await fireEvent.press(screen.getByTestId('quiz-option-0'));
    return;
  }
  await fireEvent.press(trueButton);
}

/** Opens a product quiz from the category list, without answering anything. */
async function openProductQuiz() {
  await fireEvent.press(screen.getByTestId('category-card-fx'));
  await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
  await fireEvent.press(screen.getByTestId('product-start-quiz'));
}

/**
 * A review sitting, staged in the store rather than by working the queue up
 * through several quizzes — the queue's own behaviour is covered elsewhere,
 * and what matters here is only that the quiz is in review mode. The category
 * is selected first, so the exit has a plausible wrong answer to give.
 */
async function openReviewQuiz(store: AppStore) {
  store.dispatch(navigateToCategory('fx'));
  store.dispatch(
    startQuiz({
      questions: fxfwd.quiz.slice(0, 2),
      mode: 'review',
      productId: null,
      startedAt: Date.now(),
    }),
  );
  store.dispatch(navigateToQuiz());
  return renderWithStore(<RootNavigator />, { store });
}

beforeEach(async () => {
  await AsyncStorage.clear();

  handlers = [];
  addEventListener = jest
    .spyOn(BackHandler, 'addEventListener')
    .mockImplementation((_event, handler) => {
      handlers.push(handler as BackPressHandler);
      return {
        remove: () => {
          handlers = handlers.filter((h) => h !== handler);
        },
      };
    });
  alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  addEventListener.mockRestore();
  alert.mockRestore();
});

describe('leaving a part-finished quiz', () => {
  it('asks before discarding answers, and stays put until told otherwise', async () => {
    await renderWithStore(<RootNavigator />);
    await openProductQuiz();
    await answerCurrentQuestion();

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][0]).toBe('Leave this quiz?');
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();
  });

  it('leaves and clears the quiz once confirmed', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProductQuiz();
    await answerCurrentQuestion();
    await fireEvent.press(screen.getByTestId('quiz-back'));

    await pressAlertButton('Leave');

    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(store.getState().app.selectedCategoryId).toBe('fx');
    expect(store.getState().quiz.isAnswered).toBe(false);
    expect(store.getState().quiz.score).toBe(0);
  });

  it('keeps the answer when the user backs out of the prompt', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProductQuiz();
    await answerCurrentQuestion();
    const scoreBefore = store.getState().quiz.score;

    await fireEvent.press(screen.getByTestId('quiz-back'));
    // "Keep going" carries no onPress — dismissing the dialog is the whole
    // behaviour, so nothing should have changed.

    expect(screen.getByTestId('quiz-screen')).toBeTruthy();
    expect(store.getState().quiz.isAnswered).toBe(true);
    expect(store.getState().quiz.score).toBe(scoreBefore);
  });

  it('prompts on the hardware back button too', async () => {
    await renderWithStore(<RootNavigator />);
    await openProductQuiz();
    await answerCurrentQuestion();

    expect(await pressBack()).toBe(true);

    expect(alert).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();

    await pressAlertButton('Leave');
    expect(screen.getByTestId('category-screen')).toBeTruthy();
  });

  // Answers already banked count as progress even though the question now on
  // screen has not been touched.
  it('prompts once the user has advanced past the first question', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProductQuiz();
    await answerCurrentQuestion();
    await fireEvent.press(screen.getByTestId('quiz-advance'));
    expect(store.getState().quiz.isAnswered).toBe(false);

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).toHaveBeenCalledTimes(1);
  });

  it('does not prompt when the quiz has not been touched', async () => {
    await renderWithStore(<RootNavigator />);
    await openProductQuiz();

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).not.toHaveBeenCalled();
    expect(screen.getByTestId('category-screen')).toBeTruthy();
  });

  it('does not prompt from the results screen, where nothing is at stake', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProductQuiz();
    const total = store.getState().quiz.questions.length;
    for (let index = 0; index < total; index += 1) {
      await answerCurrentQuestion();
      await fireEvent.press(screen.getByTestId('quiz-advance'));
    }
    expect(screen.getByTestId('results-screen')).toBeTruthy();
    await settleRings();

    expect(await pressBack()).toBe(true);

    expect(alert).not.toHaveBeenCalled();
    expect(screen.getByTestId('product-screen')).toBeTruthy();
  });
});

describe('leaving a review sitting', () => {
  it('exits to the review tab rather than to a category', async () => {
    const store = createStore();
    await openReviewQuiz(store);

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).not.toHaveBeenCalled();
    expect(screen.getByTestId('review-screen')).toBeTruthy();
    expect(store.getState().app.currentTab).toBe('review');
  });

  // A review spans several products, so the category the user happened to have
  // open is not where the sitting came from.
  it('still exits to the review tab once answers exist', async () => {
    const store = createStore();
    await openReviewQuiz(store);
    await answerCurrentQuestion();

    await fireEvent.press(screen.getByTestId('quiz-back'));
    expect(alert).toHaveBeenCalledTimes(1);
    await pressAlertButton('Leave');

    expect(screen.getByTestId('review-screen')).toBeTruthy();
  });

  it('exits to the review tab on the hardware back button too', async () => {
    const store = createStore();
    await openReviewQuiz(store);

    expect(await pressBack()).toBe(true);

    expect(screen.getByTestId('review-screen')).toBeTruthy();
  });
});
