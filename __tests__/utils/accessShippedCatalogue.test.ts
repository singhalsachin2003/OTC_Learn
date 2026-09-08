import { categories } from '../../src/data/categories';
import { products } from '../../src/data/products';
import {
  canOpenCategory,
  canOpenProduct,
  canOpenQuestion,
  openQuizFor,
  paywallApplies,
  premiumCategoryCount,
  premiumProductCount,
  premiumQuestionCount,
} from '../../src/utils/access';

/**
 * The real catalogue, unmocked — which is the point of a separate file.
 *
 * `access.test.ts` checks that the rules work. This one checks the promise
 * they were written to keep: **the six asset classes the app shipped free stay
 * free**, whatever is added beside them. The list below is deliberately a
 * literal rather than a filter over `premium`, because a filter would simply
 * agree with whatever the catalogue said and this file exists to disagree with
 * it. A diff here means a shipped asset class has been moved behind the
 * paywall, and that is the moment to stop and check who is being charged for
 * something they already had.
 *
 * Until 2026-09-08 this file also asserted that nothing at all was premium.
 * Exotics is the first paid class, so those assertions were changed
 * deliberately — that being exactly what the note here asked for.
 */
const SHIPPED_FREE = ['ir', 'fx', 'credit', 'equity', 'commodity', 'foundations'];

/** A user the paywall applies to: a new install on a build that can sell. */
const NEW_USER_ON_A_SELLING_BUILD = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: false,
};

/** An install that predates the paywall. Promised everything, permanently. */
const GRANDFATHERED = {
  purchasesConfigured: true,
  hasPurchasableOffer: true,
  premium: false,
  grandfathered: true,
};

describe('the catalogue as shipped', () => {
  it('still holds every asset class that shipped before the paywall', () => {
    const ids = categories.map((category) => category.id);
    for (const id of SHIPPED_FREE) {
      expect(ids).toContain(id);
    }
  });

  it('keeps all six of them free', () => {
    const charged = categories.filter(
      (category) => category.premium && SHIPPED_FREE.includes(category.id),
    );
    expect(charged.map((category) => category.id)).toEqual([]);
  });

  it('opens every one of their products to a user the paywall applies to', () => {
    const free = products.filter((product) =>
      SHIPPED_FREE.includes(product.categoryId),
    );
    expect(free.length).toBe(36);

    for (const category of SHIPPED_FREE) {
      expect(canOpenCategory(category, NEW_USER_ON_A_SELLING_BUILD)).toBe(true);
    }
    for (const product of free) {
      expect(canOpenProduct(product, NEW_USER_ON_A_SELLING_BUILD)).toBe(true);
    }
  });

  /**
   * The larger half of the grandfathering promise under this model: those
   * installs get the paid asset classes too, permanently, because the shipped
   * build told them so in as many words.
   */
  it('opens the paid asset classes as well to an install that predates them', () => {
    for (const category of categories) {
      expect(canOpenCategory(category.id, GRANDFATHERED)).toBe(true);
    }
    for (const product of products) {
      expect(canOpenProduct(product, GRANDFATHERED)).toBe(true);
    }
  });
});

describe('depth added to a free product', () => {
  /**
   * The promise, at the level depth could break it. A subscription may add to a
   * product that shipped free; it may not take anything out of one. So every
   * question id in `product.quiz` — the twelve that shipped — has to stay
   * answerable by a reader the paywall applies to, on all 36 free products,
   * whatever has since been added beside it.
   */
  it('never withholds a question that shipped in a free product', () => {
    const free = products.filter((product) =>
      SHIPPED_FREE.includes(product.categoryId),
    );

    for (const product of free) {
      const open = openQuizFor(product, NEW_USER_ON_A_SELLING_BUILD);
      for (const question of product.quiz) {
        expect(open).toContainEqual(question);
        expect(
          canOpenQuestion({ product, depth: false }, NEW_USER_ON_A_SELLING_BUILD),
        ).toBe(true);
      }
    }
  });

  it('withholds the depth bank from that same reader', () => {
    const withDepth = products.filter((product) => product.depth !== undefined);

    for (const product of withDepth) {
      const open = openQuizFor(product, NEW_USER_ON_A_SELLING_BUILD);
      expect(open).toHaveLength(product.quiz.length);
      expect(
        canOpenQuestion({ product, depth: true }, NEW_USER_ON_A_SELLING_BUILD),
      ).toBe(false);
    }
  });

  it('gives a subscriber both banks', () => {
    const withDepth = products.filter((product) => product.depth !== undefined);
    const SUBSCRIBER = { ...NEW_USER_ON_A_SELLING_BUILD, premium: true };

    for (const product of withDepth) {
      expect(openQuizFor(product, SUBSCRIBER)).toHaveLength(
        product.quiz.length + product.depth!.quiz.length,
      );
    }
  });

  /** The other half of the promise: grandfathered installs get depth too. */
  it('gives an install that predates the paywall both banks', () => {
    for (const product of products.filter((p) => p.depth !== undefined)) {
      expect(openQuizFor(product, GRANDFATHERED)).toHaveLength(
        product.quiz.length + product.depth!.quiz.length,
      );
    }
  });
});

describe('the catalogue as sold', () => {
  /**
   * The fourth guard, from the other side: there is now something premium, so
   * the paywall is live on a build that can sell — which is the change Exotics
   * made, and the one worth failing loudly if it is ever undone by accident.
   */
  it('applies the paywall now that a paid asset class exists', () => {
    expect(premiumCategoryCount()).toBeGreaterThan(0);
    expect(paywallApplies(NEW_USER_ON_A_SELLING_BUILD)).toBe(true);
  });

  it('quotes counts drawn from the catalogue rather than written down', () => {
    const premium = products.filter(
      (product) => !SHIPPED_FREE.includes(product.categoryId),
    );
    expect(premiumProductCount()).toBe(premium.length);
    const depthQuestions = products.reduce(
      (total, product) => total + (product.depth?.quiz.length ?? 0),
      0,
    );
    expect(premiumQuestionCount()).toBe(
      premium.reduce((total, product) => total + product.quiz.length, 0) +
        depthQuestions,
    );
  });
});
