import { useMemo } from 'react';

import { getQuestionById } from '../data/products';
import type { Product, Question } from '../data/types';
import { dueItems, nextDueDate, type ReviewItem } from '../utils/review';
import { useAppSelector } from './useAppState';

export interface ResolvedReviewItem {
  item: ReviewItem;
  question: Question;
  product: Product;
}

export interface ReviewSummary {
  queue: ReviewItem[];
  /** Items due today or earlier, resolved to their question and product. */
  due: ResolvedReviewItem[];
  dueCount: number;
  /** Total queued, including items not yet due. */
  queuedCount: number;
  /** Date key of the next item to come due, or null if none are pending. */
  nextDueOn: string | null;
  loading: boolean;
}

/**
 * Reads the review queue and resolves it against the catalogue.
 *
 * Items whose question no longer exists are dropped rather than surfaced: a
 * release that removes or renames a question would otherwise leave a queue the
 * user can see but never clear.
 */
export function useReview(): ReviewSummary {
  const queue = useAppSelector((state) => state.review.queue);
  const loading = useAppSelector((state) => state.review.loading);

  const due = useMemo(() => {
    return dueItems(queue).flatMap((item) => {
      const found = getQuestionById(item.id);
      return found === undefined
        ? []
        : [{ item, question: found.question, product: found.product }];
    });
  }, [queue]);

  return {
    queue,
    due,
    dueCount: due.length,
    queuedCount: queue.length,
    nextDueOn: nextDueDate(queue),
    loading,
  };
}
