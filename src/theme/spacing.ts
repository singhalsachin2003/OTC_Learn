/** 8px-based spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Recurring layout measurements pulled out of the design handoff. */
export const layout = {
  screenPadding: spacing.xl,
  cardPadding: spacing.lg,
  gap: spacing.md,
  /** Minimum touch target — 44pt on iOS, 48dp on Android (48 satisfies both). */
  minTouchTarget: 48,
} as const;

export type SpacingKey = keyof typeof spacing;
