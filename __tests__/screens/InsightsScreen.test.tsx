import { fireEvent, screen } from '@testing-library/react-native';

import { products } from '../../src/data/products';
import { InsightsScreen } from '../../src/screens/Insights/InsightsScreen';
import {
  setProgress,
  setQuestionHistory,
} from '../../src/store/slices/progressSlice';
import { MASTERY_COMPLETE } from '../../src/utils/mastery';
import { MIN_CONFIDENT_SAMPLE } from '../../src/utils/insights';
import { createStore } from '../../src/store';
import { renderWithStore } from '../helpers/renderWithStore';

/**
 * The catalogue is real here rather than stubbed: the screen's whole job is to
 * summarise it, and a fake would let the labels drift from the content they
 * describe. Question ids are read off the catalogue for the same reason the
 * data tests derive their expectations from it.
 */
const firstProduct = products[0];

/** Builds a history where `count` answers land on one product, all correct. */
function historyFor(productId: string, count: number, correct: boolean) {
  const product = products.find((p) => p.id === productId);
  if (product === undefined) {
    throw new Error(`no such product: ${productId}`);
  }
  const history: Record<string, { right: number; wrong: number }> = {};
  for (const question of product.quiz.slice(0, count)) {
    history[question.id] = correct
      ? { right: 1, wrong: 0 }
      : { right: 0, wrong: 1 };
  }
  return history;
}

describe('InsightsScreen', () => {
  it('holds back rankings until there is enough to rank on', async () => {
    await renderWithStore(<InsightsScreen />);

    expect(screen.getByTestId('insights-too-early')).toBeTruthy();
    expect(
      screen.queryByTestId(`insights-category-${firstProduct.categoryId}`),
    ).toBeNull();
  });

  it('shows the breakdown once a category clears the sample floor', async () => {
    const store = createStore();
    store.dispatch(
      setQuestionHistory(historyFor(firstProduct.id, MIN_CONFIDENT_SAMPLE, true)),
    );

    await renderWithStore(<InsightsScreen />, { store });

    expect(screen.queryByTestId('insights-too-early')).toBeNull();
    expect(
      screen.getByTestId(`insights-category-${firstProduct.categoryId}`),
    ).toBeTruthy();
  });

  it('reports accuracy from the answers actually recorded', async () => {
    const store = createStore();
    // Eight answered, all wrong — a confident 0%.
    store.dispatch(
      setQuestionHistory(historyFor(firstProduct.id, MIN_CONFIDENT_SAMPLE, false)),
    );

    await renderWithStore(<InsightsScreen />, { store });

    expect(screen.getByTestId('insights-answered')).toBeTruthy();
    expect(screen.getByLabelText(`${MIN_CONFIDENT_SAMPLE} Answered`)).toBeTruthy();
    expect(screen.getByLabelText('0% Accuracy')).toBeTruthy();
  });

  it('shows an em dash rather than 0% before anything is answered', async () => {
    await renderWithStore(<InsightsScreen />);

    expect(screen.getByLabelText('— Accuracy')).toBeTruthy();
  });

  it('recommends a product one session from mastered, and opens it', async () => {
    const store = createStore();
    // 60 is above the one-session threshold and below completion.
    store.dispatch(
      setProgress({
        [firstProduct.id]: {
          mastery: 60,
          attempts: 2,
          bestScorePct: 70,
          lastStudiedOn: '2026-08-29',
        },
      }),
    );

    await renderWithStore(<InsightsScreen />, { store });

    const row = screen.getByTestId(`insights-next-${firstProduct.id}`);
    expect(row).toBeTruthy();

    await fireEvent.press(row);
    expect(store.getState().app.currentScreen).toBe('product');
    expect(store.getState().app.selectedProductId).toBe(firstProduct.id);
  });

  it('does not recommend a product already mastered', async () => {
    const store = createStore();
    store.dispatch(
      setProgress({
        [firstProduct.id]: {
          mastery: MASTERY_COMPLETE,
          attempts: 3,
          bestScorePct: 90,
          lastStudiedOn: '2026-08-29',
        },
      }),
    );

    await renderWithStore(<InsightsScreen />, { store });

    expect(screen.queryByTestId(`insights-next-${firstProduct.id}`)).toBeNull();
  });

  // The point of the confidence floor is that a thin sample is still shown —
  // hiding it would imply nothing had been answered — but is captioned so its
  // percentage cannot be read as a verdict.
  it('captions a thin sample rather than ranking it', async () => {
    const otherProduct = products.find(
      (p) => p.categoryId !== firstProduct.categoryId,
    );
    if (otherProduct === undefined) {
      throw new Error('catalogue has only one category');
    }

    const store = createStore();
    store.dispatch(
      setQuestionHistory({
        // Enough to rank.
        ...historyFor(firstProduct.id, MIN_CONFIDENT_SAMPLE, true),
        // Not enough to rank.
        ...historyFor(otherProduct.id, 2, false),
      }),
    );

    await renderWithStore(<InsightsScreen />, { store });

    const thin = screen.getByTestId(`insights-category-${otherProduct.categoryId}`);
    expect(thin.props.accessibilityLabel).toContain(
      'Too few to draw a conclusion.',
    );

    const ranked = screen.getByTestId(
      `insights-category-${firstProduct.categoryId}`,
    );
    expect(ranked.props.accessibilityLabel).not.toContain('Too few');
  });
});
