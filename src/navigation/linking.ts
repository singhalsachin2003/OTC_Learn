import { categories } from '../data/categories';
import { products } from '../data/products';
import {
  navigateToCategory,
  navigateToExam,
  navigateToGlossary,
  navigateToHome,
  navigateToInsights,
  navigateToLesson,
  navigateToProduct,
  navigateToTab,
  type ScreenName,
} from '../store/slices/appSlice';

/** URL scheme registered in `app.json`. */
export const SCHEME = 'otclearn';

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
 *   `otclearn://insights`, `otclearn://exam`
 *
 * Returns `null` for anything that does not resolve to real content, so an
 * unrecognised link leaves the user where they were rather than on a blank
 * screen.
 */
export function parseDeepLink(url: string): ParsedLink | null {
  const withoutScheme = url.replace(`${SCHEME}://`, '');
  const [kind, id] = withoutScheme.split('/');

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
    default:
      return [navigateToHome()];
  }
}
