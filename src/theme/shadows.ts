import type { ViewStyle } from 'react-native';

/**
 * The design uses a single, subtle card shadow everywhere:
 * `0 1px 3px rgba(0,0,0,.05)`.
 */
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
