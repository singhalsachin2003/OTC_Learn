/** Domain types for the OTC derivatives learning content. */

/** Step index within a product's lesson. Every product has exactly 5 steps. */
export type LessonStepNumber = 1 | 2 | 3 | 4 | 5;

/**
 * How demanding a product or question is. Drives the difficulty pill on the
 * product row and lets a quiz draw an easier paper for a first attempt.
 */
export type Difficulty = 'foundational' | 'intermediate' | 'advanced';

export interface Lesson {
  step: LessonStepNumber;
  title: string;
  content: string;
  /**
   * A short aside pinned under the body — a number, a market convention, a
   * warning. Optional: only steps with something concrete to add carry one.
   */
  callout?: string;
}

/** A term worth knowing, surfaced both in-lesson and in the global glossary. */
export interface KeyTerm {
  term: string;
  definition: string;
}

/**
 * A numbers-on-the-page walkthrough. `lines` are rendered as a sequence, so
 * each one should read as a complete statement rather than a fragment.
 */
export interface WorkedExample {
  title: string;
  lines: string[];
  takeaway: string;
}

interface QuestionBase {
  id: string;
  /** The lesson step this tests, so results can break down by theme. */
  step: LessonStepNumber;
  difficulty: Difficulty;
  /** Shown after answering, whether the answer was right or wrong. */
  explanation: string;
}

export interface TrueFalseQuestion extends QuestionBase {
  kind: 'boolean';
  prompt: string;
  correctAnswer: boolean;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  kind: 'choice';
  prompt: string;
  /** Exactly four, all distinct. Order is shuffled at session time. */
  options: string[];
  /** Index into `options` as authored; the shuffle moves it with them. */
  correctIndex: number;
}

export type Question = TrueFalseQuestion | MultipleChoiceQuestion;

export interface Category {
  id: string;
  name: string;
  description: string;
  /** Source OKLCH accent, kept for design traceability. */
  accentColor: string;
  /** Two-letter identifier rendered inside the category icon (IR, FX, …). */
  icon: string;
  /**
   * Whether this asset class is part of the subscription rather than the free
   * catalogue. Required, and deliberately so: a new asset class is the one
   * thing a subscription buys, so whoever adds one has to decide which side of
   * the line it falls on. Leaving it to a default would answer the question
   * silently, in whichever direction the default happened to point.
   *
   * Every category that shipped before the paywall is `false` and stays that
   * way — see `utils/access.ts`.
   */
  premium: boolean;
}

/**
 * One section of a product's paid depth. Deliberately not a `Lesson`: it has no
 * step number, because the five-step lesson is what the product shipped with
 * and its numbering is a promise to anyone who already learned it. Depth reads
 * as further sections on the product page, after the lesson rather than inside
 * it.
 */
export interface DepthSection {
  title: string;
  content: string;
  callout?: string;
}

/**
 * The extra material a subscription adds to a product that is otherwise free.
 *
 * This is the one place the model needed care. A subscription buys what is
 * added *after* the paywall — so adding to an existing product is allowed, and
 * taking anything out of one is not. `Product.lessons` and `Product.quiz` are
 * exactly what shipped and stay open to everybody;
 * `__tests__/utils/accessShippedCatalogue.test.ts` asserts every one of those
 * question ids is still answerable by a user the paywall applies to.
 */
export interface ProductDepth {
  /** Further reading, shown on the product page under "Going deeper". */
  sections: DepthSection[];
  /**
   * A second bank, the same size as the first. A subscriber's quiz draws from
   * both, so the paper varies more and runs harder; a free reader's draw is
   * unchanged.
   */
  quiz: Question[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  /** One-line description shown under the product name in lists. */
  hook: string;
  /** A paragraph of orientation, shown before the lesson begins. */
  summary: string;
  difficulty: Difficulty;
  lessons: Lesson[];
  keyTerms: KeyTerm[];
  example: WorkedExample;
  /** Who actually trades this, and why — one or two sentences. */
  inPractice: string;
  /** Products worth reading next. Ids must resolve within the catalogue. */
  relatedProductIds: string[];
  /**
   * The full question bank. A quiz session draws a subset, so this is
   * deliberately larger than any one sitting.
   */
  quiz: Question[];
  /** Extra sections and a second bank, sold with the subscription. */
  depth?: ProductDepth;
}

/** Narrowing helpers — the quiz UI branches on question kind. */
export function isChoiceQuestion(q: Question): q is MultipleChoiceQuestion {
  return q.kind === 'choice';
}

export function isBooleanQuestion(q: Question): q is TrueFalseQuestion {
  return q.kind === 'boolean';
}
