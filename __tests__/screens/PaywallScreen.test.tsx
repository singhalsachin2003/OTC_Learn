import { fireEvent, screen } from '@testing-library/react-native';
import Purchases from 'react-native-purchases';

import { PaywallScreen } from '../../src/screens/Paywall/PaywallScreen';
import { createStore, type AppStore } from '../../src/store';
import {
  setEntitlement,
  setGrandfathered,
} from '../../src/store/slices/accessSlice';
import { initPurchases, resetPurchases } from '../../src/utils/purchases';
import { renderWithStore } from '../helpers/renderWithStore';

const getCustomerInfo = Purchases.getCustomerInfo as jest.Mock;
const getOfferings = Purchases.getOfferings as jest.Mock;
const purchasePackage = Purchases.purchasePackage as jest.Mock;
const restorePurchases = Purchases.restorePurchases as jest.Mock;

const entitled = { entitlements: { active: { premium: {} } } };
const notEntitled = { entitlements: { active: {} } };

const bothTerms = {
  current: {
    availablePackages: [
      {
        identifier: '$rc_monthly',
        packageType: 'MONTHLY',
        product: { priceString: '₹399.00', price: 399, currencyCode: 'INR' },
      },
      {
        identifier: '$rc_annual',
        packageType: 'ANNUAL',
        product: { priceString: '₹2,999.00', price: 2999, currencyCode: 'INR' },
      },
    ],
  },
};

/** A build that can transact, with a user who has not paid — the sales case. */
function sellingTo(store: AppStore): AppStore {
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

beforeEach(() => {
  resetPurchases();
  jest.clearAllMocks();
  getCustomerInfo.mockResolvedValue(notEntitled);
  getOfferings.mockResolvedValue({ current: null });
  restorePurchases.mockResolvedValue(notEntitled);
});

describe('PaywallScreen on a build that cannot transact', () => {
  /**
   * The state every build has shipped in so far, and one this screen is
   * reachable in from Profile. Nothing is locked on such a build, so the
   * honest thing to say is that there is nothing to buy — not to offer a
   * button that cannot work.
   */
  it('says there is nothing to buy, and offers nothing', async () => {
    await renderWithStore(<PaywallScreen />);

    expect(screen.getByTestId('paywall-already-open')).toBeTruthy();
    expect(screen.getByText(/There is nothing to buy/)).toBeTruthy();
    expect(screen.queryByTestId('paywall-subscribe')).toBeNull();
  });

  /**
   * Restore would report finding nothing, every time, on a build with no key.
   * That reads as "your purchase is gone" rather than "this build cannot sell
   * anything".
   */
  it('does not offer to restore a purchase it could never find', async () => {
    await renderWithStore(<PaywallScreen />);

    expect(screen.queryByTestId('paywall-restore')).toBeNull();
  });
});

describe('PaywallScreen when the store has no offering yet', () => {
  /**
   * Key in place, subscription not yet published in the Play Console. The
   * third guard makes this a not-paywalled state — locking content that
   * cannot be bought is the one outcome nobody would want — so the screen
   * says there is nothing to buy rather than pitching.
   */
  it('stops selling once it finds there is nothing on sale', async () => {
    const store = sellingTo(createStore());
    await renderWithStore(<PaywallScreen />, { store });

    expect(screen.getByTestId('paywall-already-open')).toBeTruthy();
    expect(screen.getByText(/There is nothing to buy/)).toBeTruthy();
    expect(screen.queryByTestId('paywall-subscribe')).toBeNull();
    expect(screen.queryByTestId('paywall-error')).toBeNull();
  });

  it('unlocks the catalogue rather than shutting it', async () => {
    const store = sellingTo(createStore());
    await renderWithStore(<PaywallScreen />, { store });

    expect(store.getState().access.hasPurchasableOffer).toBe(false);
  });
});

describe('PaywallScreen as a pitch', () => {
  async function renderSelling() {
    getOfferings.mockResolvedValue(bothTerms);
    const store = sellingTo(createStore());
    return renderWithStore(<PaywallScreen />, { store });
  }

  it('offers both terms, priced as the store priced them', async () => {
    await renderSelling();

    expect(screen.getByTestId('paywall-offer-monthly')).toBeTruthy();
    expect(screen.getByTestId('paywall-offer-annual')).toBeTruthy();
    expect(screen.getByText(/₹399\.00/)).toBeTruthy();
    expect(screen.getByText(/₹2,999\.00/)).toBeTruthy();
  });

  /** 399 × 12 = 4,788 against 2,999 — a 37% saving, worked out, not written. */
  it('works the annual saving out of the two prices', async () => {
    await renderSelling();

    expect(screen.getByTestId('paywall-saving')).toBeTruthy();
    expect(screen.getByText('SAVE 37%')).toBeTruthy();
  });

  it('starts on the annual term rather than the cheaper-looking one', async () => {
    await renderSelling();

    expect(screen.getByTestId('paywall-selected-annual')).toBeTruthy();
    expect(screen.queryByTestId('paywall-selected-monthly')).toBeNull();
  });

  it('lets the reader choose the monthly term instead', async () => {
    await renderSelling();

    await fireEvent.press(screen.getByTestId('paywall-offer-monthly'));

    expect(screen.getByTestId('paywall-selected-monthly')).toBeTruthy();
  });

  it('buys the term that is selected', async () => {
    const { store } = await renderSelling();
    purchasePackage.mockResolvedValue({ customerInfo: entitled });

    await fireEvent.press(screen.getByTestId('paywall-offer-monthly'));
    await fireEvent.press(screen.getByTestId('paywall-subscribe'));

    expect(purchasePackage).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: '$rc_monthly' }),
    );
    expect(store.getState().access.premium).toBe(true);
  });

  it('shows why a purchase failed', async () => {
    await renderSelling();
    purchasePackage.mockRejectedValue({ message: 'Payment declined' });

    await fireEvent.press(screen.getByTestId('paywall-subscribe'));

    expect(screen.getByTestId('paywall-error')).toHaveTextContent(
      'Payment declined',
    );
  });

  /** Cancelling is a decision, not a fault, and the screen must not argue. */
  it('says nothing when the buyer backs out of the store sheet', async () => {
    await renderSelling();
    purchasePackage.mockRejectedValue({ userCancelled: true });

    await fireEvent.press(screen.getByTestId('paywall-subscribe'));

    expect(screen.queryByTestId('paywall-error')).toBeNull();
  });

  it('counts what a subscription adds from the catalogue', async () => {
    await renderSelling();

    // 36 products in six categories of six, one of which stays free.
    expect(
      screen.getByText(/30 more products, across 5 asset classes/),
    ).toBeTruthy();
    expect(screen.getByText(/360 questions/)).toBeTruthy();
  });

  it('says what renewal and cancellation mean', async () => {
    await renderSelling();

    expect(screen.getByText(/renewed until you cancel/)).toBeTruthy();
  });
});

describe('PaywallScreen restoring', () => {
  it('grants access when the Google account already owns it', async () => {
    restorePurchases.mockResolvedValue(entitled);
    const store = sellingTo(createStore());
    await renderWithStore(<PaywallScreen />, { store });

    await fireEvent.press(screen.getByTestId('paywall-restore'));

    expect(store.getState().access.premium).toBe(true);
  });

  /** Never having bought anything is not an error state. */
  it('reports finding nothing as a notice, not a failure', async () => {
    const store = sellingTo(createStore());
    await renderWithStore(<PaywallScreen />, { store });

    await fireEvent.press(screen.getByTestId('paywall-restore'));

    expect(screen.getByTestId('paywall-notice')).toBeTruthy();
    expect(screen.queryByTestId('paywall-error')).toBeNull();
  });
});

describe('PaywallScreen for someone who already has everything', () => {
  it('does not sell to a subscriber', async () => {
    const store = createStore();
    initPurchases({ apiKey: 'goog_test' });
    store.dispatch(
      setEntitlement({
        purchasesConfigured: true,
        hasPurchasableOffer: true,
        premium: true,
      }),
    );
    getOfferings.mockResolvedValue(bothTerms);

    await renderWithStore(<PaywallScreen />, { store });

    expect(screen.getByTestId('paywall-already-open')).toBeTruthy();
    expect(screen.queryByTestId('paywall-subscribe')).toBeNull();
    expect(screen.queryByTestId('paywall-restore')).toBeNull();
  });

  /**
   * The guard that matters most: an install that predates the paywall keeps
   * everything, so this screen has nothing to sell it either.
   */
  it('does not sell to a grandfathered install', async () => {
    const store = createStore();
    initPurchases({ apiKey: 'goog_test' });
    store.dispatch(
      setEntitlement({
        purchasesConfigured: true,
        hasPurchasableOffer: true,
        premium: false,
      }),
    );
    store.dispatch(setGrandfathered(true));
    getOfferings.mockResolvedValue(bothTerms);

    await renderWithStore(<PaywallScreen />, { store });

    expect(screen.getByText(/permanently, and at no cost/)).toBeTruthy();
    expect(screen.queryByTestId('paywall-subscribe')).toBeNull();
  });
});
