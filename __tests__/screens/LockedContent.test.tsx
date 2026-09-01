import { act, fireEvent, screen } from '@testing-library/react-native';

import { getProductById } from '../../src/data/products';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import { createStore, type AppStore } from '../../src/store';
import {
  setEntitlement,
  setGrandfathered,
} from '../../src/store/slices/accessSlice';
import {
  navigateToCategory,
  navigateToExam,
  navigateToLesson,
  navigateToProduct,
  navigateToTab,
} from '../../src/store/slices/appSlice';
import { initPurchases, resetPurchases } from '../../src/utils/purchases';
import { renderWithStore } from '../helpers/renderWithStore';

/** Lets a mastery ring finish its sweep inside `act`. */
async function settleRings() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  });
}

/** A build that sells, and a user who has not bought — the only locked state. */
function paywalled(): AppStore {
  const store = createStore();
  initPurchases({ apiKey: 'goog_test' });
  store.dispatch(setEntitlement({ purchasesConfigured: true, premium: false }));
  return store;
}

beforeEach(() => {
  resetPurchases();
});

describe('with no paywall in force', () => {
  /**
   * The state every shipped build is in, and the one ~21 real installs are in.
   * Nothing here may change for them.
   */
  it('locks nothing at all', async () => {
    await renderWithStore(<RootNavigator />);
    await settleRings();

    expect(screen.queryByTestId('category-locked-credit')).toBeNull();

    await fireEvent.press(screen.getByTestId('category-card-credit'));
    await fireEvent.press(screen.getByTestId('product-row-cds'));
    await settleRings();

    expect(screen.getByTestId('product-start-lesson')).toBeTruthy();
    expect(screen.queryByTestId('product-locked')).toBeNull();
  });
});

describe('with the paywall in force', () => {
  it('marks the paid asset classes on the home grid, and not the free one', async () => {
    await renderWithStore(<RootNavigator />, { store: paywalled() });
    await settleRings();

    expect(screen.getByTestId('category-locked-credit')).toBeTruthy();
    expect(screen.queryByTestId('category-locked-ir')).toBeNull();
  });

  /**
   * A locked category still opens. Seeing the route through an asset class is
   * the case for paying for it, and the rows say which of them are shut.
   */
  it('still opens a locked category, with its rows marked', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('credit'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByTestId('product-locked-cds')).toBeTruthy();
  });

  it('leaves the free asset class alone', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('ir'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.queryByTestId('product-locked-irs')).toBeNull();
  });

  it('marks locked rows in the products list too', async () => {
    const store = paywalled();
    store.dispatch(navigateToTab('products'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('product-locked-cds')).toBeTruthy();
    expect(screen.queryByTestId('product-locked-irs')).toBeNull();
  });

  /**
   * The teaser is the name, difficulty and summary — enough to judge whether
   * it is worth paying for. The lesson, the bank, the worked example and the
   * key terms are what is being sold, so none of them renders.
   */
  it('shows a locked product page instead of its content', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('credit'));
    store.dispatch(navigateToProduct('cds'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('product-locked')).toBeTruthy();
    expect(screen.queryByTestId('product-start-lesson')).toBeNull();
    expect(screen.queryByTestId('product-start-quiz')).toBeNull();
    expect(screen.queryByText('KEY TERMS')).toBeNull();
    expect(screen.queryByText('WORKED EXAMPLE')).toBeNull();
  });

  it('opens the paywall from a locked product, and comes back to it', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('credit'));
    store.dispatch(navigateToProduct('cds'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    await fireEvent.press(screen.getByTestId('product-unlock'));
    expect(screen.getByTestId('paywall-screen')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('paywall-back'));
    await settleRings();
    expect(screen.getByTestId('product-screen')).toBeTruthy();
  });

  /**
   * `otclearn://lesson/<id>` lands here without passing the product page, so
   * the lesson has to ask the same question the page asks.
   */
  it('refuses a lesson reached without passing the product page', async () => {
    const store = paywalled();
    store.dispatch(navigateToLesson('cds'));
    await renderWithStore(<RootNavigator />, { store });

    expect(screen.getByTestId('lesson-locked')).toBeTruthy();
    expect(screen.queryByTestId('lesson-next')).toBeNull();
  });

  it('opens the free asset class as it always did', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('ir'));
    store.dispatch(navigateToProduct('irs'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('product-start-lesson')).toBeTruthy();
    expect(screen.queryByTestId('product-locked')).toBeNull();
  });
});

describe('for an install that predates the paywall', () => {
  /** The guard that matters most — nothing locks, ever, for these users. */
  it('locks nothing, even on a build that sells', async () => {
    const store = paywalled();
    store.dispatch(setGrandfathered(true));
    store.dispatch(navigateToCategory('credit'));
    store.dispatch(navigateToProduct('cds'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('product-start-lesson')).toBeTruthy();
    expect(screen.queryByTestId('product-locked')).toBeNull();
  });
});

describe('exams under a paywall', () => {
  /**
   * The leak that mattered most. An exam over "everything" draws round-robin
   * across the whole catalogue, so without this it would have handed the paid
   * question banks over one paper at a time.
   */
  it('draws an "everything" paper only from what is open', async () => {
    const store = paywalled();
    store.dispatch(navigateToExam());
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId('exam-length-40'));
    await fireEvent.press(screen.getByTestId('exam-begin'));

    const drawn = store.getState().quiz.questions;
    expect(drawn.length).toBeGreaterThan(0);
    for (const question of drawn) {
      // Every question id is prefixed with its product's id.
      expect(getProductById(question.id.split('-')[0] ?? '')?.categoryId).toBe(
        'ir',
      );
    }
  });

  it('says which scopes are locked rather than offering an empty paper', async () => {
    const store = paywalled();
    store.dispatch(navigateToExam());
    await renderWithStore(<RootNavigator />, { store });

    expect(screen.getByText('Credit · locked')).toBeTruthy();
    expect(screen.getByText('Interest Rate')).toBeTruthy();
  });

  it('sends a tap on a locked scope to the paywall', async () => {
    const store = paywalled();
    store.dispatch(navigateToExam());
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId('exam-scope-credit'));

    expect(screen.getByTestId('paywall-screen')).toBeTruthy();
  });
});

describe('the subscription row in Profile', () => {
  it('reaches the paywall on a build with nothing to sell', async () => {
    const store = createStore();
    store.dispatch(navigateToTab('profile'));
    await renderWithStore(<RootNavigator />, { store });

    expect(screen.getByTestId('profile-subscription')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('profile-subscription'));

    expect(screen.getByTestId('paywall-screen')).toBeTruthy();
  });

  it('names the state the reader is actually in', async () => {
    const store = paywalled();
    store.dispatch(navigateToTab('profile'));
    await renderWithStore(<RootNavigator />, { store });

    expect(screen.getByTestId('profile-subscription')).toHaveTextContent(
      /Free plan/,
    );
  });
});
