import type { TextStyle } from 'react-native';

/**
 * Plus Jakarta Sans is loaded via `@expo-google-fonts/plus-jakarta-sans`
 * (see `useAppFonts`). React Native cannot synthesise numeric weights for a
 * custom family, so each weight is a separately registered family name.
 */
export const fontFamily = {
  regular: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const fontWeight = {
  regular: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

/** Named text styles from the design handoff. */
export const typography = {
  /**
   * Screen titles — 22px / 700.
   *
   * Down from 800. Setting every level above body at ExtraBold flattens the
   * hierarchy it was meant to create — when everything shouts, size is doing
   * all the work — and reads promotional rather than editorial. Weight is now
   * a signal again: 800 is reserved for the quiz question.
   */
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  /** Section headings — 19px / 700 */
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 19,
    lineHeight: 24,
  },
  /** Card titles — 17px / 700. One step below h2, not one pixel below it. */
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    lineHeight: 22,
  },
  /** Question text — 19px / 800, looser leading. The focal text of the app. */
  question: {
    fontFamily: fontFamily.extrabold,
    fontSize: 19,
    lineHeight: 26,
  },
  /** Main body copy — 15px / 500 at 1.6 leading */
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  /** Secondary body copy — 14px / 500 */
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  /** Result subtext — 14px / 600 */
  bodyStrong: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 21,
  },
  /** Labels and back links — 13px / 700 */
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 17,
  },
  /** List subtext — 12px / 500 */
  labelSmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  /**
   * Eyebrows, captions and tags — 10.5px / 600 with 6% tracking.
   *
   * Raised from 9px: this style carries every section header in the app
   * ("KEY TERMS", "INTEREST RATE", "DAY STREAK"), and at 9px those read as
   * decoration rather than as structure. The wider tracking is what lets an
   * all-caps run of this size stay legible.
   */
  micro: {
    fontFamily: fontFamily.semibold,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 0.63,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyKey = keyof typeof typography;

/**
 * Spread onto any Text that renders a figure — percentages, scores, streak
 * counts, stat tiles, timers.
 *
 * Proportional digits are set to look right inside words, which means a `1` is
 * narrower than a `0`. In a column of numbers that makes the column ragged, and
 * in a value that updates it makes the text shuffle sideways as it changes. An
 * app about derivatives should not have jittering numbers.
 */
export const tabularNumbers = {
  fontVariant: ['tabular-nums'],
} as const satisfies TextStyle;
