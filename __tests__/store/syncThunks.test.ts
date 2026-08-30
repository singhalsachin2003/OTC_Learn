import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore, type AppStore } from '../../src/store';
import { setNotes } from '../../src/store/slices/notesSlice';
import { setProgress } from '../../src/store/slices/progressSlice';
import { setSession } from '../../src/store/slices/syncSlice';
import { syncNow } from '../../src/store/thunks/syncThunks';
import { loadNotes, loadProgressMap } from '../../src/utils/storage';
import {
  emptyRemoteSnapshot,
  isoFrom,
  type RemoteSnapshot,
  type SyncedSnapshot,
  type SyncTransport,
} from '../../src/utils/sync';

const OLD = Date.parse('2026-08-01T10:00:00Z');
const NEW = Date.parse('2026-08-30T10:00:00Z');

/** Records what was pushed, so a test can assert both halves of a round trip. */
function fakeTransport(remote: Partial<RemoteSnapshot> = {}) {
  const pushed: SyncedSnapshot[] = [];
  const transport: SyncTransport = {
    pull: async () => ({ ...emptyRemoteSnapshot, ...remote }),
    push: async (snapshot) => {
      pushed.push(snapshot);
    },
  };
  return { transport, pushed };
}

function signedIn(): AppStore {
  const store = createStore();
  store.dispatch(setSession({ userId: 'user-1', email: 'a@example.com' }));
  return store;
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('syncNow', () => {
  it('does nothing at all when nobody is signed in', async () => {
    const store = createStore();
    const { transport, pushed } = fakeTransport();

    const result = await store.dispatch(syncNow({ transport }));

    expect(result.payload).toBe(false);
    expect(pushed).toEqual([]);
    expect(store.getState().sync.status).toBe('idle');
  });

  it('brings down progress the device has never seen', async () => {
    const store = signedIn();
    const { transport } = fakeTransport({
      progress: [
        {
          product_id: 'irs',
          mastery: 72,
          attempts: 4,
          best_score_pct: 90,
          last_studied_on: '2026-08-30',
          updated_at: isoFrom(NEW),
        },
      ],
    });

    await store.dispatch(syncNow({ transport }));

    expect(store.getState().progress.byProduct.irs.mastery).toBe(72);
    expect(store.getState().sync.status).toBe('idle');
    expect(store.getState().sync.lastSyncedAt).toEqual(expect.any(Number));
  });

  /**
   * The merged picture is what goes up, not what the device started with, so
   * one round trip converges both sides rather than leaving the server a
   * version behind until next time.
   */
  it('pushes the merged picture rather than the local one', async () => {
    const store = signedIn();
    store.dispatch(
      setProgress({
        cds: {
          mastery: 40,
          attempts: 1,
          bestScorePct: 40,
          lastStudiedOn: '2026-08-02',
          updatedAt: OLD,
        },
      }),
    );
    const { transport, pushed } = fakeTransport({
      progress: [
        {
          product_id: 'irs',
          mastery: 72,
          attempts: 4,
          best_score_pct: 90,
          last_studied_on: '2026-08-30',
          updated_at: isoFrom(NEW),
        },
      ],
    });

    await store.dispatch(syncNow({ transport }));

    expect(Object.keys(pushed[0].progress).sort()).toEqual(['cds', 'irs']);
  });

  it('writes the merged result to storage, not just to Redux', async () => {
    const store = signedIn();
    const { transport } = fakeTransport({
      notes: [
        {
          product_id: 'irs',
          body: 'from another device',
          updated_on: '2026-08-30',
          updated_at: isoFrom(NEW),
        },
      ],
    });

    await store.dispatch(syncNow({ transport }));

    await expect(loadNotes()).resolves.toMatchObject({
      irs: { body: 'from another device' },
    });
  });

  /**
   * Local state is written before the upload deliberately. If the push fails,
   * the device still keeps everything the server had — losing the pull because
   * the push failed would make a flaky network cost the user data.
   */
  it('keeps what it pulled even when the push fails', async () => {
    const store = signedIn();
    const transport: SyncTransport = {
      pull: async () => ({
        ...emptyRemoteSnapshot,
        progress: [
          {
            product_id: 'irs',
            mastery: 65,
            attempts: 2,
            best_score_pct: 70,
            last_studied_on: '2026-08-30',
            updated_at: isoFrom(NEW),
          },
        ],
      }),
      push: async () => {
        throw new Error('network unreachable');
      },
    };

    await store.dispatch(syncNow({ transport }));

    expect(store.getState().progress.byProduct.irs.mastery).toBe(65);
    await expect(loadProgressMap()).resolves.toMatchObject({
      irs: { mastery: 65 },
    });
    expect(store.getState().sync.status).toBe('error');
    expect(store.getState().sync.error).toBe('network unreachable');
  });

  it('reports a failed pull without disturbing local state', async () => {
    const store = signedIn();
    store.dispatch(
      setNotes({
        irs: { body: 'mine', updatedOn: '2026-08-02', updatedAt: OLD },
      }),
    );
    const transport: SyncTransport = {
      pull: async () => {
        throw new Error('could not reach the server');
      },
      push: async () => undefined,
    };

    const result = await store.dispatch(syncNow({ transport }));

    expect(result.payload).toBe(false);
    expect(store.getState().notes.byProduct.irs.body).toBe('mine');
    expect(store.getState().sync.error).toBe('could not reach the server');
  });

  /** Sync is retried far more often than it succeeds cleanly. */
  it('reaches the same state when run twice against the same server', async () => {
    const store = signedIn();
    const { transport } = fakeTransport({
      progress: [
        {
          product_id: 'irs',
          mastery: 72,
          attempts: 4,
          best_score_pct: 90,
          last_studied_on: '2026-08-30',
          updated_at: isoFrom(NEW),
        },
      ],
      studyDays: ['2026-08-29', '2026-08-30'],
    });

    await store.dispatch(syncNow({ transport }));
    const afterFirst = store.getState();
    await store.dispatch(syncNow({ transport }));

    expect(store.getState().progress.byProduct).toEqual(
      afterFirst.progress.byProduct,
    );
    expect(store.getState().streak.studyDays).toEqual(afterFirst.streak.studyDays);
  });

  it('clears a stale error once a later sync succeeds', async () => {
    const store = signedIn();
    const failing: SyncTransport = {
      pull: async () => {
        throw new Error('offline');
      },
      push: async () => undefined,
    };
    await store.dispatch(syncNow({ transport: failing }));
    expect(store.getState().sync.status).toBe('error');

    const { transport } = fakeTransport();
    await store.dispatch(syncNow({ transport }));

    expect(store.getState().sync.status).toBe('idle');
    expect(store.getState().sync.error).toBeNull();
  });
});
