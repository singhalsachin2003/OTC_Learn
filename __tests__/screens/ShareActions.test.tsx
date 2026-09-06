import { fireEvent, screen } from '@testing-library/react-native';
import { Share } from 'react-native';

import { PLAY_LISTING_URL } from '../../src/data/links';
import { getProductById } from '../../src/data/products';
import { ProductScreen } from '../../src/screens/Product/ProductScreen';
import { QuizResults } from '../../src/screens/Quiz/QuizResults';
import { createStore, type AppStore } from '../../src/store';
import { navigateToProduct } from '../../src/store/slices/appSlice';
import { startQuiz } from '../../src/store/slices/quizSlice';
import { renderWithStore } from '../helpers/renderWithStore';

const PRODUCT_ID = 'irs';

let share: jest.SpyInstance;

beforeEach(() => {
  share = jest
    .spyOn(Share, 'share')
    .mockResolvedValue({ action: 'sharedAction' } as never);
});

afterEach(() => {
  share.mockRestore();
});

/** The message the sheet was opened with. */
function sharedMessage(): string {
  return share.mock.calls[0][0].message as string;
}

function onProduct(): AppStore {
  const store = createStore();
  store.dispatch(navigateToProduct(PRODUCT_ID));
  return store;
}

describe('sharing a product', () => {
  it('sends the product, a line about it, and a link that works', async () => {
    const product = getProductById(PRODUCT_ID);
    await renderWithStore(<ProductScreen />, { store: onProduct() });

    await fireEvent.press(screen.getByTestId('product-share'));

    expect(share).toHaveBeenCalledTimes(1);
    expect(sharedMessage()).toContain(product?.name);
    expect(sharedMessage()).toContain(product?.hook);
    expect(sharedMessage()).toContain(PLAY_LISTING_URL);
  });

  // The sheet is entirely optional to the user, and a device with no share
  // target rejects the call outright.
  it('leaves the screen alone when the sheet fails', async () => {
    share.mockRejectedValue(new Error('no share targets'));
    await renderWithStore(<ProductScreen />, { store: onProduct() });

    await fireEvent.press(screen.getByTestId('product-share'));

    expect(screen.getByTestId('product-screen')).toBeTruthy();
  });
});

describe('sharing a result', () => {
  function finishedQuiz(mode: 'product' | 'review'): AppStore {
    const store = createStore();
    const product = getProductById(PRODUCT_ID);
    store.dispatch(navigateToProduct(PRODUCT_ID));
    store.dispatch(
      startQuiz({
        questions: (product?.quiz ?? []).slice(0, 4),
        mode,
        productId: mode === 'review' ? null : PRODUCT_ID,
        startedAt: Date.now(),
      }),
    );
    return store;
  }

  it('sends the score and the product it was scored on', async () => {
    await renderWithStore(<QuizResults />, { store: finishedQuiz('product') });

    await fireEvent.press(screen.getByTestId('results-share'));

    expect(sharedMessage()).toContain(getProductById(PRODUCT_ID)?.name);
    expect(sharedMessage()).toContain('0/4');
    expect(sharedMessage()).toContain(PLAY_LISTING_URL);
  });

  // A review score is spread over whichever questions fell due, so it says
  // nothing to whoever receives it.
  it('offers nothing to share after a review sitting', async () => {
    await renderWithStore(<QuizResults />, { store: finishedQuiz('review') });

    expect(screen.queryByTestId('results-share')).toBeNull();
  });
});
