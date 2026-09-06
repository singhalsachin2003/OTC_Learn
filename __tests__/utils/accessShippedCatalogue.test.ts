import { categories } from '../../src/data/categories';
import { products } from '../../src/data/products';
import {
  canOpenCategory,
  canOpenProduct,
  paywallApplies,
  premiumCategoryCount,
  premiumProductCount,
  premiumQuestionCount,
} from '../../src/utils/access';

/**
 * The real catalogue, unmocked — which is the point of a separate file.
 *
 * `access.test.ts` fakes a premium asset class so the locked paths can be
 * exercised at all. This one asserts the opposite and more important thing:
 * that nothing in the catalogue as shipped is premium, so no user is locked
 * out of anything and the paywall does not apply to anybody.
 *
 * If a future asset class is added and marked `premium: true`, these tests
 * should be changed deliberately rather than patched — they are the record of
 * a promise made to the app's existing users, and a diff here is exactly the
 * moment to check the promise is still being kept.
 */

/** A user the paywall would apply to, if there were anything to apply. */
const NEW_USER_ON_A_SELLING_BUILD = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: false,
};

describe('the catalogue as shipped', () => {
  it('marks every asset class free', () => {
    const premium = categories.filter((c) => c.premium);
    expect(premium).toEqual([]);
  });

  it('sells nothing, so the counts the paywall quotes are all zero', () => {
    expect(premiumCategoryCount()).toBe(0);
    expect(premiumProductCount()).toBe(0);
    expect(premiumQuestionCount()).toBe(0);
  });

  /**
   * The guard that stops the app pitching a subscription that would add
   * nothing. Until a new asset class lands, this is every install.
   */
  it('leaves the paywall inert even on a build that can sell', () => {
    expect(paywallApplies(NEW_USER_ON_A_SELLING_BUILD)).toBe(false);
  });

  it('opens every category to a user the paywall would otherwise catch', () => {
    for (const category of categories) {
      expect(canOpenCategory(category.id, NEW_USER_ON_A_SELLING_BUILD)).toBe(true);
    }
  });

  it('opens every product to that same user', () => {
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(canOpenProduct(product, NEW_USER_ON_A_SELLING_BUILD)).toBe(true);
    }
  });
});
