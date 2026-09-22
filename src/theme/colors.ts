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
    /**
     * oklch(51% .01 90) — captions, eyebrows and every `typography.micro` label.
     *
     * Darkened from the handoff's oklch(60% .01 90) / #82807A, which measured
     * 3.22:1 on the app background and so failed WCAG AA's 4.5:1 for small
     * text — and it was carrying the *smallest* type in the app, which needs
     * more contrast than body copy, not less. This value clears AA on all
     * four surfaces: 4.67 on background, 5.73 on card, 5.40 on surface and 4.52
     * on `track`, which the first pass did not include — the achievements grid
     * draws this on exactly that fill and landed at 4.45.
     */
    tertiary: '#686661',
    /** oklch(80% .01 90) — muted text on the dark streak pill */
    onDarkMuted: '#C0BDB7',
    /** Text on dark fills */
    onDark: '#FFFFFF',
    /**
     * Text on `primaryFill` — the one fill that inverts with the theme. Equal
     * to `onDark` here; see the dark palette for why they have to be separate.
     */
    onPrimary: '#FFFFFF',
  },

  /**
   * The "›" chevron on product rows — oklch(62% .011 90).
   *
   * Darkened from the handoff's oklch(70%) / #A19E98, which measured 2.18:1 on
   * the app background. It is an affordance rather than prose — it says the row
   * is tappable and nothing else — so the bar that applies is WCAG's 3:1 for
   * non-text contrast, not 4.5:1, and it stays deliberately lighter than
   * `text.tertiary` so it reads as a marker beside a label rather than as
   * another word in it. 3.00:1 on background, 3.69 on a white card.
   */
  chevron: '#88857D',
  /** oklch(85% .01 90) — outline buttons */
  border: '#D0CEC7',

  /**
   * Hairlines and unfilled tracks, separated from `track` because they have to
   * work on two grounds. `track` is oklch(92%) and was chosen against a white
   * card; on the oklch(93%) page background it lands at 1.03:1 and vanishes,
   * which is why the rings on the product and home screens read as a number
   * floating in space. Use `soft` on white, `base` anywhere on the background.
   */
  line: {
    /** oklch(91% .01 90) — on a white card */
    soft: '#E4E1DA',
    /** oklch(88% .012 90) — on the page background */
    base: '#DAD7CF',
    /** oklch(84% .014 90) — when the ring is the point of the component */
    strong: '#CECAC0',
  },
  /** oklch(90% .01 90) — unfilled lesson step dots */
  trackDot: '#E0DED7',
  /** oklch(92% .01 90) — progress bar track / secondary button fill */
  track: '#E7E4DD',
  /** oklch(30% .01 90) — secondary button label */
  secondaryButtonText: '#302E28',
  /** oklch(20% .01 90) — primary (dark) button fill */
  dark: '#181611',
  /**
   * The "on" state: the primary button, a selected chip, an earned badge.
   *
   * The same value as `dark` in this theme, and a separate token only because
   * the two part company in the other one — a selected thing should be the
   * highest-contrast surface on the screen, and on a dark ground that means
   * pale, while `dark` stays dark because it also fills whole cards.
   */
  primaryFill: '#181611',
  /** oklch(60% .12 250) — home progress bar fill */
  progressFill: '#4284C5',
  /**
   * Darkened variant of progressFill for text use — 5.31:1 on white,
   * against progressFill's own 3.93:1. progressFill was chosen as a fill
   * colour (rings, bars) and never contrast-checked for the small stat
   * figures it also got reused as a tint for; this token is what those
   * call sites should use instead.
   */
  progressFillText: '#2E6FA8',

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
 * The shape both palettes have to satisfy, derived from the light one so the
 * dark one cannot drift: adding a token to `colors` without adding it to
 * `darkColors` is a type error rather than a screen that renders `undefined`.
 */
type Themed<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : Themed<T[K]>;
};

export type Colors = Themed<typeof colors>;

/**
 * Per-category accent pairs. `accent` is oklch(55% .13 hue) and `soft` is
 * oklch(93% .04 hue) for the matching hue of each asset class.
 *
 * `text` is a separate, darkened variant for the same hue, only for where
 * the accent is rendered as small text (the glossary's source label,
 * currently) rather than a ring, icon or badge fill. `accent` itself was
 * chosen for those fills and was never contrast-checked as text — at
 * `typography.micro` on `colors.background` every one of the five hue
 * accents falls short of WCAG AA's 4.5:1 (3.7–4.2:1); `text` clears it with
 * margin (4.8:1+) on both the page background and a white card. Foundations
 * needs no separate variant — its slate accent already clears both as text.
 */
export const categoryColors = {
  /** hue 250 — blue */
  ir: { accent: '#2A75BA', soft: '#D4EBFF', text: '#2465A1' },
  /** hue 160 — teal */
  fx: { accent: '#008856', soft: '#D2F1DF', text: '#006E46' },
  /** hue 20 — red */
  credit: { accent: '#B14D51', soft: '#FFDEDD', text: '#A3474A' },
  /** hue 300 — purple */
  equity: { accent: '#7E5DB1', soft: '#ECE2FF', text: '#7351A8' },
  /** hue 80 — amber */
  commodity: { accent: '#996700', soft: '#F6E6CB', text: '#855900' },
  /**
   * Slate — oklch(45% .03 250) on oklch(93% .012 250).
   *
   * Deliberately not a sixth hue on the wheel. The five above are asset
   * classes, peers of one another; Market Foundations is the infrastructure all
   * five run through, and giving it a rainbow accent would file it as a sixth
   * market. A desaturated slate says "different in kind" — and, unlike the five,
   * it clears WCAG AA as text on its own tint (6.04:1) and on a white card
   * (7.40:1).
   */
  foundations: { accent: '#495766', soft: '#E2E9F0', text: '#495766' },
  /**
   * hue 340 — plum. The widest gap left on the wheel once the five asset
   * classes had taken 20, 80, 160, 250 and 300, and far enough from credit's
   * red to read as a different family rather than a shade of it. `text` is the
   * darkened variant: the accent itself clears AA on white but only reaches
   * 4.19:1 on its own tint, which is the mistake the design review caught in
   * the original five.
   */
  exotics: { accent: '#A25089', soft: '#F7E1EE', text: '#92417A' },
  /**
   * hue 205 — teal. The other wide gap, between FX at 160 and Interest Rate at
   * 250. `text` is two lightness steps below the accent rather than one,
   * because at 50% it reaches only 4.38:1 on its own tint and AA wants 4.5.
   */
  risk: { accent: '#008695', soft: '#D2EEF1', text: '#007080' },
  /**
   * hue 120 — olive. The last wide gap, between commodity's amber at 80 and
   * FX's teal at 160. Not the app's success green, which is a semantic colour
   * and lives at a different chroma.
   */
  cases: { accent: '#687C02', soft: '#E5EBD5', text: '#5A6D00' },
  /**
   * hue 45 — terracotta. The wheel is now full: 20, 45, 80, 120, 160, 205, 250,
   * 300 and 340 are taken, and the two gaps left are 25° wide. A tenth category
   * needs a different strategy — a second neutral, as Market Foundations did,
   * or a change of lightness rather than of hue.
   */
  alt: { accent: '#AE5528', soft: '#FAE2D8', text: '#9D4616' },
} as const;

export type CategoryColorKey = keyof typeof categoryColors;
export type CategoryAccent = { accent: string; soft: string; text: string };
export type CategoryColors = Themed<typeof categoryColors>;

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

export type MasteryColors = Themed<typeof masteryColors>;

/** Bottom tab bar. */
export const tabColors = {
  background: colors.surface,
  border: colors.border,
  active: colors.text.primary,
  inactive: colors.text.tertiary,
} as const;

export type TabColors = Themed<typeof tabColors>;

/**
 * Look up a category's accent pair, falling back to neutral for unknown ids.
 *
 * Curried over the palette rather than reading a module singleton, so the
 * lookup a screen calls is the one belonging to the theme it is rendering in.
 * `getCategoryColors` stays exported as the light-theme binding, for tests and
 * for the generated site scripts, which have no theme to read.
 */
export function makeCategoryLookup(
  set: CategoryColors,
  neutral: Colors,
): (categoryId: string) => CategoryAccent {
  const fallback: CategoryAccent = {
    accent: neutral.text.primary,
    soft: neutral.track,
    text: neutral.text.primary,
  };
  return (categoryId) => set[categoryId as CategoryColorKey] ?? fallback;
}

export const getCategoryColors = makeCategoryLookup(categoryColors, colors);

// ---------------------------------------------------------------------------
// Dark

/**
 * The dark palette.
 *
 * Derived the same way the light one was — every token below is the sRGB
 * conversion of an OKLCH value, with the source kept in the comment beside it —
 * and, like the light palette, contrast-checked rather than eyeballed. The
 * ratios quoted are against `background`; where a token also has to work on
 * `surface` and `card` the lowest of the three is the one quoted.
 *
 * Two decisions worth knowing, because they are not what an inversion would do:
 *
 *  1. **It is warm, not black.** The light theme's ground is oklch(93% .01 90),
 *     a warm cream, and the identity is that warmth. The dark ground is the same
 *     hue and chroma at 18% rather than a neutral charcoal, which is why
 *     `background` is `#14110C` and not `#111111`.
 *  2. **`dark` stays dark.** It is the primary-button and resume-card fill, and
 *     `text.onDark` is what sits on it — but `text.onDark` also sits on the
 *     success, error and category-accent fills, which stay coloured in either
 *     theme. Inverting `dark` to a light fill would therefore need white text in
 *     one place and near-black in another from the same token. It becomes a
 *     *raised* warm fill instead, at oklch(34%) against the 18% ground: white on
 *     it reads 11.73:1, and a large pale slab never appears
 *     where the eye lands first.
 */
export const darkColors: Colors = {
  /** Screen background — oklch(18% .012 90) */
  background: '#14110C',
  /** Card / elevated surface — oklch(23% .012 90) */
  surface: '#1F1D17',
  /** The counterpart of the light theme's pure white card — oklch(26% .012 90) */
  card: '#26241D',

  text: {
    /** oklch(96.5% .006 90) — 14.01:1 on a card */
    primary: '#F5F3EF',
    /** oklch(90% .008 90) — long-form lesson body copy, 11.54:1 on a card */
    body: '#E0DED8',
    /** oklch(82% .008 90) — 8.90:1 on a card */
    secondary: '#C6C4BE',
    /** oklch(78% .01 90) — category blurb, 7.75:1 on a card */
    blurb: '#BAB7B0',
    /** oklch(76% .01 90) — list subtext, 7.24:1 on a card */
    muted: '#B3B1AA',
    /**
     * oklch(74% .01 90) — captions, eyebrows and every `typography.micro` label.
     *
     * The light palette's note applies here in reverse: this carries the
     * smallest type in the app, so it is lifted further from the ground than
     * body copy rather than less. 8.19 on background,
     * 7.33 on surface, 6.76 on card.
     */
    tertiary: '#ADABA4',
    /** oklch(80% .01 90) — muted text on the dark streak pill */
    onDarkMuted: '#C0BDB7',
    /** Text on dark fills. Unchanged: the fills it sits on are dark in both themes. */
    onDark: '#FFFFFF',
    /** oklch(20% .01 90) — near-black, because `primaryFill` inverts here. 14.3:1 on it. */
    onPrimary: '#181611',
  },

  /** oklch(66% .012 90) — the "›" chevron on product rows, 5.0:1 on a card */
  chevron: '#95928A',
  /** oklch(36% .012 90) — outline buttons */
  border: '#3F3D36',

  /**
   * The same three-way split as the light palette, for the same reason: a
   * hairline tuned against one ground disappears on another. On dark the
   * lightness runs the other way — a rule is *lighter* than what it sits on.
   */
  line: {
    /** oklch(32% .01 90) — on a card */
    soft: '#35332D',
    /** oklch(35% .012 90) — on the page background */
    base: '#3D3A34',
    /** oklch(42% .014 90) — when the ring is the point of the component */
    strong: '#504D45',
  },
  /** oklch(33% .01 90) — unfilled lesson step dots */
  trackDot: '#373530',
  /** oklch(35% .01 90) — progress bar track / secondary button fill */
  track: '#3C3A35',
  /** oklch(93% .008 90) — secondary button label */
  secondaryButtonText: '#EAE8E2',
  /** oklch(34% .012 90) — the resume card and the profile avatar; see the note above */
  dark: '#3A3831',
  /**
   * oklch(92% .012 90) — the half of `dark` that *does* invert: a
   * selected chip, an earned badge, the primary button. They are the one thing
   * on the screen that should be impossible to miss, which on a dark ground
   * means pale: 14.9:1 against the background, with near-black text on it.
   */
  primaryFill: '#E8E4DC',
  /** oklch(68% .12 250) — home progress bar fill, 6.58:1 */
  progressFill: '#5B9DDF',
  /** oklch(76% .11 250) — the same blue where it is used as small text, 7.25:1 on a card */
  progressFillText: '#79B6F4',

  success: {
    /** oklch(70% .12 160) — 7.43:1 */
    base: '#50B584',
    /** oklch(60% .13 160) — completed checkmark badge; white on it is 3.72:1, a graphical element at 3:1 */
    strong: '#179765',
    /** oklch(86% .1 160) — feedback text, 10.75:1 on its own feedback box */
    text: '#95E6BB',
    /** oklch(27% .05 160) — True button fill */
    bgSoft: '#0B2E1E',
    /** oklch(25% .045 160) — correct feedback box */
    bgFeedback: '#0A281A',
  },

  error: {
    /** oklch(70% .12 20) — 6.66:1 */
    base: '#DF7E7F',
    /** oklch(62% .13 20) — False button border */
    strong: '#C86265',
    /** oklch(86% .09 20) — feedback text, 10.05:1 on its own feedback box */
    text: '#FFBAB9',
    /** oklch(27% .05 20) — False button fill */
    bgSoft: '#3B1C1C',
    /** oklch(25% .045 20) — incorrect feedback box */
    bgFeedback: '#341819',
  },
};

/**
 * Per-category accent pairs for the dark theme.
 *
 * The light set runs accent oklch(55% .13 h) with a 93% tint; this one runs
 * accent oklch(72% .13 h) with a 29% tint, so the relationship between the two
 * halves is preserved and the wheel positions are untouched — the hues are the
 * catalogue's identity and do not change with the theme.
 *
 * `text` is still a separate variant for small text, but it runs the other way:
 * *lighter* than the accent rather than darker, because on dark the direction of
 * safety is up. Every one of them clears WCAG AA on its own tint and on all
 * three dark grounds.
 */
export const darkCategoryColors: CategoryColors = {
  /** hue 250 — blue. `text` is 7.48:1 on its own tint, 10.0:1 on the ground. */
  ir: { accent: '#60AAF3', soft: '#172D43', text: '#80C3FF' },
  /** hue 160 — teal. `text` is 7.79:1 on its own tint, 10.6:1 on the ground. */
  fx: { accent: '#4CBD88', soft: '#113323', text: '#71D6A3' },
  /** hue 20 — red. `text` is 7.22:1 on its own tint, 9.5:1 on the ground. */
  credit: { accent: '#EB8182', soft: '#412121', text: '#FF9D9E' },
  /** hue 300 — purple. `text` is 7.44:1 on its own tint, 9.7:1 on the ground. */
  equity: { accent: '#B191EA', soft: '#2F2540', text: '#CAACFF' },
  /** hue 80 — amber. `text` is 7.54:1 on its own tint, 10.0:1 on the ground. */
  commodity: { accent: '#CF9A35', soft: '#38280A', text: '#E6B55D' },
  /**
   * Slate — the same "different in kind, not a sixth market" decision as the
   * light palette, lifted to oklch(74% .03 250) on an oklch(29% .02 250) tint.
   * As in light, the accent needs no separate text variant: 6.16:1 on its
   * own tint and 6.77:1 on a card.
   */
  foundations: { accent: '#9DADBE', soft: '#242C35', text: '#9DADBE' },
  /** hue 340 — plum. `text` is 7.32:1 on its own tint, 9.6:1 on the ground. */
  exotics: { accent: '#DA83BE', soft: '#3C2133', text: '#F19FD6' },
  /** hue 205 — teal. `text` is 7.78:1 on its own tint, 10.5:1 on the ground. */
  risk: { accent: '#00BBCB', soft: '#003237', text: '#44D4E2' },
  /** hue 120 — olive. `text` is 7.66:1 on its own tint, 10.3:1 on the ground. */
  cases: { accent: '#9AB04B', soft: '#282F10', text: '#B4C96D' },
  /** hue 45 — terracotta. `text` is 7.36:1 on its own tint, 9.7:1 on the ground. */
  alt: { accent: '#E7885D', soft: '#402315', text: '#FEA47C' },
};

/** Mastery bands, dark. Same thresholds, same meaning, lifted hues. */
export const darkMasteryColors: MasteryColors = {
  /** oklch(70% .12 160) — 70% and above */
  strong: darkColors.success.base,
  /** oklch(68% .12 250) — 35% to 70% */
  building: darkColors.progressFill,
  /** oklch(74% .1 60) — below 35% but started */
  shaky: '#D99C68',
  /** Nothing attempted yet */
  none: darkColors.text.tertiary,
};

/** Bottom tab bar, dark. */
export const darkTabColors: TabColors = {
  background: darkColors.surface,
  border: darkColors.border,
  active: darkColors.text.primary,
  inactive: darkColors.text.tertiary,
};

// ---------------------------------------------------------------------------
// Palettes

/**
 * Everything a screen needs to paint itself in one theme. Screens take this,
 * never a module-level colour object, so the same `StyleSheet` factory produces
 * a light sheet or a dark one depending only on what it is handed.
 */
export interface Palette {
  scheme: 'light' | 'dark';
  colors: Colors;
  categoryColors: CategoryColors;
  masteryColors: MasteryColors;
  tabColors: TabColors;
  getCategoryColors: (categoryId: string) => CategoryAccent;
}

export const lightPalette: Palette = {
  scheme: 'light',
  colors,
  categoryColors,
  masteryColors,
  tabColors,
  getCategoryColors,
};

export const darkPalette: Palette = {
  scheme: 'dark',
  colors: darkColors,
  categoryColors: darkCategoryColors,
  masteryColors: darkMasteryColors,
  tabColors: darkTabColors,
  getCategoryColors: makeCategoryLookup(darkCategoryColors, darkColors),
};
