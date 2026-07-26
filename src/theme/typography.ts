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
  /** Screen titles — 22px / 800 */
  h1: {
    fontFamily: fontFamily.extrabold,
    fontSize: 22,
    lineHeight: 28,
  },
  /** Section headings — 19px / 800 */
  h2: {
    fontFamily: fontFamily.extrabold,
    fontSize: 19,
    lineHeight: 24,
  },
  /** Card titles — 18px / 800 */
  h3: {
    fontFamily: fontFamily.extrabold,
    fontSize: 18,
    lineHeight: 23,
  },
  /** Question text — 18px / 800, looser leading */
  question: {
    fontFamily: fontFamily.extrabold,
    fontSize: 18,
    lineHeight: 25,
  },
  /** Main body copy — 14.5px / 500 at 1.6 leading */
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: 14.5,
    lineHeight: 23,
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
  /** List subtext — 11.5px / 500 */
  labelSmall: {
    fontFamily: fontFamily.regular,
    fontSize: 11.5,
    lineHeight: 15,
  },
  /** Tags — 9px / 600 with 3% tracking */
  micro: {
    fontFamily: fontFamily.semibold,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.27,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyKey = keyof typeof typography;
