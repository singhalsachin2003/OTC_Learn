import {
  useFonts,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

/**
 * Loads the four Plus Jakarta Sans weights the design uses. The font family
 * names registered here are the ones referenced in `theme/typography.ts`.
 *
 * Returns `[loaded, error]`; the app renders its splash until `loaded` is true.
 */
export function useAppFonts(): [boolean, Error | null] {
  const [loaded, error] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return [loaded, error ?? null];
}
