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
}

/** Narrowing helpers — the quiz UI branches on question kind. */
export function isChoiceQuestion(q: Question): q is MultipleChoiceQuestion {
  return q.kind === 'choice';
}

export function isBooleanQuestion(q: Question): q is TrueFalseQuestion {
  return q.kind === 'boolean';
}
