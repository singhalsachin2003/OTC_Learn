/** Border radius scale. */
export const radius = {
  /** Tags, badges */
  small: 8,
  /** Icon badges */
  medium: 11,
  /** Buttons, small cards */
  large: 16,
  /** Standard cards */
  xl: 18,
  /** Large content cards */
  xxl: 22,
  /** Results badge */
  xxxl: 24,
  /** Fully rounded */
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radius;
