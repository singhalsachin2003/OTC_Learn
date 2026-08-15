import type { Category } from './types';

/**
 * The five asset classes, plus Market Foundations — the infrastructure they
 * run through. `accentColor` records the original OKLCH value from the design
 * handoff; the rendered hex equivalents live in `theme/colors.ts` keyed by
 * the same category id.
 */
export const categories: Category[] = [
  {
    id: 'ir',
    name: 'Interest Rate',
    description:
      'Products that manage exposure to interest rate movements on loans, bonds and cash flows.',
    accentColor: 'oklch(55% .13 250)',
    icon: 'IR',
  },
  {
    id: 'fx',
    name: 'FX',
    description:
      'Contracts used to hedge or speculate on currency exchange rate movements.',
    accentColor: 'oklch(55% .13 160)',
    icon: 'FX',
  },
  {
    id: 'credit',
    name: 'Credit',
    description:
      'Instruments that transfer or hedge the credit/default risk of borrowers.',
    accentColor: 'oklch(55% .13 20)',
    icon: 'CR',
  },
  {
    id: 'equity',
    name: 'Equity',
    description:
      'OTC instruments giving synthetic exposure to stocks, baskets, or indices.',
    accentColor: 'oklch(55% .13 300)',
    icon: 'EQ',
  },
  {
    id: 'commodity',
    name: 'Commodity',
    description:
      'Contracts that hedge or speculate on the price of physical commodities.',
    accentColor: 'oklch(55% .13 80)',
    icon: 'CM',
  },
  {
    id: 'foundations',
    name: 'Market Foundations',
    description:
      'The infrastructure every other product runs through — collateral, clearing, valuation and the legal architecture that ties an OTC relationship together.',
    accentColor: 'oklch(45% .03 250)',
    icon: 'MF',
  },
];

const categoriesById = new Map(categories.map((c) => [c.id, c]));

export function getCategoryById(id: string | null): Category | undefined {
  return id === null ? undefined : categoriesById.get(id);
}
