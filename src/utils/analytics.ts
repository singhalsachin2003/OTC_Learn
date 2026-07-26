/**
 * Analytics facade.
 *
 * v1.0 ships fully offline with no analytics provider wired up, so this is a
 * no-op sink with a stable call surface. To enable a provider later, implement
 * `sink` — every call site already routes through `track`.
 */

export type AnalyticsEvent =
  | { name: 'category_opened'; categoryId: string }
  | { name: 'lesson_started'; productId: string }
  | { name: 'lesson_completed'; productId: string }
  | { name: 'quiz_started'; productId: string }
  | {
      name: 'quiz_answered';
      productId: string;
      questionId: string;
      correct: boolean;
    }
  | { name: 'quiz_completed'; productId: string; score: number; total: number };

type Sink = (event: AnalyticsEvent) => void;

let sink: Sink | null = null;

/** Installs a delivery function (e.g. a Sentry or Firebase adapter). */
export function setAnalyticsSink(next: Sink | null): void {
  sink = next;
}

export function track(event: AnalyticsEvent): void {
  sink?.(event);
}
