import reducer, {
  initialAppState,
  navigateToCategory,
  navigateToHome,
  navigateToLesson,
  navigateToQuiz,
  navigateToResults,
} from '../../src/store/slices/appSlice';

describe('appSlice', () => {
  it('starts on the home screen with nothing selected', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialAppState);
  });

  it('selects a category and clears any product selection', () => {
    const withProduct = {
      ...initialAppState,
      selectedProductId: 'irs',
    };

    const state = reducer(withProduct, navigateToCategory('ir'));

    expect(state).toEqual({
      currentScreen: 'category',
      selectedCategoryId: 'ir',
      selectedProductId: null,
    });
  });

  it('keeps the category when navigating into a lesson', () => {
    const state = reducer(
      reducer(initialAppState, navigateToCategory('fx')),
      navigateToLesson('fxfwd'),
    );

    expect(state).toEqual({
      currentScreen: 'lesson',
      selectedCategoryId: 'fx',
      selectedProductId: 'fxfwd',
    });
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
    expect(home.selectedProductId).toBeNull();
    expect(home.selectedCategoryId).toBe('equity');
  });
});
