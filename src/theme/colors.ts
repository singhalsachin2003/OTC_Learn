/**
 * Color system.
 *
 * The design prototype specifies every colour in OKLCH. React Native's
 * StyleSheet does not parse `oklch()`, so each token below is the sRGB hex
 * conversion of the original OKLCH value. The source OKLCH is kept in a
 * comment next to each token so the design handoff stays traceable.
 */

export const colors = {
  /** Screen background — oklch(93% .01 90) */
  background: '#EAE8E0',
  /** Card / elevated surface — oklch(98% .008 90) */
  surface: '#FAF8F2',
  /** Pure card white, as used by the prototype's cards */
  card: '#FFFFFF',

  text: {
    /** oklch(20% .01 90) */
    primary: '#181611',
    /** oklch(35% .01 90) — long-form lesson body copy */
    body: '#3C3A35',
    /** oklch(45% .01 90) */
    secondary: '#57554F',
    /** oklch(48% .01 90) — category blurb */
    blurb: '#605D57',
    /** oklch(50% .01 90) — list subtext */
    muted: '#65635D',
    /** oklch(60% .01 90) */
    tertiary: '#82807A',
    /** oklch(80% .01 90) — muted text on the dark streak pill */
    onDarkMuted: '#C0BDB7',
    /** Text on dark fills */
    onDark: '#FFFFFF',
  },

  /** oklch(70% .01 90) — the "›" chevron on product rows */
  chevron: '#A19E98',
  /** oklch(85% .01 90) — outline buttons */
  border: '#D0CEC7',
  /** oklch(90% .01 90) — unfilled lesson step dots */
  trackDot: '#E0DED7',
  /** oklch(92% .01 90) — progress bar track / secondary button fill */
  track: '#E7E4DD',
  /** oklch(30% .01 90) — secondary button label */
  secondaryButtonText: '#302E28',
  /** oklch(20% .01 90) — primary (dark) button fill */
  dark: '#181611',
  /** oklch(60% .12 250) — home progress bar fill */
  progressFill: '#4284C5',

  success: {
    /** oklch(55% .12 160) */
    base: '#118659',
    /** oklch(60% .12 160) — completed checkmark badge */
    strong: '#2B9667',
    /** oklch(35% .12 160) — feedback text */
    text: '#004C23',
    /** oklch(97% .03 160) — True button fill */
    bgSoft: '#E5FCEE',
    /** oklch(96% .03 160) — correct feedback box */
    bgFeedback: '#E1F8EB',
  },

  error: {
    /** oklch(55% .12 20) */
    base: '#AC5154',
    /** oklch(60% .12 20) — False button border */
    strong: '#BD6062',
    /** oklch(38% .13 20) — feedback text */
    text: '#791824',
    /** oklch(97% .03 20) — False button fill */
    bgSoft: '#FFEEED',
    /** oklch(96% .03 20) — incorrect feedback box */
    bgFeedback: '#FFEAE9',
  },
} as const;

/**
 * Per-category accent pairs. `accent` is oklch(55% .13 hue) and `soft` is
 * oklch(93% .04 hue) for the matching hue of each asset class.
 */
export const categoryColors = {
  /** hue 250 — blue */
  ir: { accent: '#2A75BA', soft: '#D4EBFF' },
  /** hue 160 — teal */
  fx: { accent: '#008856', soft: '#D2F1DF' },
  /** hue 20 — red */
  credit: { accent: '#B14D51', soft: '#FFDEDD' },
  /** hue 300 — purple */
  equity: { accent: '#7E5DB1', soft: '#ECE2FF' },
  /** hue 80 — amber */
  commodity: { accent: '#996700', soft: '#F6E6CB' },
} as const;

export type CategoryColorKey = keyof typeof categoryColors;

/**
 * Mastery bands. The same three thresholds drive the ring fill, the percentage
 * colour and the word shown beside it, so they live together rather than being
 * re-derived at each call site.
 */
export const masteryColors = {
  /** oklch(55% .12 160) — 70% and above */
  strong: colors.success.base,
  /** oklch(60% .12 250) — 35% to 70% */
  building: colors.progressFill,
  /** oklch(55% .10 60) — below 35% but started */
  shaky: '#A06A2C',
  /** Nothing attempted yet */
  none: colors.text.tertiary,
} as const;

/** Bottom tab bar. */
export const tabColors = {
  background: colors.surface,
  border: colors.border,
  active: colors.text.primary,
  inactive: colors.text.tertiary,
} as const;

const FALLBACK_ACCENT = { accent: colors.text.primary, soft: colors.track };

/** Look up a category's accent pair, falling back to neutral for unknown ids. */
export function getCategoryColors(categoryId: string): {
  accent: string;
  soft: string;
} {
  return categoryColors[categoryId as CategoryColorKey] ?? FALLBACK_ACCENT;
}
