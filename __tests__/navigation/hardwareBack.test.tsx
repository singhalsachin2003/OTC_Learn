import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

import { getProductById } from '../../src/data/products';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import { renderWithStore } from '../helpers/renderWithStore';

type BackPressHandler = () => boolean;

const fxfwd = getProductById('fxfwd')!;

let handlers: BackPressHandler[];
let addEventListener: jest.SpyInstance;

/**
 * The hook re-registers on every screen change, so the live handler is always
 * the last one added. Spying beats the platform mock here: it behaves the same
 * whichever back-handler mock the RN preset happens to install.
 *
 * The press is wrapped in `act` because the platform, not a rendered element,
 * is the caller here — nothing else would flush the dispatch it triggers.
 */
async function pressBack() {
  let handled = false;
  await act(async () => {
    handled = handlers[handlers.length - 1]();
  });
  return handled;
}

/** Walks an already-open lesson to its last step and starts the quiz. */
async function startQuiz(stepCount: number) {
  for (let step = 1; step < stepCount; step += 1) {
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
  }
  await fireEvent.press(screen.getByTestId('lesson-start-quiz'));
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
});

// Restore this spy specifically: `jest.restoreAllMocks()` would also tear down
// the spies the RN preset installs, leaving later renders empty.
afterEach(() => {
  addEventListener.mockRestore();
});

describe('Android hardware back button', () => {
  it('lets the OS close the app from home', async () => {
    await renderWithStore(<RootNavigator />);

    expect(await pressBack()).toBe(false);
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('goes from a category back to home', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('category-card-fx'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('goes from a lesson back to its category', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('category-card-fx'));
    await fireEvent.press(screen.getByTestId('product-row-fxfwd'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByText('FX')).toBeTruthy();
  });

  it('exits a quiz to its category, matching the on-screen control', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('category-card-fx'));
    await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
    await startQuiz(fxfwd.lessons.length);
    await fireEvent.press(screen.getByTestId('quiz-answer-true'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    // Leaving a quiz clears its state, exactly as `quiz-back` does.
    expect(store.getState().quiz.isAnswered).toBe(false);
    expect(store.getState().quiz.score).toBe(0);
  });

  it('goes from the results screen back to the category', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('category-card-fx'));
    await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
    await startQuiz(fxfwd.lessons.length);

    for (let index = 0; index < fxfwd.quiz.length; index += 1) {
      await fireEvent.press(screen.getByTestId('quiz-answer-true'));
      await fireEvent.press(screen.getByTestId('quiz-advance'));
    }
    expect(screen.getByTestId('results-screen')).toBeTruthy();

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByText('FX')).toBeTruthy();
  });

  it('removes its listener on unmount', async () => {
    const { unmount } = await renderWithStore(<RootNavigator />);

    expect(handlers).toHaveLength(1);
    await unmount();
    expect(handlers).toHaveLength(0);
  });
});
