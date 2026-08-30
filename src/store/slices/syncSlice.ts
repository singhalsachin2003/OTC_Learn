import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * The account, and what the last sync did.
 *
 * A slice of its own because none of it is study data: nothing derives from it,
 * `resetEverything` does not touch it — signing out is a separate act from
 * wiping progress — and every other slice must keep working when this one says
 * nobody is signed in. That is the offline-first contract in state form.
 */
export type SyncStatus = 'idle' | 'busy' | 'error';

export interface SyncState {
  /** Null when signed out, which is the default and a perfectly good state. */
  userId: string | null;
  email: string | null;
  status: SyncStatus;
  /** Epoch milliseconds of the last sync that finished, or null. */
  lastSyncedAt: number | null;
  /**
   * Why the last attempt failed, for the one row in Profile that reports it.
   * Held as a message rather than an Error: this is serialisable state, and
   * Redux Toolkit rightly complains about anything that is not.
   */
  error: string | null;
}

export const initialSyncState: SyncState = {
  userId: null,
  email: null,
  status: 'idle',
  lastSyncedAt: null,
  error: null,
};

const syncSlice = createSlice({
  name: 'sync',
  initialState: initialSyncState,
  reducers: {
    /** A restored or newly created session. */
    setSession(
      state,
      action: PayloadAction<{ userId: string; email: string | null }>,
    ) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      // A new session clears whatever the last one failed at — the error
      // belonged to that session, not to this one.
      state.error = null;
    },

    clearSession(): SyncState {
      return { ...initialSyncState };
    },

    setSyncStatus(state, action: PayloadAction<SyncStatus>) {
      state.status = action.payload;
      if (action.payload !== 'error') {
        state.error = null;
      }
    },

    syncSucceeded(state, action: PayloadAction<number>) {
      state.status = 'idle';
      state.lastSyncedAt = action.payload;
      state.error = null;
    },

    syncFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
  },
});

export const {
  setSession,
  clearSession,
  setSyncStatus,
  syncSucceeded,
  syncFailed,
} = syncSlice.actions;

export default syncSlice.reducer;
