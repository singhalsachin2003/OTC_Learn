import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ScreenName = 'home' | 'category' | 'lesson' | 'quiz' | 'results';

export interface AppState {
  currentScreen: ScreenName;
  selectedCategoryId: string | null;
  selectedProductId: string | null;
}

export const initialAppState: AppState = {
  currentScreen: 'home',
  selectedCategoryId: null,
  selectedProductId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    /** Returns to the home screen and clears the current product selection. */
    navigateToHome(state) {
      state.currentScreen = 'home';
      state.selectedProductId = null;
    },
    navigateToCategory(state, action: PayloadAction<string>) {
      state.currentScreen = 'category';
      state.selectedCategoryId = action.payload;
      state.selectedProductId = null;
    },
    navigateToLesson(state, action: PayloadAction<string>) {
      state.currentScreen = 'lesson';
      state.selectedProductId = action.payload;
    },
    /** Requires a product to already be selected via `navigateToLesson`. */
    navigateToQuiz(state) {
      state.currentScreen = 'quiz';
    },
    navigateToResults(state) {
      state.currentScreen = 'results';
    },
  },
});

export const {
  navigateToHome,
  navigateToCategory,
  navigateToLesson,
  navigateToQuiz,
  navigateToResults,
} = appSlice.actions;

export default appSlice.reducer;
