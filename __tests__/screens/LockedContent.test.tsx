import { act, fireEvent, screen } from '@testing-library/react-native';

/**
 * Exercised against Exotics, the first asset class sold rather than shipped.
 *
 * This file used to mock the catalogue and flip Credit to `premium`, because
 * under the inverted model nothing was paid and none of the locked paths below
 * existed. They exist now, so the fake is gone: the products, question banks
 * and deep links being locked here are the ones a subscriber actually buys.
 * `accessShippedCatalogue.test.ts` holds the other half — that the six classes
 * the app shipped free lock nothing, for anybody.
 */
const PREMIUM_CATEGORY = 'exotics';
/** The first product on the paid path — what a locked tap lands on. */
const PREMIUM_PRODUCT = 'digital';

import { categories } from '../../src/data/categories';
import { getProductById, products } from '../../src/data/products';
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
import { setReviewQueue } from '../../src/store/slices/reviewSlice';
import RevenueCatUI from 'react-native-purchases-ui';

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
  store.dispatch(
    setEntitlement({
      purchasesConfigured: true,
      hasPurchasableOffer: true,
      premium: false,
    }),
  );
  return store;
}

const presentCustomerCenter = RevenueCatUI.presentCustomerCenter as jest.Mock;

beforeEach(() => {
  resetPurchases();
  jest.clearAllMocks();
  presentCustomerCenter.mockResolvedValue(undefined);
});

describe('with no paywall in force', () => {
  /**
   * The state every shipped build is in, and the one ~21 real installs are in.
   * Nothing here may change for them.
   */
  it('locks nothing at all', async () => {
    await renderWithStore(<RootNavigator />);
    await settleRings();

    expect(screen.queryByTestId(`category-locked-${PREMIUM_CATEGORY}`)).toBeNull();

    await fireEvent.press(screen.getByTestId(`category-card-${PREMIUM_CATEGORY}`));
    await fireEvent.press(screen.getByTestId(`product-row-${PREMIUM_PRODUCT}`));
    await settleRings();

    expect(screen.getByTestId('product-start-lesson')).toBeTruthy();
    expect(screen.queryByTestId('product-locked')).toBeNull();
  });
});

describe('with the paywall in force', () => {
  it('marks the paid asset classes on the home grid, and not the free one', async () => {
    await renderWithStore(<RootNavigator />, { store: paywalled() });
    await settleRings();

    expect(screen.getByTestId(`category-locked-${PREMIUM_CATEGORY}`)).toBeTruthy();
    expect(screen.queryByTestId('category-locked-ir')).toBeNull();
  });

  /**
   * A locked category still opens. Seeing the route through an asset class is
   * the case for paying for it, and the rows say which of them are shut.
   */
  it('still opens a locked category, with its rows marked', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('category-screen')).toBeTruthy();
    expect(screen.getByTestId(`product-locked-${PREMIUM_PRODUCT}`)).toBeTruthy();
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

    expect(screen.getByTestId(`product-locked-${PREMIUM_PRODUCT}`)).toBeTruthy();
    expect(screen.queryByTestId('product-locked-irs')).toBeNull();
  });

  /**
   * The teaser is the name and the difficulty, and that is all. The lesson,
   * the bank, the worked example and the key terms are what is being sold —
   * and so, since 2026-09-08, are the hook and the summary. A one-line
   * description of a structured product is the part a reader can act on
   * without ever opening the lesson, which made giving it away a poor way to
   * sell the lesson.
   */
  it('shows a locked product page instead of its content', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    store.dispatch(navigateToProduct(PREMIUM_PRODUCT));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    const product = getProductById(PREMIUM_PRODUCT);
    expect(screen.getByTestId('product-locked')).toBeTruthy();
    expect(screen.getByText(product!.name)).toBeTruthy();
    expect(screen.queryByText(product!.hook)).toBeNull();
    expect(screen.queryByText(product!.summary)).toBeNull();
    expect(screen.queryByTestId('product-start-lesson')).toBeNull();
    expect(screen.queryByTestId('product-start-quiz')).toBeNull();
    expect(screen.queryByText('KEY TERMS')).toBeNull();
    expect(screen.queryByText('WORKED EXAMPLE')).toBeNull();
  });

  /** The same rule one level up: a locked row is a name and a lock. */
  it('gives a locked row its name without its hook', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    const product = getProductById(PREMIUM_PRODUCT);
    expect(screen.getByText(product!.name)).toBeTruthy();
    expect(screen.queryByText(product!.hook)).toBeNull();
  });

  /** And the free rows are untouched, which is the half worth checking. */
  it('leaves a free row showing its hook', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('ir'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    const product = getProductById('irs');
    expect(screen.getByText(product!.name)).toBeTruthy();
    expect(screen.getByText(product!.hook)).toBeTruthy();
  });

  /**
   * Search is the one row that carries a subtitle of its own. It says which
   * asset class the match came from, because the list is not grouped while
   * searching — that context stays, and the hook that used to follow it goes.
   */
  it('keeps the asset class but not the hook on a locked search result', async () => {
    const store = paywalled();
    store.dispatch(navigateToTab('products'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    const product = getProductById(PREMIUM_PRODUCT);
    await fireEvent.changeText(screen.getByTestId('product-search'), product!.name);

    expect(screen.getByTestId(`product-row-${PREMIUM_PRODUCT}`)).toBeTruthy();
    // Several exotics match the query, so each carries the same subtitle.
    expect(screen.getAllByText('Exotics').length).toBeGreaterThan(0);
    expect(screen.queryByText(`Exotics · ${product!.hook}`)).toBeNull();
  });

  it('opens the paywall from a locked product, and comes back to it', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    store.dispatch(navigateToProduct(PREMIUM_PRODUCT));
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
    store.dispatch(navigateToLesson(PREMIUM_PRODUCT));
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
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    store.dispatch(navigateToProduct(PREMIUM_PRODUCT));
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
      expect(getProductById(question.id.split('-')[0] ?? '')?.categoryId).not.toBe(
        PREMIUM_CATEGORY,
      );
    }
  });

  it('says which scopes are locked rather than offering an empty paper', async () => {
    const store = paywalled();
    store.dispatch(navigateToExam());
    await renderWithStore(<RootNavigator />, { store });

    expect(screen.getByText('Exotics · locked')).toBeTruthy();
    expect(screen.getByText('Interest Rate')).toBeTruthy();
  });

  it('sends a tap on a locked scope to the paywall', async () => {
    const store = paywalled();
    store.dispatch(navigateToExam());
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId(`exam-scope-${PREMIUM_CATEGORY}`));

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

describe('a review queue holding content that has since locked', () => {
  /** What a lapsed subscriber has: items from an asset class now shut. */
  function queueOf(store: AppStore, questionIds: string[]) {
    store.dispatch(
      setReviewQueue(
        questionIds.map((id) => ({
          id,
          productId: id.split('-')[0] ?? '',
          step: 0,
          dueOn: '2020-01-01',
          lapses: 1,
          updatedAt: 0,
        })),
      ),
    );
  }

  it('does not count items it could never show', async () => {
    const store = paywalled();
    queueOf(store, [`${PREMIUM_PRODUCT}-q1`, `${PREMIUM_PRODUCT}-q2`, 'irs-q1']);
    store.dispatch(navigateToTab('review'));
    await renderWithStore(<RootNavigator />, { store });

    // Only the free question is left — a badge counting the other two would
    // count down to a sitting that cannot run.
    expect(screen.getByTestId('review-due-tile')).toHaveTextContent(/^1DUE/);
  });

  it('draws a sitting from the open questions alone', async () => {
    const store = paywalled();
    queueOf(store, [`${PREMIUM_PRODUCT}-q1`, `${PREMIUM_PRODUCT}-q2`, 'irs-q1']);
    store.dispatch(navigateToTab('review'));
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId('review-start'));

    const drawn = store.getState().quiz.questions.map((q) => q.id);
    expect(drawn).toEqual(['irs-q1']);
  });

  /** Dropped from view, not from storage — access can come back. */
  it('leaves the locked items in the queue', async () => {
    const store = paywalled();
    queueOf(store, [`${PREMIUM_PRODUCT}-q1`, 'irs-q1']);
    store.dispatch(navigateToTab('review'));
    await renderWithStore(<RootNavigator />, { store });

    expect(store.getState().review.queue).toHaveLength(2);
  });
});

describe('what home suggests next', () => {
  /**
   * "Pick up where you left off" naming something that will not open is a bad
   * first screen, and it is the first thing a new install sees.
   */
  it('never suggests a product the reader cannot open', async () => {
    const store = paywalled();
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    const suggested = screen.getByTestId('resume-card');
    expect(suggested).toBeTruthy();
    await fireEvent.press(suggested);
    await settleRings();

    expect(screen.getByTestId('product-start-lesson')).toBeTruthy();
    expect(screen.queryByTestId('product-locked')).toBeNull();
  });
});

describe('the headline on a paywalled home screen', () => {
  /**
   * "42 products to learn" and "504 questions are waiting — start anywhere"
   * are both promises the app would break on the next tap.
   */
  it('counts what the reader can open, not the catalogue', async () => {
    // Derived, so adding content cannot quietly turn this into a wrong number.
    const paidIds = new Set(
      categories.filter((c) => c.premium).map((category) => category.id),
    );
    const open = products.filter((p) => !paidIds.has(p.categoryId));
    const openQuestions = open.reduce((total, p) => total + p.quiz.length, 0);
    expect(open.length).toBeLessThan(products.length);

    const store = paywalled();
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByText(`${open.length} products to learn`)).toBeTruthy();
    expect(
      screen.getByText(new RegExp(`^${openQuestions} questions are waiting`)),
    ).toBeTruthy();
  });

  it('counts the whole catalogue when nothing is locked', async () => {
    const questions = products.reduce((total, p) => total + p.quiz.length, 0);

    await renderWithStore(<RootNavigator />);
    await settleRings();

    expect(screen.getByText(`${products.length} products to learn`)).toBeTruthy();
    expect(
      screen.getByText(new RegExp(`^${questions} questions are waiting`)),
    ).toBeTruthy();
  });
});

describe('the route through a locked category', () => {
  /** "START HERE" is an invitation, and the next tap would refuse it. */
  it('does not invite the reader into a locked first step', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.queryByTestId(`category-next-${PREMIUM_PRODUCT}`)).toBeNull();
  });

  it('still marks the next step in the free asset class', async () => {
    const store = paywalled();
    store.dispatch(navigateToCategory('ir'));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('category-next-irs')).toBeTruthy();
  });
});

describe('a key set before the Play product exists', () => {
  /**
   * The order these two arrive in is not something to rely on: the key is one
   * environment variable, the product is weeks of merchant verification away.
   * Setting the key first must not shut five asset classes with no way to pay.
   */
  it('locks nothing while there is nothing on sale', async () => {
    const store = createStore();
    initPurchases({ apiKey: 'goog_test' });
    store.dispatch(
      setEntitlement({
        purchasesConfigured: true,
        hasPurchasableOffer: false,
        premium: false,
      }),
    );
    store.dispatch(navigateToCategory(PREMIUM_CATEGORY));
    store.dispatch(navigateToProduct(PREMIUM_PRODUCT));
    await renderWithStore(<RootNavigator />, { store });
    await settleRings();

    expect(screen.getByTestId('product-start-lesson')).toBeTruthy();
    expect(screen.queryByTestId('product-locked')).toBeNull();
  });
});

describe('the Subscription row for someone who holds one', () => {
  function subscriber(): AppStore {
    const store = createStore();
    initPurchases({ apiKey: 'goog_test' });
    store.dispatch(
      setEntitlement({
        purchasesConfigured: true,
        hasPurchasableOffer: true,
        premium: true,
      }),
    );
    store.dispatch(navigateToTab('profile'));
    return store;
  }

  /**
   * A subscriber wants to manage what they have, not be sold it again. The
   * cancellation and refund wording has to track store policy, which is why
   * it is RevenueCat's sheet rather than one written here.
   */
  it('opens the Customer Center rather than the paywall', async () => {
    const store = subscriber();
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId('profile-subscription'));

    expect(presentCustomerCenter).toHaveBeenCalled();
    expect(screen.queryByTestId('paywall-screen')).toBeNull();
  });

  /** It needs configuring in the dashboard, and nothing here can check that. */
  it('falls back to the paywall rather than leaving a dead row', async () => {
    presentCustomerCenter.mockRejectedValueOnce(new Error('not configured'));
    const store = subscriber();
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId('profile-subscription'));
    await act(async () => {});

    expect(screen.getByTestId('paywall-screen')).toBeTruthy();
  });

  it('still sends everyone else straight to the paywall', async () => {
    const store = paywalled();
    store.dispatch(navigateToTab('profile'));
    await renderWithStore(<RootNavigator />, { store });

    await fireEvent.press(screen.getByTestId('profile-subscription'));

    expect(presentCustomerCenter).not.toHaveBeenCalled();
    expect(screen.getByTestId('paywall-screen')).toBeTruthy();
  });
});
