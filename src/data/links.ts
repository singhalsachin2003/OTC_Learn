/**
 * Every address the app hands to the outside world.
 *
 * They live together because they are a schema of sorts: the Play listing id is
 * also in `app.json` as `android.playStoreUrl` (which is what `expo-store-review`
 * reads), and a test pins the two together so they cannot drift apart.
 */

/** This app's Play listing. */
export const PLAY_LISTING_URL =
  'https://play.google.com/store/apps/details?id=com.otclearn.app';

/** The published site: the privacy policy, the account-deletion page, the rest. */
export const WEB_HOME_URL = 'https://singhalsachin2003.github.io/OTC_Learn/';

/**
 * Where a shared link points.
 *
 * The Play listing rather than a page about the product itself, because the
 * site has no per-product pages yet — a link to one would 404 for the person
 * who received it, which is worse than a link to the app that teaches it. When
 * those pages exist this is the single place that changes.
 */
export function shareUrl(): string {
  return PLAY_LISTING_URL;
}
