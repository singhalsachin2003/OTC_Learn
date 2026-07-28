import { commodityProducts } from './catalogue/commodity';
import { creditProducts } from './catalogue/credit';
import { equityProducts } from './catalogue/equity';
import { fxProducts } from './catalogue/fx';
import { interestRateProducts } from './catalogue/interestRate';
import type { Product } from './types';

/**
 * The full OTC product catalogue, four products per asset class.
 *
 * Content lives in `./catalogue`, one file per category, so a single asset
 * class can be edited without scrolling past the others. Order here sets the
 * order products appear within their category screen.
 *
 * Product ids are part of the persisted schema — completed products are stored
 * in AsyncStorage keyed by id, so renaming one silently discards a user's
 * progress for it. Add freely; rename only with a migration.
 */
export const products: Product[] = [
  ...interestRateProducts,
  ...fxProducts,
  ...creditProducts,
  ...equityProducts,
  ...commodityProducts,
];

/** Total number of products in the catalogue — drives the progress bar. */
export const TOTAL_PRODUCTS = products.length;

const productsById = new Map(products.map((p) => [p.id, p]));

export function getProductById(id: string | null): Product | undefined {
  return id === null ? undefined : productsById.get(id);
}

export function getProductsByCategory(categoryId: string | null): Product[] {
  return categoryId === null
    ? []
    : products.filter((p) => p.categoryId === categoryId);
}
