import type { ViewStyle } from 'react-native';

/**
 * The design uses a single, subtle card shadow everywhere:
 * `0 1px 3px rgba(0,0,0,.05)`.
 *
 * The iOS properties describe that shadow exactly. `elevation` cannot: Android
 * derives its own shadow from the value, ignoring colour, offset and opacity,
 * and at 2 it draws something far heavier and greyer than the spec — which is
 * what made the cards look muddy on device. 1 is the closest Android gets to a
 * 5%-opacity hairline shadow. The two platforms will never match perfectly
 * here; the point is that neither should look wrong.
 */
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const satisfies Record<string, ViewStyle>;

export type ShadowKey = keyof typeof shadows;
