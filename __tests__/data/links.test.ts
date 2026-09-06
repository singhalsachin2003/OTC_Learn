import appConfig from '../../app.json';

import { PLAY_LISTING_URL, shareUrl, WEB_HOME_URL } from '../../src/data/links';

/**
 * The listing URL exists twice: here, for anything the app shares, and in
 * `app.json` as `android.playStoreUrl`, which is what `expo-store-review` reads
 * when it decides whether it can offer a review flow at all. Nothing in the
 * build makes the two agree, so this does.
 */
it('shares the same listing the store review flow is pointed at', () => {
  expect(appConfig.expo.android.playStoreUrl).toBe(PLAY_LISTING_URL);
});

it('points the listing at the package this app actually ships as', () => {
  expect(PLAY_LISTING_URL).toContain(appConfig.expo.android.package);
});

it('shares a link that resolves, rather than a page that does not exist yet', () => {
  expect(shareUrl()).toBe(PLAY_LISTING_URL);
  expect(WEB_HOME_URL.startsWith('https://')).toBe(true);
});
