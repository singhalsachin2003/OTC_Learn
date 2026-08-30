import type { LessonStepNumber } from '../data/types';
import { toDateKey } from './formatters';
import {
  LEARNING_RATE,
  MASTERY_COMPLETE,
  masteryBand,
  type MasteryBand,
  type ProductProgress,
} from './mastery';
import type { QuestionHistory } from './quizSession';

/**
 * Insights — what the numbers the app already keeps add up to.
 *
 * Nothing here is stored. Every figure is derived from mastery records, the
 * question history and the study-day log, so an insight can never drift out of
 * step with the progress it describes, and resetting progress clears it too.
 * That is the same reasoning `data/achievements.ts` follows.
 *
 * The catalogue is injected rather than imported. A question's category and
 * lesson step live in `data/`, but pulling the catalogue in here would mean
 * every test of an accuracy calculation had to load 500KB of content to assert
 * on six answers — so the caller resolves ids and this module stays pure, in
 * the same spirit as the `now` and `rng` arguments elsewhere in `utils/`.
 */

/** What the catalogue knows about one question, resolved by the caller. */
export interface QuestionFacts {
  categoryId: string;
  productId: string;
  step: LessonStepNumber;
}

export type QuestionResolver = (questionId: string) => QuestionFacts | undefined;

/**
 * Answers below this are reported but not ranked as a weakness. An accuracy
 * figure drawn from three answers is noise, and telling someone their weakest
 * asset class is one they have answered twice would send them to study the
 * wrong thing.
 */
export const MIN_CONFIDENT_SAMPLE = 8;

export interface AccuracyBucket {
  answered: number;
  correct: number;
  /** 0–100. Zero when nothing has been answered, not undefined. */
  accuracyPercent: number;
  /** Whether the sample is large enough to rank on. */
  confident: boolean;
}

export interface CategoryAccuracy extends AccuracyBucket {
  categoryId: string;
}

export interface StepAccuracy extends AccuracyBucket {
  step: LessonStepNumber;
}

function bucket(answered: number, correct: number): AccuracyBucket {
  return {
    answered,
    correct,
    accuracyPercent: answered === 0 ? 0 : Math.round((correct / answered) * 100),
    confident: answered >= MIN_CONFIDENT_SAMPLE,
  };
}

/**
 * Folds the lifetime question history into buckets keyed by whatever
 * `keyOf` pulls off each question. Unresolvable ids are skipped rather than
 * bucketed under a placeholder: a question id that is no longer in the
 * catalogue is content that was removed, and counting it would report accuracy
 * on material the user can no longer study.
 */
function tally<K extends string | number>(
  history: QuestionHistory,
  resolve: QuestionResolver,
  keyOf: (facts: QuestionFacts) => K,
): Map<K, { answered: number; correct: number }> {
  const totals = new Map<K, { answered: number; correct: number }>();
  for (const [questionId, stat] of Object.entries(history)) {
    if (stat === undefined) {
      continue;
    }
    const facts = resolve(questionId);
    if (facts === undefined) {
      continue;
    }
    const key = keyOf(facts);
    const running = totals.get(key) ?? { answered: 0, correct: 0 };
    running.answered += stat.right + stat.wrong;
    running.correct += stat.right;
    totals.set(key, running);
  }
  return totals;
}

/**
 * Accuracy per asset class, in the order the categories were given so the UI
 * can render a stable list rather than one that reorders as answers land.
 */
export function accuracyByCategory(
  history: QuestionHistory,
  resolve: QuestionResolver,
  categoryIds: readonly string[],
): CategoryAccuracy[] {
  const totals = tally(history, resolve, (facts) => facts.categoryId);
  return categoryIds.map((categoryId) => {
    const running = totals.get(categoryId) ?? { answered: 0, correct: 0 };
    return { categoryId, ...bucket(running.answered, running.correct) };
  });
}

/** Every product carries the same five steps, so this compares like with like. */
export const LESSON_STEPS: readonly LessonStepNumber[] = [1, 2, 3, 4, 5];

/**
 * Accuracy per lesson step, across the whole catalogue.
 *
 * This is the insight a per-product score cannot give: the steps follow the
 * same arc in every product — what it is, how it works, why it's used, key
 * terms, risks — so a user who is consistently weak on step 5 is weak on risk,
 * not on any one instrument.
 */
export function accuracyByStep(
  history: QuestionHistory,
  resolve: QuestionResolver,
): StepAccuracy[] {
  const totals = tally(history, resolve, (facts) => facts.step);
  return LESSON_STEPS.map((step) => {
    const running = totals.get(step) ?? { answered: 0, correct: 0 };
    return { step, ...bucket(running.answered, running.correct) };
  });
}

/**
 * The weakest buckets worth acting on, worst first. Buckets below the
 * confidence floor are dropped rather than ranked last, because "no data" is
 * not a weakness and padding the list with it would bury the real one.
 */
export function rankWeakest<T extends AccuracyBucket>(
  buckets: readonly T[],
  limit: number,
): T[] {
  return buckets
    .filter((entry) => entry.confident)
    .slice()
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent)
    .slice(0, Math.max(0, limit));
}

export interface MasteryDistribution {
  'not started': number;
  shaky: number;
  building: number;
  strong: number;
}

/** How the catalogue splits across the mastery bands. */
export function masteryDistribution(
  productIds: readonly string[],
  progress: Readonly<Record<string, ProductProgress | undefined>>,
): MasteryDistribution {
  const counts: MasteryDistribution = {
    'not started': 0,
    shaky: 0,
    building: 0,
    strong: 0,
  };
  for (const id of productIds) {
    const band: MasteryBand = masteryBand(progress[id]?.mastery ?? 0);
    counts[band] += 1;
  }
  return counts;
}

/**
 * The mastery from which one flawless session reaches the completion
 * threshold, derived rather than written down so it stays true if the learning
 * rate or the threshold move.
 *
 * Mastery moves `LEARNING_RATE` of the way from where it is to the session
 * score, so a 100% sitting from `m` lands at `m + (100 - m) · r`. Setting that
 * at or above the threshold and solving for `m` gives the figure below. At the
 * shipped 0.35 and 70 it works out at 54 — and `nextMastery` rounds, so 54 is
 * genuinely enough.
 */
export function masteryWithinOneSession(
  learningRate: number = LEARNING_RATE,
  threshold: number = MASTERY_COMPLETE,
): number {
  return Math.ceil((threshold - 100 * learningRate) / (1 - learningRate));
}

export type RecommendationReason =
  'nearly-there' | 'shaky' | 'continue-category' | 'start-here';

/** A product the user could study next, and why it was picked. */
export interface Recommendation {
  productId: string;
  reason: RecommendationReason;
  /** Mastery as it stands, so the UI can show what is at stake. */
  mastery: number;
}

/** The catalogue facts a recommendation needs, resolved by the caller. */
export interface RecommendationCandidate {
  id: string;
  categoryId: string;
  /** Foundational products are where an untouched catalogue should start. */
  foundational: boolean;
}

/**
 * What to study next, in priority order.
 *
 * The ranking is effort against reward rather than lowest mastery first. A
 * product sitting just under the threshold is one good sitting from being
 * finished, which is worth more than grinding at the product the user has
 * struggled with most — and a catalogue the user has not touched should open
 * at something foundational rather than at whatever sorts first.
 *
 * Ties break on mastery and then on id, so the list is stable between renders:
 * a recommendation that reshuffles while being read is worse than a stale one.
 */
export function recommendations(
  candidates: readonly RecommendationCandidate[],
  progress: Readonly<Record<string, ProductProgress | undefined>>,
  limit: number,
): Recommendation[] {
  const nearlyThreshold = masteryWithinOneSession();
  const startedCategories = new Set(
    candidates
      .filter((candidate) => (progress[candidate.id]?.attempts ?? 0) > 0)
      .map((candidate) => candidate.categoryId),
  );

  const scored = candidates.flatMap<Recommendation>((candidate) => {
    const record = progress[candidate.id];
    const mastery = record?.mastery ?? 0;
    const attempted = (record?.attempts ?? 0) > 0;

    if (attempted && mastery >= nearlyThreshold && mastery < MASTERY_COMPLETE) {
      return [{ productId: candidate.id, reason: 'nearly-there', mastery }];
    }
    if (attempted && mastery < 35) {
      return [{ productId: candidate.id, reason: 'shaky', mastery }];
    }
    if (attempted) {
      // Building, or already strong. Neither is the best use of a session
      // while something is one sitting from done or actively shaky.
      return [];
    }
    if (startedCategories.has(candidate.categoryId)) {
      return [{ productId: candidate.id, reason: 'continue-category', mastery }];
    }
    if (candidate.foundational) {
      return [{ productId: candidate.id, reason: 'start-here', mastery }];
    }
    return [];
  });

  const order: Record<RecommendationReason, number> = {
    'nearly-there': 0,
    shaky: 1,
    'continue-category': 2,
    'start-here': 3,
  };

  return scored
    .sort(
      (a, b) =>
        order[a.reason] - order[b.reason] ||
        a.mastery - b.mastery ||
        a.productId.localeCompare(b.productId),
    )
    .slice(0, Math.max(0, limit));
}

export interface StudyConsistency {
  /** Days studied within the window. */
  studied: number;
  /** Length of the window in days, including today. */
  window: number;
  /** 0–100. */
  percent: number;
}

/**
 * How many of the last `window` days had a session.
 *
 * Takes `now` for the same reason `review.ts` does: a figure that silently
 * depends on the wall clock cannot be tested, and this one feeds a claim the
 * user will read as fact.
 */
export function studyConsistency(
  studyDays: readonly string[],
  window: number,
  now: Date = new Date(),
): StudyConsistency {
  const span = Math.max(1, Math.round(window));
  const cutoff = new Date(now.getTime());
  // `span - 1` because the window includes today: a seven-day window runs from
  // six days ago to now, not from seven days ago.
  cutoff.setDate(cutoff.getDate() - (span - 1));
  const cutoffKey = toDateKey(cutoff);
  const todayKey = toDateKey(now);

  const withinWindow = new Set(
    studyDays.filter((day) => day >= cutoffKey && day <= todayKey),
  );
  return {
    studied: withinWindow.size,
    window: span,
    percent: Math.round((withinWindow.size / span) * 100),
  };
}
