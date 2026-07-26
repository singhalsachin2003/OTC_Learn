import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ProgressState {
  completedProductIds: string[];
  /** True while progress is being hydrated from AsyncStorage. */
  loading: boolean;
}

export const initialProgressState: ProgressState = {
  completedProductIds: [],
  loading: false,
};

/**
 * Slices never import thunks: the store's module graph flows one way
 * (thunks → slices), so hydration is applied by thunks dispatching these plain
 * reducers rather than via `extraReducers`. Importing the thunks here would
 * close a require cycle, which Metro warns about and which can leave one module
 * holding an uninitialized binding from the other.
 */
const progressSlice = createSlice({
  name: 'progress',
  initialState: initialProgressState,
  reducers: {
    /** Idempotent — completing an already-complete product changes nothing. */
    markProductComplete(state, action: PayloadAction<string>) {
      if (!state.completedProductIds.includes(action.payload)) {
        state.completedProductIds.push(action.payload);
      }
    },
    setProgress(state, action: PayloadAction<string[]>) {
      state.completedProductIds = [...new Set(action.payload)];
    },
    setProgressLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { markProductComplete, setProgress, setProgressLoading } =
  progressSlice.actions;

export default progressSlice.reducer;
