import { EXAM_SCOPE_ALL } from '../utils/exam';
import { categories } from './categories';
import { products } from './products';

/**
 * The scopes an exam can be sat over: each asset class, plus the whole
 * catalogue.
 *
 * Composed here rather than in `utils/exam.ts` for the same reason
 * `achievements.ts` lives in `data/` — the exam engine stays pure and knows
 * nothing of the catalogue, while anything that needs to name a scope needs
 * the content.
 */

export interface ExamScope {
  id: string;
  name: string;
  /** How many questions exist to draw from, so the UI can rule out thin scopes. */
  questionCount: number;
}

export function examScopes(): ExamScope[] {
  const all: ExamScope = {
    id: EXAM_SCOPE_ALL,
    name: 'Everything',
    questionCount: products.reduce((sum, product) => sum + product.quiz.length, 0),
  };

  const byCategory = categories.map((category) => ({
    id: category.id,
    name: category.name,
    questionCount: products
      .filter((product) => product.categoryId === category.id)
      .reduce((sum, product) => sum + product.quiz.length, 0),
  }));

  return [all, ...byCategory];
}

/**
 * A scope's display name. Falls back to the id rather than to a placeholder:
 * a stored exam result naming a category that a later release removed should
 * still be readable as a row in the history.
 */
export function examScopeName(scopeId: string | null): string {
  if (scopeId === null) {
    return 'exam';
  }
  return examScopes().find((scope) => scope.id === scopeId)?.name ?? scopeId;
}
