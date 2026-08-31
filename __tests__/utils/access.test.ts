import { categories } from '../../src/data/categories';
import {
  canOpenCategory,
  canOpenProduct,
  FREE_CATEGORY_ID,
  lockedCategoryCount,
  paywallApplies,
} from '../../src/utils/access';

const PAYING = { purchasesConfigured: true, premium: true, grandfathered: false };
const LOCKED = { purchasesConfigured: true, premium: false, grandfathered: false };
const NO_BILLING = {
  purchasesConfigured: false,
  premium: false,
  grandfathered: false,
};
const OLD_HAND = {
  purchasesConfigured: true,
  premium: false,
  grandfathered: true,
};

describe('paywallApplies', () => {
  /**
   * The guard that matters most. A build with no RevenueCat key cannot tell
   * whether anyone has paid, so `isPremium` says no to everybody — gating on
   * that would lock the entire catalogue for every user of a build that has no
   * way to sell them anything, including the build that introduces billing.
   */
  it('does not apply when the build cannot sell anything', () => {
    expect(paywallApplies(NO_BILLING)).toBe(false);
  });

  /**
   * The app shipped free with every asset class open. Taking five of six back
   * from someone who already had them is a removal, not a price.
   */
  it('never applies to an install that predates it', () => {
    expect(paywallApplies(OLD_HAND)).toBe(false);
  });

  it('does not apply to a subscriber', () => {
    expect(paywallApplies(PAYING)).toBe(false);
  });

  it('applies to a new user on a build that can sell', () => {
    expect(paywallApplies(LOCKED)).toBe(true);
  });
});

describe('canOpenCategory', () => {
  it('leaves the free asset class open to everyone', () => {
    for (const access of [PAYING, LOCKED, NO_BILLING, OLD_HAND]) {
      expect(canOpenCategory(FREE_CATEGORY_ID, access)).toBe(true);
    }
  });

  it('locks the rest for a new user once billing is live', () => {
    const others = categories.filter((c) => c.id !== FREE_CATEGORY_ID);
    expect(others.length).toBeGreaterThan(0);
    for (const category of others) {
      expect(canOpenCategory(category.id, LOCKED)).toBe(false);
    }
  });

  it('opens everything for everyone else', () => {
    for (const category of categories) {
      expect(canOpenCategory(category.id, PAYING)).toBe(true);
      expect(canOpenCategory(category.id, OLD_HAND)).toBe(true);
      expect(canOpenCategory(category.id, NO_BILLING)).toBe(true);
    }
  });

  /** The free class has to be a real id, or every category is locked. */
  it('names a category that exists', () => {
    expect(categories.some((c) => c.id === FREE_CATEGORY_ID)).toBe(true);
  });
});

describe('canOpenProduct', () => {
  it("follows the product's category", () => {
    expect(canOpenProduct({ categoryId: FREE_CATEGORY_ID }, LOCKED)).toBe(true);
    expect(canOpenProduct({ categoryId: 'fx' }, LOCKED)).toBe(false);
  });

  /** A catalogue id that does not resolve is a bug; fail closed on it. */
  it('locks a product it cannot resolve, rather than opening it', () => {
    expect(canOpenProduct(undefined, LOCKED)).toBe(false);
  });

  it('opens an unresolvable product when the paywall does not apply', () => {
    expect(canOpenProduct(undefined, NO_BILLING)).toBe(true);
  });
});

describe('lockedCategoryCount', () => {
  it('counts every asset class but the free one', () => {
    expect(lockedCategoryCount()).toBe(categories.length - 1);
  });
});
