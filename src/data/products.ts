import { alternativesProducts } from './catalogue/alternatives';
import { casesProducts } from './catalogue/cases';
import { commodityProducts } from './catalogue/commodity';
import { creditProducts } from './catalogue/credit';
import { equityProducts } from './catalogue/equity';
import { exoticsProducts } from './catalogue/exotics';
import { foundationsProducts } from './catalogue/foundations';
import { fxProducts } from './catalogue/fx';
import { interestRateProducts } from './catalogue/interestRate';
import { riskProducts } from './catalogue/risk';
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
  ...foundationsProducts,
  ...exoticsProducts,
  ...riskProducts,
  ...casesProducts,
  ...alternativesProducts,
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
interface IndexedQuestion {
  question: Question;
  product: Product;
  /** Whether this question is in the paid depth bank rather than the free one. */
  depth: boolean;
}

const questionIndex = new Map<string, IndexedQuestion>(
  products.flatMap((product) => [
    ...product.quiz.map((question): [string, IndexedQuestion] => [
      question.id,
      { question, product, depth: false },
    ]),
    // Depth questions are indexed too: the review queue stores ids without
    // their product, and an id it cannot resolve is dropped silently. Whether
    // a subscriber may *see* one is a separate question, answered by
    // `utils/access.ts` rather than by whether it exists.
    ...(product.depth?.quiz ?? []).map((question): [string, IndexedQuestion] => [
      question.id,
      { question, product, depth: true },
    ]),
  ]),
);

export function getQuestionById(id: string): IndexedQuestion | undefined {
  return questionIndex.get(id);
}

/**
 * Total questions across the catalogue, including the paid depth banks. Screens
 * that quote a figure to a reader should count what *that* reader can open —
 * see `openQuestionCount` in `hooks/useAccess.ts` — and use this only where the
 * whole catalogue is genuinely what is meant.
 */
export const TOTAL_QUESTIONS = questionIndex.size;

/** The questions a product's quiz may draw from, before access is considered. */
export function fullQuizFor(product: Product): Question[] {
  return product.depth === undefined
    ? product.quiz
    : [...product.quiz, ...product.depth.quiz];
}

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
