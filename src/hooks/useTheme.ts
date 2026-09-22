import { useColorScheme } from 'react-native';

import {
  darkPalette,
  lightPalette,
  type Colors,
  type Palette,
} from '../theme/colors';
import { useAppSelector } from './useAppState';

/**
 * The palette for right now: the reader's preference, falling back to the OS.
 *
 * A hook rather than a context, deliberately. Both halves of the answer are
 * already global — the Redux store and `useColorScheme()` — so a provider would
 * add an ordering constraint without adding a capability, and every existing
 * test would have to be wrapped in one. `renderWithStore` keeps working
 * unchanged, and a test that wants dark mode dispatches `setTheme('dark')`.
 *
 * `useColorScheme()` returns null while the OS value is unknown, which is the
 * same thing as no preference: light.
 */
export function useTheme(): Palette {
  const preference = useAppSelector((state) => state.settings.settings.theme);
  const system = useColorScheme();
  const scheme = preference === 'system' ? (system ?? 'light') : preference;
  return scheme === 'dark' ? darkPalette : lightPalette;
}

/** For the call sites that want colours and nothing else. */
export function useColors(): Colors {
  return useTheme().colors;
}

/**
 * Cache of built stylesheets, keyed by factory and then by palette.
 *
 * `StyleSheet.create` is cheap but not free, and these factories are called by
 * every mounted screen and row. Keying on the factory means each module's sheet
 * is built at most twice for the life of the process — once per palette —
 * rather than once per component instance, which is what a bare `useMemo`
 * inside the component would give. Both maps are weak on the key they can be.
 */
const sheetCache = new WeakMap<object, Map<Palette, unknown>>();

/**
 * Build (or recall) a screen's stylesheet for the current theme.
 *
 * The factory takes the whole palette and is expected to destructure what it
 * needs in its parameter list — `({ colors }) => StyleSheet.create({...})` —
 * which is what keeps the bodies of the fifty style sheets in this app byte-for
 * -byte what they were before the theme existed.
 */
export function useThemedStyles<T>(make: (palette: Palette) => T): T {
  const palette = useTheme();
  let perPalette = sheetCache.get(make);
  if (!perPalette) {
    perPalette = new Map();
    sheetCache.set(make, perPalette);
  }
  let sheet = perPalette.get(palette);
  if (sheet === undefined) {
    sheet = make(palette);
    perPalette.set(palette, sheet);
  }
  return sheet as T;
}
