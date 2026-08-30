import { configureStore } from '@reduxjs/toolkit';

import appReducer, { type AppState } from './slices/appSlice';
import notesReducer, { type NotesState } from './slices/notesSlice';
import progressReducer, { type ProgressState } from './slices/progressSlice';
import quizReducer, { type QuizState } from './slices/quizSlice';
import reviewReducer, { type ReviewState } from './slices/reviewSlice';
import settingsReducer, { type SettingsState } from './slices/settingsSlice';
import streakReducer, { type StreakState } from './slices/streakSlice';

/**
 * Declared explicitly rather than inferred from `store.getState()`. The thunk
 * modules need `RootState` for their `getState` typing, and inferring it from
 * the store would make that a circular type reference.
 */
export interface RootState {
  app: AppState;
  notes: NotesState;
  progress: ProgressState;
  quiz: QuizState;
  review: ReviewState;
  settings: SettingsState;
  streak: StreakState;
}

export const rootReducer = {
  app: appReducer,
  notes: notesReducer,
  progress: progressReducer,
  quiz: quizReducer,
  review: reviewReducer,
  settings: settingsReducer,
  streak: streakReducer,
};

/** Builds an isolated store — used by the app root and by tests. */
export function createStore() {
  return configureStore({ reducer: rootReducer });
}

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
