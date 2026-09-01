import Purchases from 'react-native-purchases';

import {
  annualSavingPercent,
  initPurchases,
  isPremium,
  isPurchasesConfigured,
  loadOffers,
  PREMIUM_ENTITLEMENT_ID,
  purchaseOffer,
  resetPurchases,
  restoreEntitlements,
} from '../../src/utils/purchases';

const configure = Purchases.configure as jest.Mock;
const getCustomerInfo = Purchases.getCustomerInfo as jest.Mock;
const getOfferings = Purchases.getOfferings as jest.Mock;
const purchasePackage = Purchases.purchasePackage as jest.Mock;
const restorePurchases = Purchases.restorePurchases as jest.Mock;

/** A RevenueCat package, cut down to the fields the facade reads. */
function pkg(
  identifier: string,
  packageType: string,
  priceString: string,
  price: number,
) {
  return {
    identifier,
    packageType,
    product: { priceString, price, currencyCode: 'INR' },
  };
}

const entitled = { entitlements: { active: { otc_learn_pro: {} } } };
const notEntitled = { entitlements: { active: {} } };

beforeEach(() => {
  resetPurchases();
  jest.clearAllMocks();
  getCustomerInfo.mockResolvedValue({ entitlements: { active: {} } });
  getOfferings.mockResolvedValue({ current: null });
  restorePurchases.mockResolvedValue({ entitlements: { active: {} } });
});

describe('initPurchases', () => {
  /**
   * Every build so far ships without a key, and has to keep working as the app
   * it has always been — the same arrangement `initErrorReporting` uses.
   */
  it('stays inert with no key, and contacts nobody', () => {
    expect(initPurchases({ apiKey: undefined })).toBe(false);
    expect(configure).not.toHaveBeenCalled();
    expect(isPurchasesConfigured()).toBe(false);
  });

  it('treats a blank key as no key', () => {
    expect(initPurchases({ apiKey: '' })).toBe(false);
    expect(configure).not.toHaveBeenCalled();
  });

  it('configures when a key is supplied', () => {
    expect(initPurchases({ apiKey: 'goog_test' })).toBe(true);
    expect(configure).toHaveBeenCalledWith({ apiKey: 'goog_test' });
    expect(isPurchasesConfigured()).toBe(true);
  });

  /** Injectable for the same reason the Supabase and Sentry configs are. */
  it('takes its key as an argument rather than reading the environment', () => {
    const before = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
    process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY = 'from-env';

    initPurchases({ apiKey: 'explicit' });

    expect(configure).toHaveBeenCalledWith({ apiKey: 'explicit' });
    process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY = before;
  });

  it('configures no app user id, so a purchase needs no account', () => {
    initPurchases({ apiKey: 'goog_test' });

    expect(configure).toHaveBeenCalledWith(
      expect.not.objectContaining({ appUserID: expect.anything() }),
    );
  });
});

describe('isPremium', () => {
  it('is false on a build that cannot transact', async () => {
    await expect(isPremium(PREMIUM_ENTITLEMENT_ID)).resolves.toBe(false);
    expect(getCustomerInfo).not.toHaveBeenCalled();
  });

  it('is true when the entitlement is active', async () => {
    getCustomerInfo.mockResolvedValue({
      entitlements: { active: { otc_learn_pro: { identifier: 'otc_learn_pro' } } },
    });
    initPurchases({ apiKey: 'goog_test' });

    await expect(isPremium(PREMIUM_ENTITLEMENT_ID)).resolves.toBe(true);
  });

  it('is false for an entitlement the user does not hold', async () => {
    getCustomerInfo.mockResolvedValue({
      entitlements: { active: { other: {} } },
    });
    initPurchases({ apiKey: 'goog_test' });

    await expect(isPremium(PREMIUM_ENTITLEMENT_ID)).resolves.toBe(false);
  });

  /**
   * A paywall that failed open would give the product away. RevenueCat caches
   * the last known entitlement on the device, so failing closed costs a paying
   * customer a moment rather than an outage.
   */
  it('fails closed when the lookup throws', async () => {
    getCustomerInfo.mockRejectedValue(new Error('offline'));
    initPurchases({ apiKey: 'goog_test' });

    await expect(isPremium(PREMIUM_ENTITLEMENT_ID)).resolves.toBe(false);
  });
});

describe('loadOffers', () => {
  it('offers nothing on a build that cannot transact', async () => {
    await expect(loadOffers()).resolves.toEqual([]);
    expect(getOfferings).not.toHaveBeenCalled();
  });

  it('flattens the current offering into plain rows', async () => {
    getOfferings.mockResolvedValue({
      current: {
        availablePackages: [
          pkg('$rc_monthly', 'MONTHLY', '₹399.00', 399),
          pkg('$rc_annual', 'ANNUAL', '₹2,999.00', 2999),
        ],
      },
    });
    initPurchases({ apiKey: 'goog_test' });

    await expect(loadOffers()).resolves.toEqual([
      {
        id: '$rc_monthly',
        period: 'monthly',
        priceString: '₹399.00',
        price: 399,
        currencyCode: 'INR',
      },
      {
        id: '$rc_annual',
        period: 'annual',
        priceString: '₹2,999.00',
        price: 2999,
        currencyCode: 'INR',
      },
    ]);
  });

  /** Prices are the store's to format, per country. None are written here. */
  it('renders the store’s own price string rather than building one', async () => {
    getOfferings.mockResolvedValue({
      current: { availablePackages: [pkg('m', 'MONTHLY', '$4.99', 4.99)] },
    });
    initPurchases({ apiKey: 'goog_test' });

    const [offer] = await loadOffers();
    expect(offer?.priceString).toBe('$4.99');
  });

  it('calls anything that is neither term "other" rather than guessing', async () => {
    getOfferings.mockResolvedValue({
      current: { availablePackages: [pkg('c', 'CUSTOM', '₹99.00', 99)] },
    });
    initPurchases({ apiKey: 'goog_test' });

    const [offer] = await loadOffers();
    expect(offer?.period).toBe('other');
  });

  /**
   * No key, no network and no offering configured all mean the same thing on
   * screen — nothing can be bought right now — and none of them is an error
   * the user can do anything about.
   */
  it('is empty when the offering has not been configured yet', async () => {
    getOfferings.mockResolvedValue({ current: null });
    initPurchases({ apiKey: 'goog_test' });

    await expect(loadOffers()).resolves.toEqual([]);
  });

  it('is empty when the lookup throws', async () => {
    getOfferings.mockRejectedValue(new Error('offline'));
    initPurchases({ apiKey: 'goog_test' });

    await expect(loadOffers()).resolves.toEqual([]);
  });
});

describe('purchaseOffer', () => {
  async function withOffers() {
    getOfferings.mockResolvedValue({
      current: {
        availablePackages: [pkg('$rc_monthly', 'MONTHLY', '₹399.00', 399)],
      },
    });
    initPurchases({ apiKey: 'goog_test' });
    await loadOffers();
  }

  it('fails rather than throwing when the offer is unknown', async () => {
    await withOffers();

    await expect(purchaseOffer('nope')).resolves.toEqual({
      result: 'failed',
      message: 'That subscription is unavailable.',
    });
    expect(purchasePackage).not.toHaveBeenCalled();
  });

  it('buys the package the offer id stands for', async () => {
    await withOffers();
    purchasePackage.mockResolvedValue({ customerInfo: entitled });

    await expect(purchaseOffer('$rc_monthly')).resolves.toEqual({
      result: 'purchased',
    });
    expect(purchasePackage).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: '$rc_monthly' }),
    );
  });

  /**
   * Backing out of Play's sheet is the commonest ending there is, and it wants
   * the opposite treatment from a failure: an error message after someone has
   * deliberately cancelled reads as the app arguing with them.
   */
  it('separates a cancellation from a failure', async () => {
    await withOffers();
    purchasePackage.mockRejectedValue({ userCancelled: true });

    await expect(purchaseOffer('$rc_monthly')).resolves.toEqual({
      result: 'cancelled',
    });
  });

  it('reports the store’s message when the purchase fails', async () => {
    await withOffers();
    purchasePackage.mockRejectedValue({ message: 'Payment declined' });

    await expect(purchaseOffer('$rc_monthly')).resolves.toEqual({
      result: 'failed',
      message: 'Payment declined',
    });
  });

  /** A sale that leaves no entitlement behind has not granted anything. */
  it('fails when the purchase returns without the entitlement', async () => {
    await withOffers();
    purchasePackage.mockResolvedValue({ customerInfo: notEntitled });

    await expect(purchaseOffer('$rc_monthly')).resolves.toEqual({
      result: 'failed',
      message: 'The purchase did not complete.',
    });
  });

  it('forgets its packages when purchases are reset', async () => {
    await withOffers();
    resetPurchases();

    await expect(purchaseOffer('$rc_monthly')).resolves.toEqual({
      result: 'failed',
      message: 'That subscription is unavailable.',
    });
  });
});

describe('restoreEntitlements', () => {
  it('does nothing on a build that cannot transact', async () => {
    await expect(restoreEntitlements()).resolves.toEqual({ result: 'none' });
    expect(restorePurchases).not.toHaveBeenCalled();
  });

  it('restores when the account already owns the entitlement', async () => {
    restorePurchases.mockResolvedValue(entitled);
    initPurchases({ apiKey: 'goog_test' });

    await expect(restoreEntitlements()).resolves.toEqual({ result: 'restored' });
  });

  it('finds nothing when the account owns nothing', async () => {
    restorePurchases.mockResolvedValue(notEntitled);
    initPurchases({ apiKey: 'goog_test' });

    await expect(restoreEntitlements()).resolves.toEqual({ result: 'none' });
  });

  /**
   * The distinction that matters most here. Someone the app has lost track of
   * is exactly who presses restore, and "no subscription found" when the truth
   * is "Play could not be reached" tells them the thing they are afraid of.
   */
  it('separates a store it could not reach from an account with nothing', async () => {
    restorePurchases.mockRejectedValue(new Error('offline'));
    initPurchases({ apiKey: 'goog_test' });

    await expect(restoreEntitlements()).resolves.toEqual({
      result: 'failed',
      message: 'offline',
    });
  });
});

describe('annualSavingPercent', () => {
  function offer(period: 'monthly' | 'annual', price: number, currency = 'INR') {
    return {
      id: period,
      period,
      priceString: String(price),
      price,
      currencyCode: currency,
    } as const;
  }

  /**
   * The figures chosen on 2026-09-01: ₹29 monthly against ₹199 annually. The
   * badge is the only place either price is compared, so pinning the arithmetic
   * here is what catches a later price change quietly making it wrong.
   *
   * 29 × 12 = 348; (348 − 199) / 348 = 42.8%.
   */
  it('reads 43% for the chosen INR prices', () => {
    expect(annualSavingPercent([offer('monthly', 29), offer('annual', 199)])).toBe(
      43,
    );
  });

  it('says nothing when only one term is on sale', () => {
    expect(annualSavingPercent([offer('monthly', 29)])).toBeNull();
    expect(annualSavingPercent([offer('annual', 199)])).toBeNull();
  });

  /** A "saving" that costs more is not one, and no badge is better than a lie. */
  it('says nothing when the annual term saves nothing', () => {
    expect(annualSavingPercent([offer('monthly', 29), offer('annual', 400)])).toBe(
      null,
    );
  });

  /**
   * Currencies are per country and one offering is priced in one of them, so
   * this should not happen — but subtracting across two would produce a
   * confident, wrong number.
   */
  it('refuses to compare two different currencies', () => {
    expect(
      annualSavingPercent([offer('monthly', 29), offer('annual', 199, 'USD')]),
    ).toBeNull();
  });
});
