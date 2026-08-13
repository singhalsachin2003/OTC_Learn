import { isChoiceQuestion, type Question } from '../data/types';

/**
 * Randomness helpers for quiz sessions.
 *
 * Every function takes its random source as an argument rather than reaching
 * for `Math.random` directly. Shuffling is exactly the kind of logic that fails
 * silently — a permutation that loses the answer index marks correct answers
 * wrong, and no exception is ever thrown — so the tests drive it with a seeded
 * generator and assert on the exact permutation.
 */
export type Rng = () => number;

/** Fisher–Yates on a copy. The input is never mutated. */
export function shuffled<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const swap = out[i];
    out[i] = out[j];
    out[j] = swap;
  }
  return out;
}

/**
 * Deterministic generator for tests: a small LCG, so a given seed always
 * produces the same session. Not cryptographic, and not meant to be.
 */
export function seededRng(seed: number): Rng {
  let state = seed >>> 0 || 1;
  return () => {
    // Numerical Recipes constants; the >>> keeps it in unsigned 32-bit range.
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/**
 * Options that read as a sequence — money amounts, percentages, plain numbers —
 * are conventionally printed in order, and reordering them makes a question
 * harder to read without making it harder to answer. Those are left alone.
 */
function hasOrdinalOptions(options: readonly string[]): boolean {
  const numeric = options.filter((option) =>
    /^[−+-]?[$€£]?[\d.,]+\s*(%|bp|bps|m|bn|k)?$/i.test(option.trim()),
  );
  return numeric.length === options.length;
}

/**
 * Shuffle a choice question's options, moving `correctIndex` with them.
 *
 * Without this the right answer sits in the same position on every retake, so a
 * repeat visitor learns positions rather than content. True/false questions are
 * returned untouched — there is nothing to permute.
 */
export function shuffleOptions(
  question: Question,
  rng: Rng = Math.random,
): Question {
  if (!isChoiceQuestion(question) || hasOrdinalOptions(question.options)) {
    return question;
  }

  const order = shuffled(
    question.options.map((_, index) => index),
    rng,
  );

  return {
    ...question,
    options: order.map((index) => question.options[index]),
    correctIndex: order.indexOf(question.correctIndex),
  };
}
