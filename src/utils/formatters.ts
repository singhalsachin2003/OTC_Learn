/** Pure text/number formatting helpers used across screens. */

/** "2 of 3" — used for both lesson steps and quiz questions. */
export function formatStepLabel(index: number, total: number): string {
  return `${index + 1} of ${total}`;
}

/** "2/3" */
export function formatScore(score: number, total: number): string {
  return `${score}/${total}`;
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
