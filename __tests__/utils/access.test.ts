import { categories as catalogueCategories } from '../../src/data/categories';
import { products } from '../../src/data/products';

/**
 * Exercised against the real catalogue, with `exotics` as the premium class.
 *
 * This file used to mock the catalogue and flip Commodity to `premium`,
 * because under the inverted model nothing was paid and the locked paths could
 * not be reached at all. Exotics shipped as the first paid asset class, so the
 * fake is gone and the counts below are counts of the thing actually being
 * sold. `accessShippedCatalogue.test.ts` guards the other half — that none of
 * the six free classes ever joins it.
 */
const PREMIUM_ID = 'exotics';

import {
  canOpenCategory,
  canOpenProduct,
  paywallApplies,
  premiumCategoryCount,
  premiumCategoryNames,
  premiumProductCount,
  premiumQuestionCount,
} from '../../src/utils/access';

const PAYING = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: true,
  grandfathered: false,
  promoUnlocked: false,
};
const LOCKED = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: false,
  promoUnlocked: false,
};
const NO_BILLING = {
  purchasesConfigured: false,
  hasPurchasableOffer: false,
  premium: false,
  grandfathered: false,
  promoUnlocked: false,
};
const OLD_HAND = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: true,
  promoUnlocked: false,
};
/** A key in place, but no Play product yet — the order these arrive in. */
const NOTHING_ON_SALE = {
  purchasesConfigured: true,
  hasPurchasableOffer: false,
  premium: false,
  grandfathered: false,
  promoUnlocked: false,
};

/** A promotional code running. Reads as a temporary `OLD_HAND`. */
const ON_PROMO = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: false,
  promoUnlocked: true,
};

const freeIds = catalogueCategories.filter((c) => !c.premium).map((c) => c.id);
const paidIds = new Set(
  catalogueCategories.filter((c) => c.premium).map((c) => c.id),
);

describe('paywallApplies', () => {
  /**
   * The guard that matters most. A build with no RevenueCat key cannot tell
   * whether anyone has paid, so `isPremium` says no to everybody — gating on
   * that would lock content for every user of a build that has no way to sell
   * them anything, including the build that introduces billing.
   */
  it('does not apply when the build cannot sell anything', () => {
    expect(paywallApplies(NO_BILLING)).toBe(false);
  });

  /**
   * The key is one environment variable; the Play product is weeks of merchant
   * verification away. Setting the key first must not shut an asset class with
   * no way to pay for it.
   */
  it('does not apply when there is nothing on sale to buy', () => {
    expect(paywallApplies(NOTHING_ON_SALE)).toBe(false);
  });

  /**
   * The app shipped free with every asset class open, and those installs were
   * promised in as many words that it stays that way.
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

  /**
   * A redeemed code has to reach the same rule the other four inputs do, or it
   * would open the catalogue screens while leaving the quiz or the depth
   * sections locked — a half-unlocked app being worse than a locked one.
   */
  it('does not apply while a promotional code is running', () => {
    expect(paywallApplies(ON_PROMO)).toBe(false);
  });
});

describe('canOpenCategory', () => {
  it('leaves every asset class that shipped free open to everyone', () => {
    for (const access of [PAYING, LOCKED, NO_BILLING, OLD_HAND]) {
      for (const id of freeIds) {
        expect(canOpenCategory(id, access)).toBe(true);
      }
    }
  });

  it('locks a premium asset class for a new user once billing is live', () => {
    expect(canOpenCategory(PREMIUM_ID, LOCKED)).toBe(false);
  });

  it('opens everything for everyone else', () => {
    for (const category of catalogueCategories) {
      expect(canOpenCategory(category.id, PAYING)).toBe(true);
      expect(canOpenCategory(category.id, OLD_HAND)).toBe(true);
      expect(canOpenCategory(category.id, NO_BILLING)).toBe(true);
      expect(canOpenCategory(category.id, ON_PROMO)).toBe(true);
    }
  });

  /** Paid content is an explicit list; an id that is not on it is not paid. */
  it('opens a category id that does not exist, rather than selling it', () => {
    expect(canOpenCategory('no-such-class', LOCKED)).toBe(true);
  });
});

describe('canOpenProduct', () => {
  it("follows the product's category", () => {
    expect(canOpenProduct({ categoryId: 'ir' }, LOCKED)).toBe(true);
    expect(canOpenProduct({ categoryId: 'fx' }, LOCKED)).toBe(true);
    expect(canOpenProduct({ categoryId: PREMIUM_ID }, LOCKED)).toBe(false);
  });

  /**
   * A catalogue id that does not resolve is still a bug, but it is not a
   * premium asset class, and pretending it is puts a sales pitch in front of
   * nothing. The reversal from the old model is deliberate.
   */
  it('opens a product it cannot resolve, rather than selling it', () => {
    expect(canOpenProduct(undefined, LOCKED)).toBe(true);
  });

  it('opens an unresolvable product when the paywall does not apply', () => {
    expect(canOpenProduct(undefined, NO_BILLING)).toBe(true);
  });
});

describe('the counts the paywall sells on', () => {
  it('counts only the premium asset classes', () => {
    const paid = catalogueCategories.filter((c) => c.premium);
    expect(paid.length).toBeGreaterThan(0);
    expect(premiumCategoryCount()).toBe(paid.length);
    expect(premiumCategoryNames()).toEqual(paid.map((c) => c.name));
  });

  /** Derived from the catalogue, never written down — so this derives too. */
  it('counts their products and questions from the catalogue', () => {
    const premiumProducts = products.filter((p) => paidIds.has(p.categoryId));
    expect(premiumProducts.length).toBeGreaterThan(0);
    expect(premiumProductCount()).toBe(premiumProducts.length);
    // Both halves of what a subscription sells: the banks inside the paid
    // asset classes, and the depth banks added to the free ones.
    const depthQuestions = products.reduce(
      (total, p) => total + (p.depth?.quiz.length ?? 0),
      0,
    );
    expect(premiumQuestionCount()).toBe(
      premiumProducts.reduce((total, p) => total + p.quiz.length, 0) +
        depthQuestions,
    );
  });
});
