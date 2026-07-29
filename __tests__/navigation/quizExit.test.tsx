import { act, fireEvent, screen } from '@testing-library/react-native';
import { Alert, BackHandler } from 'react-native';

import { getProductById } from '../../src/data/products';
import { RootNavigator } from '../../src/navigation/RootNavigator';
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

/** Opens a quiz and answers the first question, so there is progress to lose. */
async function startAnsweredQuiz() {
  await fireEvent.press(screen.getByTestId('category-card-fx'));
  await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
  for (let step = 1; step < fxfwd.lessons.length; step += 1) {
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
  }
  await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
  await fireEvent.press(screen.getByTestId('quiz-answer-true'));
}

beforeEach(() => {
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
    await startAnsweredQuiz();

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][0]).toBe('Leave this quiz?');
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();
  });

  it('leaves and clears the quiz once confirmed', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await startAnsweredQuiz();
    await fireEvent.press(screen.getByTestId('quiz-back'));

    await pressAlertButton('Leave');

    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByText('FX')).toBeTruthy();
    expect(store.getState().quiz.isAnswered).toBe(false);
    expect(store.getState().quiz.score).toBe(0);
  });

  it('keeps the answer when the user backs out of the prompt', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await startAnsweredQuiz();
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
    await startAnsweredQuiz();

    expect(await pressBack()).toBe(true);

    expect(alert).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();

    await pressAlertButton('Leave');
    expect(screen.getByTestId('category-screen')).toBeTruthy();
  });

  it('prompts once the user has advanced past the first question', async () => {
    await renderWithStore(<RootNavigator />);
    await startAnsweredQuiz();
    await fireEvent.press(screen.getByTestId('quiz-advance'));

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).toHaveBeenCalledTimes(1);
  });

  it('does not prompt when the quiz has not been touched', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('category-card-fx'));
    await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
    for (let step = 1; step < fxfwd.lessons.length; step += 1) {
      await fireEvent.press(screen.getByTestId('lesson-next-step'));
    }
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));

    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(alert).not.toHaveBeenCalled();
    expect(screen.getByTestId('category-screen')).toBeTruthy();
  });

  it('does not prompt on the results screen', async () => {
    await renderWithStore(<RootNavigator />);
    await startAnsweredQuiz();
    for (let index = 0; index < fxfwd.quiz.length; index += 1) {
      if (index > 0) {
        await fireEvent.press(screen.getByTestId('quiz-answer-true'));
      }
      await fireEvent.press(screen.getByTestId('quiz-advance'));
    }
    expect(screen.getByTestId('results-screen')).toBeTruthy();

    expect(await pressBack()).toBe(true);

    expect(alert).not.toHaveBeenCalled();
    expect(screen.getByTestId('category-screen')).toBeTruthy();
  });
});
