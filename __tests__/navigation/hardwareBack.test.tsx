import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

import { getProductById } from '../../src/data/products';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import { createStore, type AppStore } from '../../src/store';
import {
  navigateToAchievements,
  navigateToGlossary,
  navigateToQuiz,
  type TabName,
} from '../../src/store/slices/appSlice';
import { startQuiz } from '../../src/store/slices/quizSlice';
import { renderWithStore } from '../helpers/renderWithStore';

type BackPressHandler = () => boolean;

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

/**
 * Lets a mastery ring finish its sweep inside `act`. Without it the animation's
 * next frame lands mid-test and React warns about an update outside `act`.
 */
async function settleRings() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  });
}

/** Walks home → category → product page, the way a user reaches a product. */
async function openProduct() {
  await fireEvent.press(screen.getByTestId('category-card-fx'));
  await fireEvent.press(screen.getByTestId('product-row-fxfwd'));
  await settleRings();
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

/** Answers the whole paper, which lands on the results screen. */
async function finishQuiz(store: AppStore) {
  const total = store.getState().quiz.questions.length;
  for (let index = 0; index < total; index += 1) {
    await answerCurrentQuestion();
    await fireEvent.press(screen.getByTestId('quiz-advance'));
  }
  await settleRings();
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

  // Back always walks toward the root rather than closing the app from a side
  // tab, so every other tab root goes home first.
  it.each<TabName>(['products', 'review', 'profile'])(
    'goes from the %s tab back to home',
    async (tab) => {
      await renderWithStore(<RootNavigator />);
      await fireEvent.press(screen.getByTestId(`tab-${tab}`));

      expect(await pressBack()).toBe(true);
      expect(screen.getByTestId('home-screen')).toBeTruthy();
    },
  );

  it('goes from a category back to home', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('category-card-fx'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('goes from a product page back to its category', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProduct();

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(store.getState().app.selectedCategoryId).toBe('fx');
  });

  // The product page sits between the category and the lesson, so back must
  // land on it rather than skipping past it to the list.
  it('goes from a lesson back to the product page', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProduct();
    await fireEvent.press(screen.getByTestId('product-start-lesson'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('product-screen')).toBeTruthy();
    expect(store.getState().app.selectedProductId).toBe('fxfwd');
  });

  it('goes from the results screen back to the product page', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProduct();
    await fireEvent.press(screen.getByTestId('product-start-quiz'));
    await finishQuiz(store);
    expect(screen.getByTestId('results-screen')).toBeTruthy();

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('product-screen')).toBeTruthy();
  });

  // An answered quiz prompts first; that path is covered in quizExit.test.tsx.
  it('exits an untouched quiz to its category, matching the on-screen control', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    await openProduct();
    await fireEvent.press(screen.getByTestId('product-start-quiz'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('category-screen')).toBeTruthy();
    // Leaving a quiz clears its state, exactly as `quiz-back` does.
    expect(store.getState().quiz.questions).toHaveLength(0);
    expect(store.getState().quiz.score).toBe(0);
  });

  it('goes from the glossary back to profile', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('tab-profile'));
    await fireEvent.press(screen.getByTestId('profile-glossary'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('profile-screen')).toBeTruthy();
  });

  it('goes from achievements back to profile', async () => {
    await renderWithStore(<RootNavigator />);
    await fireEvent.press(screen.getByTestId('tab-profile'));
    await fireEvent.press(screen.getByTestId('profile-achievements'));

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('profile-screen')).toBeTruthy();
  });

  /**
   * BUG — asserts the behaviour the screen map calls for, which the source does
   * not yet have: `useHardwareBack` sends the glossary and achievements back to
   * `tab`, not to profile (`goToTab(tab === 'profile' ? 'profile' : tab)` is an
   * identity). Reached by `otclearn://glossary` — the one entry point that does
   * not go through the profile tab — back therefore lands on home.
   *
   * `it.failing` here and below: the expectation is the intended behaviour, so
   * these turn red the moment the hook is fixed and the `.failing` comes off.
   */
  it.failing(
    'goes from a deep-linked glossary back to profile, not to the tab behind it',
    async () => {
      const { store } = await renderWithStore(<RootNavigator />);
      await act(async () => {
        store.dispatch(navigateToGlossary());
      });

      expect(await pressBack()).toBe(true);
      expect(screen.getByTestId('profile-screen')).toBeTruthy();
    },
  );

  it.failing(
    'goes from deep-linked achievements back to profile, not to the tab behind it',
    async () => {
      const { store } = await renderWithStore(<RootNavigator />);
      await act(async () => {
        store.dispatch(navigateToAchievements());
      });

      expect(await pressBack()).toBe(true);
      expect(screen.getByTestId('profile-screen')).toBeTruthy();
    },
  );

  /**
   * BUG — a review sitting carries no product, so the results screen falls
   * through to `goToCategory(categoryId ?? '')`. Started from a cold app there
   * is no category either, and back lands on a category screen reading "That
   * asset class is unavailable". The on-screen `results-back` control and
   * `useQuizExit` both return a review to its tab; this should match them.
   */
  it.failing('goes from review results back to the review tab', async () => {
    const store = createStore();
    store.dispatch(
      startQuiz({
        questions: getProductById('fxfwd')!.quiz.slice(0, 1),
        mode: 'review',
        productId: null,
        startedAt: Date.now(),
      }),
    );
    store.dispatch(navigateToQuiz());
    await renderWithStore(<RootNavigator />, { store });
    await finishQuiz(store);
    expect(screen.getByTestId('results-screen')).toBeTruthy();

    expect(await pressBack()).toBe(true);
    expect(screen.getByTestId('review-screen')).toBeTruthy();
  });

  it('removes its listener on unmount', async () => {
    const { unmount } = await renderWithStore(<RootNavigator />);

    expect(handlers).toHaveLength(1);
    await unmount();
    expect(handlers).toHaveLength(0);
  });
});
