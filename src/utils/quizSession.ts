import type { Question } from '../data/types';
import { shuffled, shuffleOptions, type Rng } from './shuffle';

/**
 * Builds a quiz paper from a product's question bank.
 *
 * The bank is deliberately larger than a sitting, so which questions appear is
 * a choice rather than a given. Two things drive it: a question you have missed
 * should come back, and a question you have never seen should come up before
 * one you have already answered correctly three times. Selection is weighted
 * rather than sorted, so the paper still differs between two consecutive
 * attempts with identical history.
 */

/** Answer tally for one question id, accumulated across every attempt. */
export interface QuestionStat {
  right: number;
  wrong: number;
}

export type QuestionHistory = Readonly<Record<string, QuestionStat | undefined>>;

/** Questions per sitting when the user has not chosen otherwise. */
export const DEFAULT_SESSION_SIZE = 6;

const WEIGHT_MISSED = 6;
const WEIGHT_UNSEEN = 3;
const WEIGHT_KNOWN = 1;

/**
 * How strongly a question wants to be asked. Missed questions outrank unseen
 * ones, which outrank questions already answered correctly — but every weight
 * stays above zero, so nothing is permanently retired from the bank.
 */
export function weightFor(question: Question, history: QuestionHistory): number {
  const stat = history[question.id];
  if (stat === undefined || stat.right + stat.wrong === 0) {
    return WEIGHT_UNSEEN;
  }
  if (stat.wrong >= stat.right) {
    return WEIGHT_MISSED;
  }
  return WEIGHT_KNOWN;
}

/**
 * Weighted sample without replacement. Each draw picks a point in the total
 * remaining weight and walks the candidates until it lands, which is O(n·k) —
 * irrelevant at bank sizes of a dozen, and far easier to verify than a tree.
 */
function weightedSample<T>(
  items: readonly T[],
  weightOf: (item: T) => number,
  count: number,
  rng: Rng,
): T[] {
  // Floored at 1 rather than 0: this is private to the module and `weightFor`
  // never returns zero, but flooring here means the walk below cannot divide a
  // zero total, so there is no second code path to reason about or to leave
  // untested.
  const pool = items.map((item) => ({ item, weight: Math.max(1, weightOf(item)) }));
  const picked: T[] = [];

  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let target = rng() * total;
    let index = 0;
    for (; index < pool.length - 1; index += 1) {
      target -= pool[index].weight;
      if (target <= 0) {
        break;
      }
    }
    picked.push(pool[index].item);
    pool.splice(index, 1);
  }

  return picked;
}

export interface SessionOptions {
  /** How many questions to draw. Clamped to the size of the bank. */
  size?: number;
  history?: QuestionHistory;
  rng?: Rng;
}

/**
 * Draws a paper: weighted selection, then the order shuffled, then each
 * question's options shuffled. Returns questions ready to render.
 */
export function buildSession(
  bank: readonly Question[],
  {
    size = DEFAULT_SESSION_SIZE,
    history = {},
    rng = Math.random,
  }: SessionOptions = {},
): Question[] {
  const count = Math.max(0, Math.min(size, bank.length));
  const selected = weightedSample(bank, (q) => weightFor(q, history), count, rng);
  return shuffled(selected, rng).map((question) => shuffleOptions(question, rng));
}

/** Was this answer correct? Handles both question kinds in one place. */
export function isCorrectAnswer(
  question: Question,
  answer: boolean | number,
): boolean {
  return question.kind === 'boolean'
    ? answer === question.correctAnswer
    : answer === question.correctIndex;
}

/** The answer as it should be shown on a results breakdown. */
export function correctAnswerLabel(question: Question): string {
  return question.kind === 'boolean'
    ? question.correctAnswer
      ? 'True'
      : 'False'
    : question.options[question.correctIndex];
}
