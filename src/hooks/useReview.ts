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
  /**
   * Queued items not yet due, resolved and sorted soonest-first — the
   * "coming up" preview for a screen with nothing due today.
   */
  upcoming: ResolvedReviewItem[];
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

  const resolve = (item: ReviewItem): ResolvedReviewItem | null => {
    const found = getQuestionById(item.id);
    return found === undefined
      ? null
      : { item, question: found.question, product: found.product };
  };

  const due = useMemo(() => {
    return dueItems(queue).flatMap((item) => resolve(item) ?? []);
  }, [queue]);

  const upcoming = useMemo(() => {
    const dueIds = new Set(due.map((entry) => entry.item.id));
    return queue
      .filter((item) => !dueIds.has(item.id))
      .sort((a, b) => a.dueOn.localeCompare(b.dueOn))
      .flatMap((item) => resolve(item) ?? []);
  }, [queue, due]);

  return {
    queue,
    due,
    dueCount: due.length,
    queuedCount: queue.length,
    nextDueOn: nextDueDate(queue),
    upcoming,
    loading,
  };
}
