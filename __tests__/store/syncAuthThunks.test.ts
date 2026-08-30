import { createStore } from '../../src/store';
import { setSession } from '../../src/store/slices/syncSlice';
import { signIn, signOutAccount } from '../../src/store/thunks/syncThunks';
import { getSupabaseClient } from '../../src/utils/supabase';

jest.mock('../../src/utils/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

const mockedClient = getSupabaseClient as jest.Mock;

/** Only the auth surface these two thunks touch. */
function clientWith(auth: Record<string, unknown>) {
  mockedClient.mockReturnValue({ auth });
}

/**
 * A client whose every table read returns whatever `result()` says.
 *
 * PostgREST's builder is awaitable *and* carries `.maybeSingle()`, which the
 * streaks read uses — so `select()` returns a promise with that method hung off
 * it rather than a plain object.
 */
function clientReturning(result: () => { data: unknown; error: unknown }) {
  mockedClient.mockReturnValue({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { id: 'u1', email: 'a@example.com' } },
        error: null,
      }),
    },
    from: () => ({
      select: () => {
        const pending = Promise.resolve(result()) as Promise<unknown> & {
          maybeSingle?: () => Promise<unknown>;
        };
        pending.maybeSingle = () => Promise.resolve(result());
        return pending;
      },
      upsert: async () => ({ data: null, error: null }),
    }),
  });
}

beforeEach(() => {
  mockedClient.mockReset();
});

describe('signOutAccount', () => {
  /**
   * The race this fixes: sign out, sign straight back in while the revoke is
   * still in flight, and a `clearSession` dispatched after the await lands on
   * top of the session the new sign-in had already established. The app is then
   * signed in with no user id, so the sync that follows returns early and says
   * nothing at all.
   */
  it('clears the local session before the network revoke resolves', async () => {
    let finishRevoke = () => {};
    const signOut = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishRevoke = () => resolve();
        }),
    );
    clientWith({ signOut });

    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'a@example.com' }));

    const pending = store.dispatch(signOutAccount());
    await Promise.resolve();

    // Revoke still in flight, session already gone locally.
    expect(signOut).toHaveBeenCalled();
    expect(store.getState().sync.userId).toBeNull();

    finishRevoke();
    await pending;
    expect(store.getState().sync.userId).toBeNull();
  });

  it('signs out locally even when the revoke fails outright', async () => {
    clientWith({ signOut: jest.fn().mockRejectedValue(new Error('offline')) });

    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'a@example.com' }));

    await store.dispatch(signOutAccount());

    expect(store.getState().sync.userId).toBeNull();
  });

  it('signs out on a build with no sync configured', async () => {
    mockedClient.mockReturnValue(null);

    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'a@example.com' }));

    await store.dispatch(signOutAccount());

    expect(store.getState().sync.userId).toBeNull();
  });
});

describe('signIn', () => {
  /**
   * `signInWithPassword` returns its errors, but a dropped connection makes it
   * throw. Unhandled, the thunk rejects, the slice never hears about it, and
   * the button sits on "Working…" for the rest of the session.
   */
  it('reports a thrown error rather than stranding the button', async () => {
    clientWith({
      signInWithPassword: jest
        .fn()
        .mockRejectedValue(new Error('Network request failed')),
    });

    const store = createStore();
    const result = await store.dispatch(
      signIn({ email: 'a@example.com', password: 'pw' }),
    );

    expect(result.payload).toBe(false);
    expect(store.getState().sync.status).toBe('error');
    expect(store.getState().sync.error).toBe('Network request failed');
  });

  it('reports a returned error the same way', async () => {
    clientWith({
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      }),
    });

    const store = createStore();
    await store.dispatch(signIn({ email: 'a@example.com', password: 'wrong' }));

    expect(store.getState().sync.error).toBe('Invalid login credentials');
    expect(store.getState().sync.userId).toBeNull();
  });

  it('says so when the build has no sync configured', async () => {
    mockedClient.mockReturnValue(null);

    const store = createStore();
    const result = await store.dispatch(
      signIn({ email: 'a@example.com', password: 'pw' }),
    );

    expect(result.payload).toBe(false);
    expect(store.getState().sync.error).toBe('This build has no sync configured.');
  });

  /**
   * The real cause of "signed in, never synced". Postgres rejects a token whose
   * `iat` is ahead of its own clock, and the sync straight after sign-in uses a
   * token milliseconds old — so sub-second skew between the auth server and the
   * database is enough. Seconds later the same token is fine, which is why a
   * manual "Sync now" always worked and made this look like a sync bug.
   */
  it('retries the first sync when a freshly issued token is refused', async () => {
    let reads = 0;
    clientReturning(() => {
      reads += 1;
      // Eight tables are read per pull; refuse the whole first round.
      return reads <= 8
        ? { data: null, error: { message: 'JWT issued at future' } }
        : { data: [], error: null };
    });

    const store = createStore();
    await store.dispatch(
      signIn({ email: 'a@example.com', password: 'pw', retryDelayMs: 0 }),
    );

    expect(reads).toBeGreaterThan(8);
    expect(store.getState().sync.status).toBe('idle');
    expect(store.getState().sync.lastSyncedAt).toEqual(expect.any(Number));
  });

  it('leaves the failure visible when the retry fails too', async () => {
    clientReturning(() => ({
      data: null,
      error: { message: 'JWT issued at future' },
    }));

    const store = createStore();
    await store.dispatch(
      signIn({ email: 'a@example.com', password: 'pw', retryDelayMs: 0 }),
    );

    expect(store.getState().sync.status).toBe('error');
    expect(store.getState().sync.error).toBe('JWT issued at future');
  });

  it('creates an account when asked to sign up instead', async () => {
    const signUp = jest.fn().mockResolvedValue({
      data: { user: { id: 'u2', email: 'new@example.com' } },
      error: null,
    });
    clientWith({
      signUp,
      from: () => ({ select: async () => ({ data: [], error: null }) }),
    });

    const store = createStore();
    await store.dispatch(
      signIn({
        email: 'new@example.com',
        password: 'pw',
        signingUp: true,
        retryDelayMs: 0,
      }),
    );

    expect(signUp).toHaveBeenCalled();
    expect(store.getState().sync.userId).toBe('u2');
  });
});
