import type { LessonStepNumber, Question } from '../data/types';
import { MASTERY_COMPLETE } from './mastery';
import { shuffled, shuffleOptions, type Rng } from './shuffle';

/**
 * Practice exams — a fair measurement, as opposed to a quiz's practice.
 *
 * The difference from `quizSession.buildSession` is deliberate and is the whole
 * point of the feature. A quiz draws *weighted* toward questions you have
 * missed or not seen, because it is there to teach. An exam must not: a paper
 * stacked with your weakest questions would report a score that says more about
 * the draw than about you, and a student revising for something real needs a
 * number they can trust. So an exam samples evenly and ignores history.
 *
 * Even coverage matters as much as unbiased selection. Twenty questions pulled
 * at random from a six-product scope can land twelve on one product; taking
 * them round-robin across products cannot, so the paper spans the syllabus
 * rather than sampling it luckily.
 */

/** Scope id meaning "every product in the catalogue". */
export const EXAM_SCOPE_ALL = 'all';

/**
 * Paper lengths on offer. Ten is a spot check, twenty a proper sitting, forty
 * a full mock — all well under a six-product category's bank, so even the
 * longest never exhausts the scope and collapses into "every question".
 */
export const EXAM_LENGTHS = [10, 20, 40] as const;

export const DEFAULT_EXAM_LENGTH = 20;

/** Seconds allowed per question. A minute is unhurried but not open-ended. */
export const SECONDS_PER_QUESTION = 60;

/** An exam is passed at the same figure a product counts as mastered. */
export const EXAM_PASS_MARK = MASTERY_COMPLETE;

/** One product's bank, as the caller resolved it from the catalogue. */
export interface ExamSource {
  productId: string;
  categoryId: string;
  questions: readonly Question[];
}

export interface ExamPaper {
  questions: Question[];
  /** Products the paper actually drew from, for the results breakdown. */
  productIds: string[];
  timeLimitMs: number;
}

export function timeLimitFor(questionCount: number): number {
  return Math.max(0, questionCount) * SECONDS_PER_QUESTION * 1000;
}

/**
 * Draws an exam paper.
 *
 * Round-robin across products: each pass takes one unused question from every
 * product that still has one, so the spread is even by construction rather
 * than by luck. Within a product the bank is shuffled first, so two sittings
 * on the same scope are still different papers.
 */
export function buildExamPaper(
  sources: readonly ExamSource[],
  count: number,
  rng: Rng = Math.random,
): ExamPaper {
  const wanted = Math.max(0, Math.round(count));

  // Each product's bank, shuffled, as a queue to draw from.
  const queues = shuffled(
    sources.filter((source) => source.questions.length > 0),
    rng,
  ).map((source) => ({
    productId: source.productId,
    remaining: shuffled([...source.questions], rng),
  }));

  const picked: Question[] = [];
  const drawnFrom = new Set<string>();

  // Stops when the paper is full or every bank is exhausted, whichever first —
  // a scope with fewer questions than requested yields a shorter exam rather
  // than looping forever or repeating a question.
  let exhausted = false;
  while (picked.length < wanted && !exhausted) {
    exhausted = true;
    for (const queue of queues) {
      if (picked.length >= wanted) {
        break;
      }
      const next = queue.remaining.pop();
      if (next === undefined) {
        continue;
      }
      exhausted = false;
      picked.push(next);
      drawnFrom.add(queue.productId);
    }
  }

  return {
    // Shuffled again so the paper does not read as one question per product in
    // a repeating cycle, which would telegraph the structure of the draw.
    questions: shuffled(picked, rng).map((question) =>
      shuffleOptions(question, rng),
    ),
    productIds: [...drawnFrom].sort(),
    timeLimitMs: timeLimitFor(picked.length),
  };
}

export interface ExamAnswer {
  questionId: string;
  correct: boolean;
}

export interface ExamBreakdownRow {
  key: string;
  correct: number;
  total: number;
  scorePct: number;
}

export interface ExamGrade {
  correct: number;
  total: number;
  scorePct: number;
  passed: boolean;
  byCategory: ExamBreakdownRow[];
  byStep: ExamBreakdownRow[];
}

/** What grading needs to know about a question, resolved by the caller. */
export interface ExamQuestionFacts {
  categoryId: string;
  step: LessonStepNumber;
}

function summarise(
  groups: Map<string, { correct: number; total: number }>,
): ExamBreakdownRow[] {
  return [...groups.entries()]
    .map(([key, tally]) => ({
      key,
      correct: tally.correct,
      total: tally.total,
      scorePct:
        tally.total === 0 ? 0 : Math.round((tally.correct / tally.total) * 100),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Grades a finished paper.
 *
 * The breakdowns cover only what the paper actually asked. An exam is a sample,
 * so reporting a category the paper never touched — even as zero — would read
 * as a result rather than as an absence.
 *
 * `unanswered` counts questions the sitting ran out of time on. They raise the
 * denominator without appearing in either breakdown: leaving them out of the
 * total would score two right answers and a timeout as 100%, while filing them
 * under a category would report a result on questions the user never saw.
 */
export function gradeExam(
  answers: readonly ExamAnswer[],
  resolve: (questionId: string) => ExamQuestionFacts | undefined,
  unanswered: number = 0,
): ExamGrade {
  const byCategory = new Map<string, { correct: number; total: number }>();
  const byStep = new Map<string, { correct: number; total: number }>();
  let correct = 0;

  for (const answer of answers) {
    if (answer.correct) {
      correct += 1;
    }
    const facts = resolve(answer.questionId);
    if (facts === undefined) {
      continue;
    }
    for (const [map, key] of [
      [byCategory, facts.categoryId],
      [byStep, String(facts.step)],
    ] as const) {
      const tally = map.get(key) ?? { correct: 0, total: 0 };
      tally.total += 1;
      tally.correct += answer.correct ? 1 : 0;
      map.set(key, tally);
    }
  }

  const total = answers.length + Math.max(0, unanswered);
  const scorePct = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    correct,
    total,
    scorePct,
    passed: total > 0 && scorePct >= EXAM_PASS_MARK,
    byCategory: summarise(byCategory),
    byStep: summarise(byStep),
  };
}

/** A finished exam, as persisted. */
export interface ExamResult {
  /**
   * Stable identity for one sitting, minted when it is recorded.
   *
   * Two identical sittings on the same day are indistinguishable by their
   * contents, so without this there is no way to tell a re-upload from a second
   * exam — and an upload that is not idempotent records the same sitting twice
   * every time a request is retried.
   */
  id: string;
  /** Local date key of the sitting. */
  takenOn: string;
  scopeId: string;
  correct: number;
  total: number;
  scorePct: number;
  passed: boolean;
  /** Elapsed milliseconds, or null if the sitting ran out of time. */
  durationMs: number | null;
}

/** Newest first, so a history list reads without reversing it at the call site. */
/**
 * Mints an id for a sitting.
 *
 * Takes its randomness as an argument for the same reason `buildSession` does:
 * a test that cannot fix the id cannot assert on one. The date prefix is there
 * to make a stored history readable by eye, not to carry meaning — nothing
 * parses it back out.
 */
export function examResultId(
  takenOn: string,
  rng: () => number = Math.random,
): string {
  const suffix = Math.floor(rng() * 0xffffffff)
    .toString(36)
    .padStart(7, '0');
  return `${takenOn}-${suffix}`;
}

export function sortResults(results: readonly ExamResult[]): ExamResult[] {
  return [...results].sort((a, b) => b.takenOn.localeCompare(a.takenOn));
}

/** Best score recorded for a scope, or null if it has never been sat. */
export function bestResultFor(
  results: readonly ExamResult[],
  scopeId: string,
): ExamResult | null {
  const forScope = results.filter((result) => result.scopeId === scopeId);
  if (forScope.length === 0) {
    return null;
  }
  return forScope.reduce((best, result) =>
    result.scorePct > best.scorePct ? result : best,
  );
}
