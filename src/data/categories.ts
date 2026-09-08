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
 * Exotics, Risk & the Greeks, Case Studies and Alternative Underlyings are on
 * the other side of that line, and they show the shape a paid class takes: each is built on the free
 * catalogue rather than carved out of it. Exotics assembles the vanilla
 * products into structures; Risk teaches what a desk does with any of them once
 * it is on the book; Case Studies runs the same mechanisms to the point where
 * they broke a real firm.
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
    id: 'alt',
    name: 'Alternative Underlyings',
    description:
      'Contracts defined by what they reference rather than by their payoff — perpetuals and basis, freight, power, catastrophe risk and longevity.',
    accentColor: 'oklch(55% .13 45)',
    icon: 'AU',
    premium: true,
  },
  {
    id: 'cases',
    name: 'Case Studies',
    description:
      'Twelve failures worth understanding, from Barings to Archegos — each one a mechanism from the free catalogue taken to its conclusion, and most of them a hedge that worked until it had to be funded.',
    accentColor: 'oklch(55% .13 120)',
    icon: 'CS',
    premium: true,
  },
  {
    id: 'risk',
    name: 'Risk & the Greeks',
    description:
      'How a desk measures what it is holding — DV01, the option Greeks, spread and default risk, the daily explain and value at risk.',
    accentColor: 'oklch(55% .13 205)',
    icon: 'RK',
    premium: true,
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
