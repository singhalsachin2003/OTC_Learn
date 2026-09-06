import { categories } from '../data/categories';
import { products } from '../data/products';
import {
  navigateToAccount,
  navigateToCategory,
  navigateToExam,
  navigateToGlossary,
  navigateToHome,
  navigateToInsights,
  navigateToLesson,
  navigateToNotes,
  navigateToPaywall,
  navigateToProduct,
  navigateToTab,
  type ScreenName,
} from '../store/slices/appSlice';

/** URL scheme registered in `app.json`. */
export const SCHEME = 'otclearn';

/**
 * The https form of the same links, which is what anything posted publicly can
 * actually use — a custom scheme is dead in a browser, an email client or a
 * social post, and only ever worked from inside another app.
 *
 * The host and prefix are the published Pages site, and they are declared again
 * in `app.json` as a verified intent filter; a test pins the two together. Only
 * the two content routes are claimed there, deliberately: the app has nothing
 * to show for `/privacy/` or `/account-deletion/`, and swallowing those would
 * turn a policy link into a dead end for anyone who has the app installed.
 */
export const WEB_LINK_PREFIX = 'https://singhalsachin2003.github.io/OTC_Learn/';

/** The route segments the app claims from the web. */
export const WEB_LINK_ROUTES = ['category', 'product'] as const;

export interface ParsedLink {
  screen: ScreenName;
  categoryId?: string;
  productId?: string;
}

/**
 * Parses the app's deep links:
 *
 * - `otclearn://` and `otclearn://home`
 * - `otclearn://category/<id>`
 * - `otclearn://product/<id>` — the product page
 * - `otclearn://lesson/<id>` — straight into the lesson
 * - `otclearn://review`, `otclearn://profile`, `otclearn://glossary`,
 *   `otclearn://insights`, `otclearn://exam`, `otclearn://notes`,
 *   `otclearn://account`, `otclearn://paywall`
 *
 * and the https form of the two routes the website also publishes, which is
 * what a link posted anywhere public has to be: `<WEB_LINK_PREFIX>product/<id>`,
 * with or without the trailing slash Jekyll serves. `lesson` is deliberately
 * not among them — every claimed web address has to resolve for the reader who
 * does not have the app, and the lesson lives on the product page there.
 *
 * Returns `null` for anything that does not resolve to real content, so an
 * unrecognised link leaves the user where they were rather than on a blank
 * screen.
 */
export function parseDeepLink(url: string): ParsedLink | null {
  const path = toPath(url);
  if (path === null) {
    return null;
  }
  const [kind, id] = path.split('/');

  if (kind === '' || kind === 'home') {
    return { screen: 'home' };
  }

  if (kind === 'review' || kind === 'profile') {
    return { screen: kind };
  }

  if (kind === 'glossary') {
    return { screen: 'glossary' };
  }

  if (kind === 'insights') {
    return { screen: 'insights' };
  }

  if (kind === 'exam') {
    return { screen: 'exam' };
  }

  if (kind === 'notes') {
    return { screen: 'notes' };
  }

  if (kind === 'account') {
    return { screen: 'account' };
  }

  if (kind === 'paywall') {
    return { screen: 'paywall' };
  }

  if (kind === 'category' && categories.some((c) => c.id === id)) {
    return { screen: 'category', categoryId: id };
  }

  if (kind === 'product' || kind === 'lesson') {
    const product = products.find((p) => p.id === id);
    if (product !== undefined) {
      return {
        screen: kind === 'lesson' ? 'lesson' : 'product',
        categoryId: product.categoryId,
        productId: product.id,
      };
    }
  }

  return null;
}

/**
 * Reduces either link form to the path the parser branches on.
 *
 * A web link that names a route the app does not claim returns null rather than
 * falling through to home: it belongs to the website, and sending the reader to
 * the dashboard instead of the page they tapped is worse than not opening the
 * app at all.
 */
function toPath(url: string): string | null {
  if (url.startsWith(`${SCHEME}://`)) {
    return url.slice(`${SCHEME}://`.length);
  }

  if (!url.startsWith(WEB_LINK_PREFIX)) {
    // Also covers the bare `otclearn:` form some launchers hand over.
    return url.startsWith(`${SCHEME}:`)
      ? url.slice(`${SCHEME}:`.length).replace(/^\/\//, '')
      : null;
  }

  // Jekyll serves these with a trailing slash, and a shared link may or may not
  // carry a query string the sharer's client appended.
  const path = url
    .slice(WEB_LINK_PREFIX.length)
    .split(/[?#]/)[0]
    .replace(/\/+$/, '');
  const [kind] = path.split('/');
  return WEB_LINK_ROUTES.some((route) => route === kind) ? path : null;
}

/**
 * Actions to dispatch, in order, to land on a parsed link's destination.
 *
 * A product or lesson link dispatches its category first, so backing out of a
 * deep-linked screen lands somewhere sensible rather than on an empty list.
 */
export function actionsForLink(link: ParsedLink) {
  switch (link.screen) {
    case 'category':
      return [navigateToCategory(link.categoryId ?? '')];
    case 'product':
      return [
        navigateToCategory(link.categoryId ?? ''),
        navigateToProduct(link.productId ?? ''),
      ];
    case 'lesson':
      return [
        navigateToCategory(link.categoryId ?? ''),
        navigateToLesson(link.productId ?? ''),
      ];
    case 'review':
      return [navigateToTab('review')];
    case 'profile':
      return [navigateToTab('profile')];
    // The glossary is reached from Profile, and its back link says so, so the
    // tab has to be selected first — otherwise a deep link lands on a screen
    // whose back control and whose highlighted tab disagree.
    case 'glossary':
      return [navigateToTab('profile'), navigateToGlossary()];
    // Reached from Profile too, and its back link says so — same reasoning.
    case 'insights':
      return [navigateToTab('profile'), navigateToInsights()];
    case 'exam':
      return [navigateToTab('profile'), navigateToExam()];
    case 'notes':
      return [navigateToTab('profile'), navigateToNotes()];
    case 'account':
      return [navigateToTab('profile'), navigateToAccount()];
    // Reached from Profile too, so backing out of a deep-linked paywall lands
    // on a tab rather than on whatever screen happened to be selected last.
    case 'paywall':
      return [navigateToTab('profile'), navigateToPaywall()];
    default:
      return [navigateToHome()];
  }
}
