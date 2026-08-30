import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** The four tab roots. */
export type TabName = 'home' | 'products' | 'review' | 'profile';

export type ScreenName =
  | TabName
  | 'category'
  | 'product'
  | 'lesson'
  | 'quiz'
  | 'results'
  | 'glossary'
  | 'achievements'
  | 'insights'
  | 'exam'
  | 'notes';

/**
 * Screens that are a tab root. Everything else is a detail screen pushed on
 * top of whichever tab the user was in, which is why `currentTab` is tracked
 * separately: the bar keeps highlighting where you came from.
 */
export const TAB_SCREENS: readonly TabName[] = [
  'home',
  'products',
  'review',
  'profile',
];

/**
 * Screens that hide the tab bar. A lesson or a quiz is a task with its own
 * exit; leaving the bar up invites a mis-tap that discards a part-finished
 * quiz, and `useQuizExit` would have to confirm on four extra controls.
 */
const IMMERSIVE_SCREENS: readonly ScreenName[] = ['lesson', 'quiz', 'results'];

export function isTabScreen(screen: ScreenName): screen is TabName {
  return (TAB_SCREENS as readonly string[]).includes(screen);
}

export function showsTabBar(screen: ScreenName): boolean {
  return !IMMERSIVE_SCREENS.includes(screen);
}

export interface AppState {
  currentScreen: ScreenName;
  currentTab: TabName;
  selectedCategoryId: string | null;
  selectedProductId: string | null;
  /** Free-text filter on the products tab, kept here so it survives a detour. */
  productQuery: string;
}

export const initialAppState: AppState = {
  currentScreen: 'home',
  currentTab: 'home',
  selectedCategoryId: null,
  selectedProductId: null,
  productQuery: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    /** Switches tab and shows that tab's root screen. */
    navigateToTab(state, action: PayloadAction<TabName>) {
      state.currentTab = action.payload;
      state.currentScreen = action.payload;
      if (action.payload !== 'products') {
        state.selectedProductId = null;
      }
    },

    /** Returns to the home screen and clears the current product selection. */
    navigateToHome(state) {
      state.currentScreen = 'home';
      state.currentTab = 'home';
      state.selectedProductId = null;
    },

    navigateToCategory(state, action: PayloadAction<string>) {
      state.currentScreen = 'category';
      state.selectedCategoryId = action.payload;
      state.selectedProductId = null;
    },

    /** The product detail page — summary, key terms, worked example. */
    navigateToProduct(state, action: PayloadAction<string>) {
      state.currentScreen = 'product';
      state.selectedProductId = action.payload;
    },

    navigateToLesson(state, action: PayloadAction<string>) {
      state.currentScreen = 'lesson';
      state.selectedProductId = action.payload;
    },

    /** Requires a product to already be selected, except in review mode. */
    navigateToQuiz(state) {
      state.currentScreen = 'quiz';
    },

    navigateToResults(state) {
      state.currentScreen = 'results';
    },

    navigateToGlossary(state) {
      state.currentScreen = 'glossary';
    },

    navigateToAchievements(state) {
      state.currentScreen = 'achievements';
    },

    navigateToInsights(state) {
      state.currentScreen = 'insights';
    },

    /** The exam setup screen, not a sitting in progress. */
    navigateToExam(state) {
      state.currentScreen = 'exam';
    },

    /** Every note the user has written, across products. */
    navigateToNotes(state) {
      state.currentScreen = 'notes';
    },

    setProductQuery(state, action: PayloadAction<string>) {
      state.productQuery = action.payload;
    },
  },
});

export const {
  navigateToTab,
  navigateToHome,
  navigateToCategory,
  navigateToProduct,
  navigateToLesson,
  navigateToQuiz,
  navigateToResults,
  navigateToGlossary,
  navigateToAchievements,
  navigateToInsights,
  navigateToExam,
  navigateToNotes,
  setProductQuery,
} = appSlice.actions;

export default appSlice.reducer;
