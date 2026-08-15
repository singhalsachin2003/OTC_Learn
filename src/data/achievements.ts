import type { ProductProgress } from '../utils/mastery';
import { MASTERY_COMPLETE } from '../utils/mastery';
import { categories } from './categories';
import { products } from './products';

/**
 * Achievements are derived, never stored as a running tally: each one is a
 * predicate over the progress the app already keeps. That means they cannot
 * drift out of step with the underlying numbers, and a user who resets their
 * progress loses the badges with it rather than keeping orphans.
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  /** Two or three characters — rendered in the badge, not an image. */
  glyph: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first-quiz',
    name: 'First trade',
    description: 'Finish your first quiz.',
    glyph: '01',
  },
  {
    id: 'perfect-score',
    name: 'Clean sweep',
    description: 'Answer every question in a sitting correctly.',
    glyph: '★',
  },
  {
    id: 'week-streak',
    name: 'Seven sessions',
    description: 'Study on seven consecutive days.',
    glyph: '7',
  },
  {
    id: 'month-streak',
    name: 'Thirty days',
    description: 'Study on thirty consecutive days.',
    glyph: '30',
  },
  {
    id: 'hundred-questions',
    name: 'Century',
    description: 'Answer one hundred questions.',
    glyph: '100',
  },
  {
    id: 'sharp',
    name: 'Sharp',
    description: 'Hold 90% accuracy across at least fifty questions.',
    glyph: '90',
  },
  {
    id: 'asset-class',
    name: 'Desk head',
    description: 'Reach strong mastery on every product in one asset class.',
    glyph: '◆',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Attempt at least one quiz in every category.',
    glyph: '◇',
  },
  {
    id: 'full-book',
    name: 'Full book',
    description: 'Reach strong mastery on every product.',
    glyph: '∞',
  },
];

export interface AchievementInput {
  progress: Readonly<Record<string, ProductProgress | undefined>>;
  currentStreak: number;
  longestStreak: number;
  questionsAnswered: number;
  questionsCorrect: number;
  /** Score percentage of the session just finished, if one just finished. */
  lastSessionPct?: number;
}

/** Ids of every achievement the current state satisfies. */
export function earnedAchievements(input: AchievementInput): string[] {
  const {
    progress,
    longestStreak,
    questionsAnswered,
    questionsCorrect,
    lastSessionPct,
  } = input;

  const attempted = products.filter((p) => (progress[p.id]?.attempts ?? 0) > 0);
  const mastered = products.filter(
    (p) => (progress[p.id]?.mastery ?? 0) >= MASTERY_COMPLETE,
  );
  const attemptedCategories = new Set(attempted.map((p) => p.categoryId));
  const accuracy =
    questionsAnswered === 0 ? 0 : (questionsCorrect / questionsAnswered) * 100;

  const earned: string[] = [];
  const award = (id: string, when: boolean) => {
    if (when) {
      earned.push(id);
    }
  };

  award('first-quiz', attempted.length > 0);
  award('perfect-score', lastSessionPct === 100);
  award('week-streak', longestStreak >= 7);
  award('month-streak', longestStreak >= 30);
  award('hundred-questions', questionsAnswered >= 100);
  award('sharp', questionsAnswered >= 50 && accuracy >= 90);
  award(
    'asset-class',
    categories.some((category) => {
      const inClass = products.filter((p) => p.categoryId === category.id);
      return (
        inClass.length > 0 &&
        inClass.every((p) => (progress[p.id]?.mastery ?? 0) >= MASTERY_COMPLETE)
      );
    }),
  );
  award('explorer', attemptedCategories.size === categories.length);
  award('full-book', mastered.length === products.length);

  return earned;
}

const achievementsById = new Map(achievements.map((a) => [a.id, a]));

export function getAchievementById(id: string): Achievement | undefined {
  return achievementsById.get(id);
}
