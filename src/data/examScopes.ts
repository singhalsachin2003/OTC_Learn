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
  /**
   * How many questions exist to draw from, so the UI can rule out thin scopes.
   * Counts only what the reader can actually open — a figure that included
   * locked banks would promise a paper the draw cannot produce.
   */
  questionCount: number;
  /** Whether a subscription is needed before this scope can be sat at all. */
  locked: boolean;
}

function questionsIn(pool: typeof products): number {
  return pool.reduce((sum, product) => sum + product.quiz.length, 0);
}

/**
 * `canOpen` defaults to "everything", which is what every caller that only
 * wants to *name* a scope needs — a stored result from an asset class the
 * reader no longer subscribes to must still render as a row in the history.
 */
export function examScopes(
  canOpen: (productId: string) => boolean = () => true,
): ExamScope[] {
  const open = products.filter((product) => canOpen(product.id));

  const all: ExamScope = {
    id: EXAM_SCOPE_ALL,
    name: 'Everything',
    questionCount: questionsIn(open),
    // Never locked: there is always the free asset class to sit it over.
    locked: false,
  };

  const byCategory = categories.map((category) => {
    const openInCategory = open.filter(
      (product) => product.categoryId === category.id,
    );
    return {
      id: category.id,
      name: category.name,
      questionCount: questionsIn(openInCategory),
      locked: openInCategory.length === 0,
    };
  });

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
