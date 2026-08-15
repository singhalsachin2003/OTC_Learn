import { commodityProducts } from './catalogue/commodity';
import { creditProducts } from './catalogue/credit';
import { equityProducts } from './catalogue/equity';
import { fxProducts } from './catalogue/fx';
import { interestRateProducts } from './catalogue/interestRate';
import type { Product, Question } from './types';

/**
 * The full OTC product catalogue.
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

/**
 * Every question in the catalogue, indexed by id.
 *
 * The review queue stores question ids without their product, because a
 * question belongs to exactly one and carrying both would let the two disagree.
 * This index is what turns an id back into something renderable.
 */
const questionIndex = new Map(
  products.flatMap((product) =>
    product.quiz.map((question) => [question.id, { question, product }] as const),
  ),
);

export function getQuestionById(
  id: string,
): { question: Question; product: Product } | undefined {
  return questionIndex.get(id);
}

/** Total questions across the catalogue — shown on the home screen. */
export const TOTAL_QUESTIONS = questionIndex.size;

/** Every key term in the catalogue, flattened for the glossary. */
export function allKeyTerms(): {
  term: string;
  definition: string;
  productId: string;
  productName: string;
  categoryId: string;
}[] {
  return products
    .flatMap((product) =>
      product.keyTerms.map((entry) => ({
        term: entry.term,
        definition: entry.definition,
        productId: product.id,
        productName: product.name,
        categoryId: product.categoryId,
      })),
    )
    .sort((a, b) => a.term.localeCompare(b.term));
}
