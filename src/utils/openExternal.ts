import { Linking } from 'react-native';

/**
 * Hands a URL to whatever the OS thinks should open it.
 *
 * Swallows its own failure, like every other side-effect facade here: a device
 * with no browser and no Play client rejects the call, and an unhandled
 * rejection from a tap on a promotional card would be a poor trade for a link
 * that was optional to begin with.
 */
export async function openExternal(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    // Nothing to do — the user keeps the screen they were on.
  }
}
