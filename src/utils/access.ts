import { categories } from '../data/categories';

/**
 * Who can open what.
 *
 * The rule is simple — one asset class is free, the rest need a subscription —
 * but two guards around it are not, and both exist to stop the paywall doing
 * damage rather than to make it work.
 *
 * **It is inert unless purchases are configured.** A build with no RevenueCat
 * key cannot tell whether anyone has paid, so `isPremium` answers `false` for
 * everybody. Gating on that would lock the whole catalogue for every user of a
 * build that has no way to sell them anything — including the build that
 * introduces billing. Off by default is the only safe default here.
 *
 * **Anyone who was already using the app keeps all of it.** The app shipped
 * free with thirty-six products and people are studying them now; taking five
 * asset classes back, along with the mastery someone built in them, is not a
 * paywall but a removal. `grandfathered` is set once, for installs that predate
 * the paywall, and never expires.
 */

/** The asset class that stays free. Its id, so a rename breaks the build. */
export const FREE_CATEGORY_ID = 'ir';

export interface AccessState {
  /** Whether this build can sell anything at all. */
  purchasesConfigured: boolean;
  /** Whether the user holds the entitlement. */
  premium: boolean;
  /** Whether this install predates the paywall. */
  grandfathered: boolean;
}

/**
 * Whether the paywall applies to this user at all.
 *
 * Every `false` here means the app behaves exactly as it did before billing
 * existed, which is the state the overwhelming majority of installs are in.
 */
export function paywallApplies(access: AccessState): boolean {
  return access.purchasesConfigured && !access.premium && !access.grandfathered;
}

export function canOpenCategory(categoryId: string, access: AccessState): boolean {
  return !paywallApplies(access) || categoryId === FREE_CATEGORY_ID;
}

/**
 * Products carry their category, so this is the same question asked of a
 * product. An unknown category is treated as locked rather than open: a
 * catalogue id that does not resolve is a bug, and failing closed on it is the
 * same choice `isPremium` makes.
 */
export function canOpenProduct(
  product: { categoryId: string } | undefined,
  access: AccessState,
): boolean {
  if (!paywallApplies(access)) {
    return true;
  }
  return product?.categoryId === FREE_CATEGORY_ID;
}

/** How many asset classes a subscription would add, for the paywall's copy. */
export function lockedCategoryCount(): number {
  return categories.filter((c) => c.id !== FREE_CATEGORY_ID).length;
}
