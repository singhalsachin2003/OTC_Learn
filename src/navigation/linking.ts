import { categories } from '../data/categories';
import { products } from '../data/products';
import {
  navigateToCategory,
  navigateToHome,
  navigateToLesson,
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
 * Parses `otclearn://category/<id>` and `otclearn://product/<id>`.
 * Returns `null` for anything that does not resolve to real content.
 */
export function parseDeepLink(url: string): ParsedLink | null {
  const withoutScheme = url.replace(`${SCHEME}://`, '');
  const [kind, id] = withoutScheme.split('/');

  if (kind === '' || kind === 'home') {
    return { screen: 'home' };
  }

  if (kind === 'category' && categories.some((c) => c.id === id)) {
    return { screen: 'category', categoryId: id };
  }

  if (kind === 'product') {
    const product = products.find((p) => p.id === id);
    if (product !== undefined) {
      return {
        screen: 'lesson',
        categoryId: product.categoryId,
        productId: product.id,
      };
    }
  }

  return null;
}

/** Actions to dispatch, in order, to land on a parsed link's destination. */
export function actionsForLink(link: ParsedLink) {
  switch (link.screen) {
    case 'category':
      return [navigateToCategory(link.categoryId ?? '')];
    case 'lesson':
      return [
        navigateToCategory(link.categoryId ?? ''),
        navigateToLesson(link.productId ?? ''),
      ];
    default:
      return [navigateToHome()];
  }
}
