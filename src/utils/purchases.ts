import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export interface PurchasesConfig {
  apiKey?: string;
  /** Tags the RevenueCat dashboard, the way `APP_ENV` tags Sentry events. */
  environment?: string;
}

/**
 * In-app purchases, via RevenueCat wrapping Google Play Billing.
 *
 * Inert unless an API key is configured, which is the same arrangement
 * `initErrorReporting` uses and for the same reason: the app has to keep
 * working as the app it has always been when the key is absent. Every build so
 * far ships without one, so this configures nothing, contacts nobody, and every
 * caller of `isPremium` gets `false`.
 *
 * The reason this exists before the key does is that the *permission* is the
 * gate. Google Play will not let a subscription be created until an uploaded
 * binary declares `com.android.vending.BILLING`, and that permission arrives in
 * the merged manifest through this dependency. So the build has to come first
 * and the entitlement wiring second — which is the opposite of the order it
 * looks like it should go in.
 *
 * A RevenueCat Android key is publishable: it identifies the app to RevenueCat
 * and grants nothing on its own, so shipping it in the bundle is expected. The
 * secret key is a server credential and must never appear in a build.
 */

let configured = false;

export function initPurchases({
  apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  environment = process.env.EXPO_PUBLIC_APP_ENV,
}: PurchasesConfig = {}): boolean {
  if (apiKey === undefined || apiKey === '') {
    return false;
  }

  Purchases.setLogLevel(
    environment === 'production' ? LOG_LEVEL.ERROR : LOG_LEVEL.WARN,
  );
  // No app user id: RevenueCat mints an anonymous one and Play restores
  // purchases through the buyer's Google account, so an account is not needed
  // to buy or to restore. When Supabase sign-in exists on a device, the two can
  // be linked later with `logIn` — deliberately not done here, because tying a
  // purchase to an identity the user has not been asked for is a privacy
  // decision, not a plumbing one.
  Purchases.configure({ apiKey });
  configured = true;
  return true;
}

/** Whether this build can transact at all. Screens use it to hide paywalls. */
export function isPurchasesConfigured(): boolean {
  return configured;
}

/** Test seam — the module-level flag would otherwise leak between cases. */
export function resetPurchases(): void {
  configured = false;
}

/**
 * Whether the user currently holds `entitlementId`.
 *
 * Answers `false` rather than throwing when unconfigured or offline. A paywall
 * that fails open would give the product away; one that fails closed on a
 * flaky network annoys a paying customer for a moment. Between the two, and
 * given RevenueCat caches the last known entitlement on the device, closed is
 * the right way to fail.
 */
export async function isPremium(entitlementId: string): Promise<boolean> {
  if (!configured) {
    return false;
  }
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[entitlementId] !== undefined;
  } catch {
    return false;
  }
}
