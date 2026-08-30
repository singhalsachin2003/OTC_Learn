import reducer, {
  clearSession,
  initialSyncState,
  setSession,
  setSyncStatus,
  syncFailed,
  syncSucceeded,
} from '../../src/store/slices/syncSlice';

const SESSION = { userId: 'user-1', email: 'a@example.com' };

describe('syncSlice', () => {
  it('starts signed out, which is a working state rather than an error', () => {
    expect(initialSyncState).toEqual({
      userId: null,
      email: null,
      status: 'idle',
      lastSyncedAt: null,
      error: null,
    });
  });

  it('records a session', () => {
    const state = reducer(initialSyncState, setSession(SESSION));

    expect(state.userId).toBe('user-1');
    expect(state.email).toBe('a@example.com');
  });

  /** The error belonged to the previous session, not to this one. */
  it('clears a previous failure when a new session starts', () => {
    let state = reducer(initialSyncState, syncFailed('expired token'));
    state = reducer(state, setSession(SESSION));

    expect(state.error).toBeNull();
  });

  it('forgets everything on sign-out', () => {
    let state = reducer(initialSyncState, setSession(SESSION));
    state = reducer(state, syncSucceeded(1_000));
    state = reducer(state, clearSession());

    expect(state).toEqual(initialSyncState);
  });

  it('records when a sync last finished', () => {
    const state = reducer(initialSyncState, syncSucceeded(1_234));

    expect(state).toMatchObject({ status: 'idle', lastSyncedAt: 1_234 });
  });

  it('keeps the last successful time after a later failure', () => {
    let state = reducer(initialSyncState, syncSucceeded(1_234));
    state = reducer(state, syncFailed('offline'));

    // The last sync really did happen; a later failure does not unhappen it.
    expect(state.lastSyncedAt).toBe(1_234);
    expect(state.error).toBe('offline');
  });

  it('drops a stale error as soon as work restarts', () => {
    let state = reducer(initialSyncState, syncFailed('offline'));
    state = reducer(state, setSyncStatus('busy'));

    expect(state).toMatchObject({ status: 'busy', error: null });
  });
});
