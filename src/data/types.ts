/** Domain types for the OTC derivatives learning content. */

/** Step index within a product's lesson. Every product has exactly 3 steps. */
export type LessonStepNumber = 1 | 2 | 3;

export interface Lesson {
  step: LessonStepNumber;
  title: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: boolean;
  explanation: string;
}

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
  lessons: Lesson[];
  quiz: QuizQuestion[];
}
