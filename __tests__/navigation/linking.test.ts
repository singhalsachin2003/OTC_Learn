import {
  actionsForLink,
  parseDeepLink,
  SCHEME,
} from '../../src/navigation/linking';
import { createStore } from '../../src/store';

/** Dispatches a parsed link's actions and hands back the resulting app state. */
function landOn(url: string) {
  const store = createStore();
  const link = parseDeepLink(url);
  if (link === null) {
    throw new Error(`${url} did not parse`);
  }
  for (const action of actionsForLink(link)) {
    store.dispatch(action);
  }
  return store.getState().app;
}

describe('parseDeepLink', () => {
  it('resolves the bare scheme to home', () => {
    expect(parseDeepLink(`${SCHEME}://`)).toEqual({ screen: 'home' });
    expect(parseDeepLink('otclearn://home')).toEqual({ screen: 'home' });
  });

  it('resolves a known category', () => {
    expect(parseDeepLink('otclearn://category/credit')).toEqual({
      screen: 'category',
      categoryId: 'credit',
    });
  });

  it('opens a product link on the product page, carrying its category', () => {
    expect(parseDeepLink('otclearn://product/eqswap')).toEqual({
      screen: 'product',
      categoryId: 'equity',
      productId: 'eqswap',
    });
  });

  it('opens a lesson link on the lesson, carrying its category', () => {
    expect(parseDeepLink('otclearn://lesson/eqswap')).toEqual({
      screen: 'lesson',
      categoryId: 'equity',
      productId: 'eqswap',
    });
  });

  it('resolves the tab roots reachable by link', () => {
    expect(parseDeepLink('otclearn://review')).toEqual({ screen: 'review' });
    expect(parseDeepLink('otclearn://profile')).toEqual({ screen: 'profile' });
  });

  it('resolves insights', () => {
    expect(parseDeepLink('otclearn://insights')).toEqual({ screen: 'insights' });
  });

  it('resolves the exam setup screen', () => {
    expect(parseDeepLink('otclearn://exam')).toEqual({ screen: 'exam' });
  });

  it('resolves the notes list', () => {
    expect(parseDeepLink('otclearn://notes')).toEqual({ screen: 'notes' });
  });

  it('resolves the glossary', () => {
    expect(parseDeepLink('otclearn://glossary')).toEqual({ screen: 'glossary' });
  });

  it('rejects unknown ids so a bad link leaves the user put', () => {
    expect(parseDeepLink('otclearn://category/bonds')).toBeNull();
    expect(parseDeepLink('otclearn://product/nope')).toBeNull();
    expect(parseDeepLink('otclearn://lesson/nope')).toBeNull();
  });

  it('rejects a kind it does not know', () => {
    expect(parseDeepLink('otclearn://settings')).toBeNull();
    expect(parseDeepLink('otclearn://achievements')).toBeNull();
  });

  it('rejects a route that names no id at all', () => {
    expect(parseDeepLink('otclearn://category')).toBeNull();
    expect(parseDeepLink('otclearn://product')).toBeNull();
  });

  // A link handed over by another app can carry any scheme; only ours resolves.
  it('rejects a foreign scheme', () => {
    expect(parseDeepLink('https://example.com/product/cds')).toBeNull();
  });

  it('ignores anything trailing the id', () => {
    expect(parseDeepLink('otclearn://product/cds/extra')).toEqual({
      screen: 'product',
      categoryId: 'credit',
      productId: 'cds',
    });
  });
});

describe('actionsForLink', () => {
  it('lands on the category screen', () => {
    expect(landOn('otclearn://category/fx')).toMatchObject({
      currentScreen: 'category',
      selectedCategoryId: 'fx',
    });
  });

  it('lands on a product page with its category also selected', () => {
    expect(landOn('otclearn://product/cmopt')).toEqual({
      currentScreen: 'product',
      currentTab: 'home',
      selectedCategoryId: 'commodity',
      selectedProductId: 'cmopt',
      productQuery: '',
    });
  });

  // Backing out of a deep-linked lesson needs the category selected too, or the
  // trail behind it is empty.
  it('lands on a lesson with its category also selected', () => {
    expect(landOn('otclearn://lesson/cmopt')).toMatchObject({
      currentScreen: 'lesson',
      selectedCategoryId: 'commodity',
      selectedProductId: 'cmopt',
    });
  });

  it('switches tab for a review link', () => {
    expect(landOn('otclearn://review')).toMatchObject({
      currentScreen: 'review',
      currentTab: 'review',
    });
  });

  it('switches tab for a profile link', () => {
    expect(landOn('otclearn://profile')).toMatchObject({
      currentScreen: 'profile',
      currentTab: 'profile',
    });
  });

  // The glossary is a detail screen rather than a tab root, so the bar keeps
  // highlighting wherever the user already was.
  // The glossary's back link says "Profile", so the tab has to agree with it —
  // otherwise a deep link lands somewhere the bar and the back control disagree
  // about.
  it('opens the glossary under the profile tab', () => {
    expect(landOn('otclearn://glossary')).toMatchObject({
      currentScreen: 'glossary',
      currentTab: 'profile',
    });
  });

  // Same reasoning as the glossary: reached from Profile, and its back link
  // says so, so the highlighted tab has to agree with the back control.
  it('opens insights under the profile tab', () => {
    expect(landOn('otclearn://insights')).toMatchObject({
      currentScreen: 'insights',
      currentTab: 'profile',
    });
  });

  it('opens the exam setup screen under the profile tab', () => {
    expect(landOn('otclearn://exam')).toMatchObject({
      currentScreen: 'exam',
      currentTab: 'profile',
    });
  });

  it('opens the notes list under the profile tab', () => {
    expect(landOn('otclearn://notes')).toMatchObject({
      currentScreen: 'notes',
      currentTab: 'profile',
    });
  });

  it('falls back to home', () => {
    const store = createStore();
    for (const action of actionsForLink({ screen: 'home' })) {
      store.dispatch(action);
    }

    expect(store.getState().app.currentScreen).toBe('home');
  });
});
