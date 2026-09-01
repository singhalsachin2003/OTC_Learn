import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  type PurchasesPackage,
} from 'react-native-purchases';

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

/**
 * The packages behind the offers last loaded, kept so `purchaseOffer` can take
 * a plain id. Cleared by `resetPurchases` along with everything else.
 */
let packagesById = new Map<string, PurchasesPackage>();

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
  packagesById = new Map();
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

/**
 * The entitlement a subscription grants, as named in the RevenueCat dashboard.
 *
 * A string constant rather than a literal at each call site, because the name
 * has to match a value typed into a web console that nothing here can check:
 * if it is ever wrong, it should be wrong in exactly one place.
 */
export const PREMIUM_ENTITLEMENT_ID = 'premium';

export type OfferPeriod = 'monthly' | 'annual' | 'other';

/**
 * One thing the user can buy, flattened out of RevenueCat's package objects.
 *
 * The store never holds a `PurchasesPackage`: it carries methods and a nested
 * product, which Redux rightly objects to, and it would put a native library's
 * shape into every component that renders a price. `id` is the handle back —
 * `purchaseOffer` looks the real package up again here.
 *
 * There are no prices in this repo and there never should be. Play returns them
 * localised and tax-inclusive per country, and a hardcoded "₹399" would be
 * wrong in 176 of the 177 countries the app is listed in.
 */
export interface SubscriptionOffer {
  id: string;
  period: OfferPeriod;
  /** Already formatted by the store, e.g. "₹399.00". Render it as given. */
  priceString: string;
  /** The same figure as a number, only for comparing the two terms. */
  price: number;
  currencyCode: string;
}

function periodOf(pkg: PurchasesPackage): OfferPeriod {
  if (pkg.packageType === PACKAGE_TYPE.ANNUAL) {
    return 'annual';
  }
  return pkg.packageType === PACKAGE_TYPE.MONTHLY ? 'monthly' : 'other';
}

/**
 * What is on sale, or an empty list.
 *
 * Empty covers three different situations the paywall treats alike — no key, no
 * network, no offering configured yet — because none of them is the user's
 * problem and all three mean the same thing on screen: nothing can be bought
 * right now. The screen still renders, because it is also the explanation of
 * what a subscription is for.
 */
export async function loadOffers(): Promise<SubscriptionOffer[]> {
  if (!configured) {
    return [];
  }
  try {
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages ?? [];
    packagesById = new Map(packages.map((pkg) => [pkg.identifier, pkg]));
    return packages.map((pkg) => ({
      id: pkg.identifier,
      period: periodOf(pkg),
      priceString: pkg.product.priceString,
      price: pkg.product.price,
      currencyCode: pkg.product.currencyCode,
    }));
  } catch {
    return [];
  }
}

/** What a purchase attempt ended as. Cancelling is not a failure. */
export type PurchaseOutcome =
  | { result: 'purchased' }
  | { result: 'cancelled' }
  | { result: 'failed'; message: string };

/**
 * Buys `offerId`.
 *
 * Cancellation is separated from failure because it is by far the most common
 * ending and the two want opposite treatment: an error message after someone
 * has deliberately backed out of Play's sheet reads as the app arguing with
 * them.
 */
export async function purchaseOffer(offerId: string): Promise<PurchaseOutcome> {
  const pkg = packagesById.get(offerId);
  if (!configured || pkg === undefined) {
    return { result: 'failed', message: 'That subscription is unavailable.' };
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] === undefined
      ? { result: 'failed', message: 'The purchase did not complete.' }
      : { result: 'purchased' };
  } catch (error) {
    if ((error as { userCancelled?: boolean }).userCancelled === true) {
      return { result: 'cancelled' };
    }
    return {
      result: 'failed',
      message:
        (error as { message?: string }).message ?? 'The purchase did not complete.',
    };
  }
}

/**
 * Re-reads what the Play account already owns.
 *
 * Needed on every store that sells subscriptions: a reinstall, a second device
 * or a cleared app storage leaves someone paying with nothing to show for it,
 * and the only remedy is a button that asks the store again.
 */
export async function restoreEntitlements(): Promise<boolean> {
  if (!configured) {
    return false;
  }
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}
