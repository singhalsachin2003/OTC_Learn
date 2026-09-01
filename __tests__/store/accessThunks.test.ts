import Purchases from 'react-native-purchases';

import { createStore, type AppStore } from '../../src/store';
import {
  buyOffer,
  loadPaywallOffers,
  refreshEntitlement,
  restoreSubscription,
} from '../../src/store/thunks/accessThunks';
import { setAnalyticsSink, type AnalyticsEvent } from '../../src/utils/analytics';
import { initPurchases, resetPurchases } from '../../src/utils/purchases';

const getCustomerInfo = Purchases.getCustomerInfo as jest.Mock;
const getOfferings = Purchases.getOfferings as jest.Mock;
const purchasePackage = Purchases.purchasePackage as jest.Mock;
const restorePurchases = Purchases.restorePurchases as jest.Mock;

const entitled = { entitlements: { active: { otc_learn_pro: {} } } };
const notEntitled = { entitlements: { active: {} } };

const offering = {
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

let store: AppStore;
let events: AnalyticsEvent[];

beforeEach(() => {
  resetPurchases();
  jest.clearAllMocks();
  getCustomerInfo.mockResolvedValue(notEntitled);
  getOfferings.mockResolvedValue({ current: null });
  restorePurchases.mockResolvedValue(notEntitled);
  store = createStore();
  events = [];
  setAnalyticsSink((event) => events.push(event));
});

afterEach(() => {
  setAnalyticsSink(null);
});

describe('refreshEntitlement', () => {
  /**
   * The state every build so far ships in, and the one the paywall has to be
   * harmless in: nothing configured means nothing is locked for anybody.
   */
  it('leaves an unconfigured build with no paywall at all', async () => {
    await store.dispatch(refreshEntitlement());

    expect(store.getState().access.purchasesConfigured).toBe(false);
    expect(store.getState().access.premium).toBe(false);
    expect(getCustomerInfo).not.toHaveBeenCalled();
  });

  it('records the entitlement a configured build finds', async () => {
    getCustomerInfo.mockResolvedValue(entitled);
    initPurchases({ apiKey: 'goog_test' });

    await store.dispatch(refreshEntitlement());

    expect(store.getState().access).toMatchObject({
      purchasesConfigured: true,
      premium: true,
    });
  });

  /**
   * Both halves land in one dispatch. Setting `purchasesConfigured` first
   * would close the paywall over a subscriber for as long as the entitlement
   * lookup took.
   */
  it('never reports a configured build before it knows the entitlement', async () => {
    const seen: { configured: boolean; premium: boolean }[] = [];
    getCustomerInfo.mockResolvedValue(entitled);
    initPurchases({ apiKey: 'goog_test' });
    const unsubscribe = store.subscribe(() => {
      const { purchasesConfigured, premium } = store.getState().access;
      seen.push({ configured: purchasesConfigured, premium });
    });

    await store.dispatch(refreshEntitlement());
    unsubscribe();

    expect(seen).not.toContainEqual({ configured: true, premium: false });
  });
});

describe('loadPaywallOffers', () => {
  it('holds what is on sale, and settles back to idle', async () => {
    getOfferings.mockResolvedValue(offering);
    initPurchases({ apiKey: 'goog_test' });

    await store.dispatch(loadPaywallOffers());

    expect(store.getState().access.offers).toHaveLength(2);
    expect(store.getState().access.status).toBe('idle');
  });

  it('ends with an empty list rather than an error when nothing is on sale', async () => {
    await store.dispatch(loadPaywallOffers());

    expect(store.getState().access.offers).toEqual([]);
    expect(store.getState().access.error).toBeNull();
  });
});

describe('buyOffer', () => {
  async function withOffers(): Promise<void> {
    getOfferings.mockResolvedValue(offering);
    initPurchases({ apiKey: 'goog_test' });
    await store.dispatch(loadPaywallOffers());
  }

  it('grants premium on a completed purchase', async () => {
    await withOffers();
    purchasePackage.mockResolvedValue({ customerInfo: entitled });

    await store.dispatch(buyOffer('$rc_annual'));

    expect(store.getState().access.premium).toBe(true);
    expect(store.getState().access.status).toBe('idle');
    expect(events).toContainEqual({
      name: 'purchase_completed',
      period: 'annual',
    });
  });

  /** Cancelling is not a failure, and must not be reported to the user as one. */
  it('says nothing when the buyer backs out of the store sheet', async () => {
    await withOffers();
    purchasePackage.mockRejectedValue({ userCancelled: true });

    await store.dispatch(buyOffer('$rc_monthly'));

    expect(store.getState().access).toMatchObject({
      premium: false,
      status: 'idle',
      error: null,
    });
    expect(events).not.toContainEqual({ name: 'purchase_failed' });
  });

  it('reports a failure and stays unentitled', async () => {
    await withOffers();
    purchasePackage.mockRejectedValue({ message: 'Payment declined' });

    await store.dispatch(buyOffer('$rc_monthly'));

    expect(store.getState().access).toMatchObject({
      premium: false,
      status: 'idle',
      error: 'Payment declined',
    });
    expect(events).toContainEqual({ name: 'purchase_failed' });
  });

  /** A second attempt must not sit under the message the first one left. */
  it('clears the last failure when a new attempt starts', async () => {
    await withOffers();
    purchasePackage.mockRejectedValue({ message: 'Payment declined' });
    await store.dispatch(buyOffer('$rc_monthly'));

    purchasePackage.mockResolvedValue({ customerInfo: entitled });
    await store.dispatch(buyOffer('$rc_monthly'));

    expect(store.getState().access.error).toBeNull();
  });

  it('reports the term bought and nothing else about the buyer', async () => {
    await withOffers();
    purchasePackage.mockResolvedValue({ customerInfo: entitled });

    await store.dispatch(buyOffer('$rc_monthly'));

    expect(events).toEqual([
      { name: 'purchase_started', period: 'monthly' },
      { name: 'purchase_completed', period: 'monthly' },
    ]);
  });
});

describe('restoreSubscription', () => {
  it('grants premium when the store account already owns it', async () => {
    restorePurchases.mockResolvedValue(entitled);
    initPurchases({ apiKey: 'goog_test' });

    await store.dispatch(restoreSubscription());

    expect(store.getState().access.premium).toBe(true);
    expect(events).toContainEqual({ name: 'purchase_restored' });
  });

  /**
   * Finding nothing is the ordinary answer for someone who has never bought
   * anything. Styling it as an error would accuse them of having a problem.
   */
  /**
   * A dropped connection must not revoke a subscriber. Nothing was learned
   * from a call that never landed.
   */
  it('leaves an existing entitlement alone when the store cannot be reached', async () => {
    getCustomerInfo.mockResolvedValue(entitled);
    initPurchases({ apiKey: 'goog_test' });
    await store.dispatch(refreshEntitlement());
    restorePurchases.mockRejectedValue(new Error('offline'));

    await store.dispatch(restoreSubscription());

    expect(store.getState().access).toMatchObject({
      premium: true,
      error: 'offline',
      notice: null,
    });
  });

  it('says so plainly when there is nothing to restore', async () => {
    initPurchases({ apiKey: 'goog_test' });

    await store.dispatch(restoreSubscription());

    expect(store.getState().access).toMatchObject({
      premium: false,
      status: 'idle',
      error: null,
      notice: 'No subscription found on this Google account.',
    });
  });
});
