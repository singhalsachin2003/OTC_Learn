import reducer, {
  initialAppState,
  isTabScreen,
  navigateToAchievements,
  navigateToCategory,
  navigateToGlossary,
  navigateToHome,
  navigateToLesson,
  navigateToProduct,
  navigateToQuiz,
  navigateToResults,
  navigateToTab,
  setProductQuery,
  showsTabBar,
  TAB_SCREENS,
  type ScreenName,
} from '../../src/store/slices/appSlice';

describe('appSlice', () => {
  it('starts on the home tab with nothing selected', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialAppState);
  });

  it('switches tab and shows that tab root screen', () => {
    const state = reducer(initialAppState, navigateToTab('review'));

    expect(state.currentTab).toBe('review');
    expect(state.currentScreen).toBe('review');
  });

  it('drops the selected product when leaving for another tab', () => {
    const inProduct = reducer(initialAppState, navigateToProduct('irs'));

    const state = reducer(inProduct, navigateToTab('profile'));

    expect(state.selectedProductId).toBeNull();
  });

  it('keeps the selected product when returning to the products tab', () => {
    const inProduct = reducer(initialAppState, navigateToProduct('irs'));

    const state = reducer(inProduct, navigateToTab('products'));

    expect(state.selectedProductId).toBe('irs');
  });

  it('keeps the current tab when pushing a product detail on top', () => {
    const inProducts = reducer(initialAppState, navigateToTab('products'));

    const state = reducer(inProducts, navigateToProduct('cds'));

    expect(state.currentScreen).toBe('product');
    expect(state.currentTab).toBe('products');
    expect(state.selectedProductId).toBe('cds');
  });

  it('selects a category and clears any product selection', () => {
    const withProduct = { ...initialAppState, selectedProductId: 'irs' };

    const state = reducer(withProduct, navigateToCategory('ir'));

    expect(state.currentScreen).toBe('category');
    expect(state.selectedCategoryId).toBe('ir');
    expect(state.selectedProductId).toBeNull();
  });

  it('keeps the category when navigating into a lesson', () => {
    const state = reducer(
      reducer(initialAppState, navigateToCategory('fx')),
      navigateToLesson('fxfwd'),
    );

    expect(state.currentScreen).toBe('lesson');
    expect(state.selectedCategoryId).toBe('fx');
    expect(state.selectedProductId).toBe('fxfwd');
  });

  it('moves through quiz and results without losing the selection', () => {
    let state = reducer(initialAppState, navigateToCategory('credit'));
    state = reducer(state, navigateToLesson('cds'));
    state = reducer(state, navigateToQuiz());

    expect(state.currentScreen).toBe('quiz');
    expect(state.selectedProductId).toBe('cds');

    state = reducer(state, navigateToResults());

    expect(state.currentScreen).toBe('results');
    expect(state.selectedProductId).toBe('cds');
    expect(state.selectedCategoryId).toBe('credit');
  });

  it('clears the product but remembers the category when going home', () => {
    let state = reducer(initialAppState, navigateToCategory('equity'));
    state = reducer(state, navigateToLesson('eqswap'));

    const home = reducer(state, navigateToHome());

    expect(home.currentScreen).toBe('home');
    expect(home.currentTab).toBe('home');
    expect(home.selectedProductId).toBeNull();
    expect(home.selectedCategoryId).toBe('equity');
  });

  it('opens the glossary and achievements over the tab you came from', () => {
    const inProfile = reducer(initialAppState, navigateToTab('profile'));

    const glossary = reducer(inProfile, navigateToGlossary());
    expect(glossary.currentScreen).toBe('glossary');
    expect(glossary.currentTab).toBe('profile');

    const achievements = reducer(glossary, navigateToAchievements());
    expect(achievements.currentScreen).toBe('achievements');
    expect(achievements.currentTab).toBe('profile');
  });

  it('holds the product filter across a detour into a product', () => {
    let state = reducer(initialAppState, navigateToTab('products'));
    state = reducer(state, setProductQuery('swap'));
    state = reducer(state, navigateToProduct('irs'));
    state = reducer(state, navigateToTab('products'));

    expect(state.productQuery).toBe('swap');
  });

  it('replaces the product filter wholesale, including with a blank', () => {
    const typed = reducer(initialAppState, setProductQuery('cap'));

    expect(reducer(typed, setProductQuery('')).productQuery).toBe('');
  });
});

describe('isTabScreen', () => {
  it('recognises each of the four tab roots', () => {
    for (const tab of TAB_SCREENS) {
      expect(isTabScreen(tab)).toBe(true);
    }
  });

  it('rejects the detail screens pushed on top of a tab', () => {
    const details: ScreenName[] = [
      'category',
      'product',
      'lesson',
      'quiz',
      'results',
      'glossary',
      'achievements',
    ];

    for (const screen of details) {
      expect(isTabScreen(screen)).toBe(false);
    }
  });
});

describe('showsTabBar', () => {
  // A mis-tap on the bar mid-quiz would discard a part-finished paper, so the
  // immersive screens must keep it hidden.
  it('hides the bar on the lesson, quiz and results screens', () => {
    expect(showsTabBar('lesson')).toBe(false);
    expect(showsTabBar('quiz')).toBe(false);
    expect(showsTabBar('results')).toBe(false);
  });

  it('shows the bar on the tab roots', () => {
    for (const tab of TAB_SCREENS) {
      expect(showsTabBar(tab)).toBe(true);
    }
  });

  it('shows the bar on browsing screens, which have no work to lose', () => {
    expect(showsTabBar('category')).toBe(true);
    expect(showsTabBar('product')).toBe(true);
    expect(showsTabBar('glossary')).toBe(true);
    expect(showsTabBar('achievements')).toBe(true);
  });
});
