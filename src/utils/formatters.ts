/** Pure text/number formatting helpers used across screens. */

/** "2 of 3" — used for both lesson steps and quiz questions. */
export function formatStepLabel(index: number, total: number): string {
  return `${index + 1} of ${total}`;
}

/** "4 products · 2 done" */
export function formatProductCount(total: number, done: number): string {
  const noun = total === 1 ? 'product' : 'products';
  return `${total} ${noun} · ${done} done`;
}

/** "3/10 products" */
export function formatProgressLabel(completed: number, total: number): string {
  const noun = total === 1 ? 'product' : 'products';
  return `${completed} / ${total} ${noun}`;
}

/** "2/3" */
export function formatScore(score: number, total: number): string {
  return `${score}/${total}`;
}

/**
 * Completion ratio clamped to 0–1. A `total` of 0 yields 0 rather than NaN so
 * progress bars never receive an invalid width.
 */
export function progressRatio(completed: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, completed / total));
}

/** Whole-number percentage, e.g. 0.333 -> 33. */
export function progressPercent(completed: number, total: number): number {
  return Math.round(progressRatio(completed, total) * 100);
}

/** Local calendar date as `YYYY-MM-DD`. Local, not UTC, so streaks roll at midnight for the user. */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Whole days between two `YYYY-MM-DD` keys; negative if `to` precedes `from`. */
export function daysBetween(from: string, to: string): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return Number.NaN;
  }
  return Math.round((end - start) / MS_PER_DAY);
}
