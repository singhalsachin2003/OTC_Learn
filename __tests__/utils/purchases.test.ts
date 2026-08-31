import Purchases from 'react-native-purchases';

import {
  initPurchases,
  isPremium,
  isPurchasesConfigured,
  resetPurchases,
} from '../../src/utils/purchases';

const configure = Purchases.configure as jest.Mock;
const getCustomerInfo = Purchases.getCustomerInfo as jest.Mock;

beforeEach(() => {
  resetPurchases();
  jest.clearAllMocks();
  getCustomerInfo.mockResolvedValue({ entitlements: { active: {} } });
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
    await expect(isPremium('premium')).resolves.toBe(false);
    expect(getCustomerInfo).not.toHaveBeenCalled();
  });

  it('is true when the entitlement is active', async () => {
    getCustomerInfo.mockResolvedValue({
      entitlements: { active: { premium: { identifier: 'premium' } } },
    });
    initPurchases({ apiKey: 'goog_test' });

    await expect(isPremium('premium')).resolves.toBe(true);
  });

  it('is false for an entitlement the user does not hold', async () => {
    getCustomerInfo.mockResolvedValue({
      entitlements: { active: { other: {} } },
    });
    initPurchases({ apiKey: 'goog_test' });

    await expect(isPremium('premium')).resolves.toBe(false);
  });

  /**
   * A paywall that failed open would give the product away. RevenueCat caches
   * the last known entitlement on the device, so failing closed costs a paying
   * customer a moment rather than an outage.
   */
  it('fails closed when the lookup throws', async () => {
    getCustomerInfo.mockRejectedValue(new Error('offline'));
    initPurchases({ apiKey: 'goog_test' });

    await expect(isPremium('premium')).resolves.toBe(false);
  });
});
