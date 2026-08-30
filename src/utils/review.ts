import { toDateKey } from './formatters';

/**
 * Spaced repetition for missed questions.
 *
 * A question you got wrong comes back tomorrow, then in four days, then in ten,
 * and after that on a widening interval until it has been answered correctly
 * enough times to retire. The first three intervals are fixed because they are
 * what the app tells the user to expect; beyond that an SM-2 style ease factor
 * takes over.
 */

export const BASE_INTERVALS = [1, 4, 10] as const;
const EASE = 2.3;
const MAX_INTERVAL_DAYS = 120;
/** Clean passes beyond the fixed ladder before an item leaves the queue. */
const GRADUATION_STEPS = 3;

export interface ReviewItem {
  /** The question id — already unique across the whole catalogue. */
  id: string;
  productId: string;
  /** Position on the interval ladder. 0 means "due tomorrow". */
  step: number;
  /** Local date key, `YYYY-MM-DD`. */
  dueOn: string;
  /** How many times this question has been missed. */
  lapses: number;
  /** Epoch milliseconds of the last change, for sync to merge by. */
  updatedAt: number;
}

/**
 * A date key `days` from now, in local time.
 *
 * Built by mutating a Date rather than by adding milliseconds, so it stays
 * correct across a daylight-saving boundary where a day is 23 or 25 hours.
 */
export function addDays(days: number, from: Date = new Date()): string {
  const date = new Date(from.getTime());
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function intervalForStep(step: number): number {
  if (step < BASE_INTERVALS.length) {
    return BASE_INTERVALS[step];
  }
  const beyond = step - BASE_INTERVALS.length + 1;
  const last = BASE_INTERVALS[BASE_INTERVALS.length - 1];
  return Math.min(MAX_INTERVAL_DAYS, Math.round(last * EASE ** beyond));
}

/**
 * A missed question enters the queue, or resets to the start if it was already
 * in it. The lapse count survives the reset — it is what marks a question as
 * persistently difficult.
 */
export function scheduleLapse(
  existing: ReviewItem | undefined,
  questionId: string,
  productId: string,
  now: Date = new Date(),
): ReviewItem {
  return {
    id: questionId,
    productId,
    step: 0,
    dueOn: addDays(intervalForStep(0), now),
    lapses: (existing?.lapses ?? 0) + 1,
    updatedAt: now.getTime(),
  };
}

/**
 * A correct answer promotes a queued question to the next interval, or retires
 * it once it has been through the ladder and the graduation steps beyond it.
 * `null` means "remove from the queue".
 */
export function schedulePromotion(
  item: ReviewItem,
  now: Date = new Date(),
): ReviewItem | null {
  const nextStep = item.step + 1;
  if (nextStep >= BASE_INTERVALS.length + GRADUATION_STEPS) {
    return null;
  }
  return {
    ...item,
    step: nextStep,
    dueOn: addDays(intervalForStep(nextStep), now),
    updatedAt: now.getTime(),
  };
}

/** Date keys sort lexicographically, so a string compare is a date compare. */
export function isDue(item: ReviewItem, today: string = toDateKey()): boolean {
  return item.dueOn <= today;
}

export function dueItems(
  queue: readonly ReviewItem[],
  today: string = toDateKey(),
): ReviewItem[] {
  return queue.filter((item) => isDue(item, today));
}

/** Soonest upcoming due date among items that are not due yet, if any. */
export function nextDueDate(
  queue: readonly ReviewItem[],
  today: string = toDateKey(),
): string | null {
  const upcoming = queue
    .filter((item) => !isDue(item, today))
    .map((item) => item.dueOn)
    .sort();
  return upcoming[0] ?? null;
}
