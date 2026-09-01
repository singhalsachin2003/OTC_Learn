import { useMemo } from 'react';

import { getQuestionById } from '../data/products';
import type { Product, Question } from '../data/types';
import { dueItems, nextDueDate, type ReviewItem } from '../utils/review';
import { useAccess } from './useAccess';
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
 * Two kinds of item are dropped rather than surfaced, for the same reason: a
 * queue the user can see but never clear. One is a question a later release
 * removed or renamed. The other is a question inside a product they can no
 * longer open — which happens to anyone whose subscription lapses, and whose
 * queue would otherwise both count down to a sitting that cannot run and hand
 * back the paid questions if it did.
 *
 * Nothing is deleted. The items stay in storage and come back the moment
 * access does, along with the schedule they were on.
 */
export function useReview(): ReviewSummary {
  const queue = useAppSelector((state) => state.review.queue);
  const loading = useAppSelector((state) => state.review.loading);
  const { productLocked } = useAccess();

  const visible = useMemo(() => {
    const resolve = (item: ReviewItem): ResolvedReviewItem | null => {
      const found = getQuestionById(item.id);
      if (found === undefined || productLocked(found.product.id)) {
        return null;
      }
      return { item, question: found.question, product: found.product };
    };
    return queue.flatMap((item) => resolve(item) ?? []);
  }, [queue, productLocked]);

  const due = useMemo(() => {
    const dueIds = new Set(
      dueItems(visible.map((entry) => entry.item)).map((item) => item.id),
    );
    return visible.filter((entry) => dueIds.has(entry.item.id));
  }, [visible]);

  const upcoming = useMemo(() => {
    const dueIds = new Set(due.map((entry) => entry.item.id));
    return visible
      .filter((entry) => !dueIds.has(entry.item.id))
      .sort((a, b) => a.item.dueOn.localeCompare(b.item.dueOn));
  }, [visible, due]);

  return {
    queue,
    due,
    dueCount: due.length,
    // Counted from what resolved, so the figure in Profile matches what the
    // review screen can actually show.
    queuedCount: visible.length,
    nextDueOn: nextDueDate(visible.map((entry) => entry.item)),
    upcoming,
    loading,
  };
}
