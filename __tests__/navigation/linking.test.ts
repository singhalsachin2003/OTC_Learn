import { actionsForLink, parseDeepLink } from '../../src/navigation/linking';
import { createStore } from '../../src/store';

describe('parseDeepLink', () => {
  it('resolves the bare scheme to home', () => {
    expect(parseDeepLink('otclearn://')).toEqual({ screen: 'home' });
    expect(parseDeepLink('otclearn://home')).toEqual({ screen: 'home' });
  });

  it('resolves a known category', () => {
    expect(parseDeepLink('otclearn://category/credit')).toEqual({
      screen: 'category',
      categoryId: 'credit',
    });
  });

  it('resolves a product to its lesson, carrying the parent category', () => {
    expect(parseDeepLink('otclearn://product/eqswap')).toEqual({
      screen: 'lesson',
      categoryId: 'equity',
      productId: 'eqswap',
    });
  });

  it('rejects unknown ids and unknown routes', () => {
    expect(parseDeepLink('otclearn://category/bonds')).toBeNull();
    expect(parseDeepLink('otclearn://product/nope')).toBeNull();
    expect(parseDeepLink('otclearn://settings')).toBeNull();
  });
});

describe('actionsForLink', () => {
  it('lands on the category screen', () => {
    const store = createStore();
    for (const action of actionsForLink({
      screen: 'category',
      categoryId: 'fx',
    })) {
      store.dispatch(action);
    }

    expect(store.getState().app).toMatchObject({
      currentScreen: 'category',
      selectedCategoryId: 'fx',
    });
  });

  it('lands on a lesson with the category also selected', () => {
    const store = createStore();
    const link = parseDeepLink('otclearn://product/cmopt')!;
    for (const action of actionsForLink(link)) {
      store.dispatch(action);
    }

    expect(store.getState().app).toEqual({
      currentScreen: 'lesson',
      selectedCategoryId: 'commodity',
      selectedProductId: 'cmopt',
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
