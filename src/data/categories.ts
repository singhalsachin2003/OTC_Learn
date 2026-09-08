import type { Category } from './types';

/**
 * The five asset classes, plus Market Foundations — the infrastructure they
 * run through. `accentColor` records the original OKLCH value from the design
 * handoff; the rendered hex equivalents live in `theme/colors.ts` keyed by
 * the same category id.
 *
 * The six that shipped before the paywall are `premium: false` and must stay
 * that way. They are what the app gave its first users, and a subscription
 * sells what comes *after* them rather than access to them — flipping one to
 * `true` would take back something people already have.
 *
 * Exotics is the first class on the other side of that line, and the shape a
 * paid one takes: it is built on the free catalogue rather than carved out of
 * it, and every lesson in it names the free product it is assembled from.
 */
export const categories: Category[] = [
  {
    id: 'ir',
    name: 'Interest Rate',
    description:
      'Products that manage exposure to interest rate movements on loans, bonds and cash flows.',
    accentColor: 'oklch(55% .13 250)',
    icon: 'IR',
    premium: false,
  },
  {
    id: 'fx',
    name: 'FX',
    description:
      'Contracts used to hedge or speculate on currency exchange rate movements.',
    accentColor: 'oklch(55% .13 160)',
    icon: 'FX',
    premium: false,
  },
  {
    id: 'credit',
    name: 'Credit',
    description:
      'Instruments that transfer or hedge the credit/default risk of borrowers.',
    accentColor: 'oklch(55% .13 20)',
    icon: 'CR',
    premium: false,
  },
  {
    id: 'equity',
    name: 'Equity',
    description:
      'OTC instruments giving synthetic exposure to stocks, baskets, or indices.',
    accentColor: 'oklch(55% .13 300)',
    icon: 'EQ',
    premium: false,
  },
  {
    id: 'commodity',
    name: 'Commodity',
    description:
      'Contracts that hedge or speculate on the price of physical commodities.',
    accentColor: 'oklch(55% .13 80)',
    icon: 'CM',
    premium: false,
  },
  {
    id: 'foundations',
    name: 'Market Foundations',
    description:
      'The infrastructure every other product runs through — collateral, clearing, valuation and the legal architecture that ties an OTC relationship together.',
    accentColor: 'oklch(45% .03 250)',
    icon: 'MF',
    premium: false,
  },
  {
    id: 'exotics',
    name: 'Exotics',
    description:
      'Structured payoffs assembled from the vanilla products — barriers, digitals, accruals and the geared strips sold as zero-cost hedges.',
    accentColor: 'oklch(55% .13 340)',
    icon: 'EX',
    premium: true,
  },
];

const categoriesById = new Map(categories.map((c) => [c.id, c]));

export function getCategoryById(id: string | null): Category | undefined {
  return id === null ? undefined : categoriesById.get(id);
}
