/**
 * Border radius scale.
 *
 * Five steps, deliberately fewer than the seven this started with: 8/11 and
 * 18/22/24 were pairs and triples nobody could tell apart at the sizes they
 * were used, so they cost a decision at every call site and bought nothing.
 *
 * The card radius came down from 18 to 14. Soft corners in the 18–24 range are
 * the silhouette of a consumer habit-tracker; the reference tools this app sits
 * beside — terminals, research portals, the financial press — sit far tighter.
 * 14 is about as soft as this can be and still read as a professional tool.
 */
export const radius = {
  /** Progress-bar caps, dense chips */
  xs: 4,
  /** Tags, badges, small markers */
  sm: 6,
  /** Buttons, inputs, stat tiles */
  md: 10,
  /** Cards and content surfaces */
  lg: 14,
  /** Fully rounded — toggles, avatars, pills */
  pill: 999,

  // Legacy aliases, kept so the migration lands in one commit rather than
  // touching thirty call sites at once. Prefer the five names above.
  /** @deprecated use `sm` */
  small: 6,
  /** @deprecated use `md` */
  medium: 10,
  /** @deprecated use `lg` — buttons, rows and cards share one radius */
  large: 14,
  /** @deprecated use `lg` */
  xl: 14,
  /** @deprecated use `lg` */
  xxl: 14,
  /** @deprecated use `lg` */
  xxxl: 14,
} as const;

export type RadiusKey = keyof typeof radius;
