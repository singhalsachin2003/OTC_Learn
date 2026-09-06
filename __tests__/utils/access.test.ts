import type { Category } from '../../src/data/types';
import { categories as catalogueCategories } from '../../src/data/categories';
import { products } from '../../src/data/products';

/**
 * A premium asset class has to be faked, because there is not one yet.
 *
 * That is the whole point of the model — everything written so far is free,
 * and a subscription buys what comes next — so the locked paths cannot be
 * reached with the real catalogue. Rather than assert nothing about them until
 * the first new asset class lands, the catalogue modules are mocked with
 * Commodity flipped to `premium`, which is exactly the shape a future addition
 * will have. The products themselves are the real ones, so the counts below
 * are real counts of a real asset class.
 */
const PREMIUM_ID = 'commodity';

jest.mock('../../src/data/categories', () => {
  // Type-only, so it is erased before the factory is hoisted.
  const actual = jest.requireActual('../../src/data/categories') as {
    categories: Category[];
  };
  return {
    ...actual,
    categories: actual.categories.map((c) =>
      c.id === 'commodity' ? { ...c, premium: true } : c,
    ),
  };
});

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
};
const LOCKED = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: false,
};
const NO_BILLING = {
  purchasesConfigured: false,
  hasPurchasableOffer: false,
  premium: false,
  grandfathered: false,
};
const OLD_HAND = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: true,
};
/** A key in place, but no Play product yet — the order these arrive in. */
const NOTHING_ON_SALE = {
  purchasesConfigured: true,
  hasPurchasableOffer: false,
  premium: false,
  grandfathered: false,
};

const freeIds = catalogueCategories
  .filter((c) => c.id !== PREMIUM_ID)
  .map((c) => c.id);

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
    expect(premiumCategoryCount()).toBe(1);
    expect(premiumCategoryNames()).toEqual([
      catalogueCategories.find((c) => c.id === PREMIUM_ID)?.name,
    ]);
  });

  /** Derived from the catalogue, never written down — so this derives too. */
  it('counts their products and questions from the catalogue', () => {
    const premiumProducts = products.filter((p) => p.categoryId === PREMIUM_ID);
    expect(premiumProducts.length).toBeGreaterThan(0);
    expect(premiumProductCount()).toBe(premiumProducts.length);
    expect(premiumQuestionCount()).toBe(
      premiumProducts.reduce((total, p) => total + p.quiz.length, 0),
    );
  });
});
