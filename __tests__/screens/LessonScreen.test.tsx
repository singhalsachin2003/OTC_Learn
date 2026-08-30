import { act, fireEvent, screen } from '@testing-library/react-native';

import { getProductById } from '../../src/data/products';
import { LessonScreen } from '../../src/screens/Lesson/LessonScreen';
import { createStore } from '../../src/store';
import { navigateToLesson } from '../../src/store/slices/appSlice';
import { renderWithStore } from '../helpers/renderWithStore';

const irs = getProductById('irs')!;

/**
 * The swipe gesture itself is not driven here: `PanResponder` derives its
 * gesture state from a touch history the test would have to fabricate, and the
 * rules it applies — claim, intent, resulting step — are pure and covered in
 * `__tests__/utils/swipe.test.ts`. What this file covers is everything the
 * buttons reach, which is the same `goToStep` the swipe ends in.
 */
async function openLesson(productId = 'irs') {
  const store = createStore();
  store.dispatch(navigateToLesson(productId));
  await renderWithStore(<LessonScreen />, { store });
  return store;
}

describe('LessonScreen', () => {
  it('opens on the first step of the selected product', async () => {
    await openLesson();

    expect(screen.getByText(irs.name)).toBeTruthy();
    expect(screen.getByText(irs.lessons[0].title)).toBeTruthy();
    // Nowhere to go back to from the first step.
    expect(screen.getByTestId('lesson-back-step')).toBeDisabled();
  });

  it('walks forward and back through every step', async () => {
    await openLesson();

    for (let step = 1; step < irs.lessons.length; step += 1) {
      await fireEvent.press(screen.getByTestId('lesson-next-step'));
      expect(screen.getByText(irs.lessons[step].title)).toBeTruthy();
    }

    // The last step swaps Next for the quiz, so there is nothing left to press.
    expect(screen.queryByTestId('lesson-next-step')).toBeNull();
    expect(screen.getByTestId('lesson-start-quiz')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('lesson-back-step'));
    expect(
      screen.getByText(irs.lessons[irs.lessons.length - 2].title),
    ).toBeTruthy();
    expect(screen.getByTestId('lesson-next-step')).toBeTruthy();
  });

  it('starts the quiz from the last step', async () => {
    const store = await openLesson();

    for (let step = 1; step < irs.lessons.length; step += 1) {
      await fireEvent.press(screen.getByTestId('lesson-next-step'));
    }
    await fireEvent.press(screen.getByTestId('lesson-start-quiz'));

    expect(store.getState().app.currentScreen).toBe('quiz');
  });

  it('returns to the product page', async () => {
    const store = await openLesson();

    await fireEvent.press(screen.getByTestId('lesson-back'));

    const state = store.getState();
    expect(state.app.currentScreen).toBe('product');
    expect(state.app.selectedProductId).toBe('irs');
  });

  /**
   * Reached by a deep link to a renamed or removed product. The back control
   * has to stay, or the screen is a dead end.
   */
  it('says so when the product cannot be resolved', async () => {
    const store = createStore();
    store.dispatch(navigateToLesson('no-such-product'));
    await renderWithStore(<LessonScreen />, { store });

    expect(screen.getByText('This lesson is unavailable.')).toBeTruthy();
    expect(screen.getByTestId('lesson-back')).toBeTruthy();
    expect(screen.queryByTestId('lesson-start-quiz')).toBeNull();
  });

  /**
   * The step index is view-local, so nothing else resets it. Driven through the
   * live component rather than a second render, which would start at step 0
   * whether the effect fired or not.
   */
  it('restarts at the first step when the product changes underneath it', async () => {
    const store = await openLesson();
    await fireEvent.press(screen.getByTestId('lesson-next-step'));
    expect(screen.getByText(irs.lessons[1].title)).toBeTruthy();

    const fxfwd = getProductById('fxfwd')!;
    await act(async () => {
      store.dispatch(navigateToLesson('fxfwd'));
    });

    expect(screen.getByText(fxfwd.lessons[0].title)).toBeTruthy();
  });
});
