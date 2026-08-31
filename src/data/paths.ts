import { categories } from './categories';

/**
 * The order to learn each asset class in.
 *
 * The catalogue's own order is the order things were written, which is not the
 * order anyone should meet them in — the home screen's "start here" card was
 * offering Swaption, an advanced product, to someone who had never opened the
 * app, purely because it happened to be authored second.
 *
 * A path is one asset class, start to finish. Cross-cutting routes were
 * considered and left out: a learner following six products in one market gets
 * a coherent picture of that market, where a route that hops between rates and
 * credit teaches a little of each and a grasp of neither.
 *
 * Difficulty never decreases along a path — `__tests__/data/paths.test.ts`
 * enforces that — so the ordering can be checked mechanically rather than
 * argued about. Within a difficulty the order is dependency-led: a product
 * comes after the ones it is explained in terms of.
 *
 * This is a teaching judgement, not a fact about markets, and it is meant to be
 * argued with. Reordering an array here is the whole change.
 */
export interface LearningPath {
  categoryId: string;
  /** Every product in the category, in the order to study them. */
  productIds: string[];
}

export const paths: LearningPath[] = [
  {
    categoryId: 'ir',
    // The workhorse first, then its single-period building block, then
    // optionality, then the variations. Swaption last: it is an option *on*
    // the swap and assumes both.
    productIds: ['irs', 'fra', 'capfloor', 'basisswap', 'infswap', 'swaption'],
  },
  {
    categoryId: 'fx',
    // Outright, then the swap that is two of them, then optionality and the
    // structure built out of options, then the two that add settlement and
    // cross-currency machinery.
    productIds: ['fxfwd', 'fxswap', 'fxopt', 'fxrr', 'ndf', 'xccy'],
  },
  {
    categoryId: 'credit',
    // Single name, then the index, then the two cash-and-swap combinations,
    // then the funded note, then an option on the index.
    productIds: ['cds', 'cdx', 'assetswap', 'trs', 'cln', 'cdxopt'],
  },
  {
    categoryId: 'equity',
    // The simplest exposure first; variance and the autocallable are the two
    // that assume everything before them.
    productIds: ['cfd', 'eqswap', 'eqopt', 'divswap', 'varswap', 'autocall'],
  },
  {
    categoryId: 'commodity',
    // Forward, swap, then a swap on an index nobody can deliver, then
    // optionality, the spread and the multi-exercise option.
    productIds: ['cmfwd', 'cmswap', 'weather', 'cmopt', 'crackspread', 'swing'],
  },
  {
    categoryId: 'foundations',
    // The legal architecture first, because everything else is defined inside
    // it, then collateral, clearing, valuation, reporting — and XVA last,
    // since it prices the consequences of all five.
    productIds: ['isda', 'collateral', 'clearing', 'marking', 'execution', 'xva'],
  },
];

const pathsByCategory = new Map(paths.map((p) => [p.categoryId, p]));

export function pathFor(categoryId: string | null): string[] {
  return categoryId === null
    ? []
    : (pathsByCategory.get(categoryId)?.productIds ?? []);
}

/**
 * Every product in path order, asset class by asset class.
 *
 * The asset classes follow `categories`, so the order the home screen offers
 * matches the order the category list shows — two different answers to "what
 * next" would be worse than either.
 */
export function orderedProductIds(): string[] {
  return categories.flatMap((category) => pathFor(category.id));
}

/** Where a product sits in its own path, 1-based. Zero if it is not on one. */
export function positionInPath(categoryId: string, productId: string): number {
  return pathFor(categoryId).indexOf(productId) + 1;
}
