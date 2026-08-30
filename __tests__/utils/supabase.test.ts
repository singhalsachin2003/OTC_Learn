import {
  createSupabaseClient,
  getSupabaseClient,
  isSyncConfigured,
  resetSupabaseClient,
} from '../../src/utils/supabase';

const CONFIG = {
  url: 'https://example.supabase.co',
  publishableKey: 'sb_publishable_test',
};

beforeEach(() => {
  resetSupabaseClient();
});

describe('createSupabaseClient', () => {
  /**
   * Unconfigured is a working app, not a broken one — OTC Learn shipped with no
   * account and no server, and every screen reads Redux either way. Null is how
   * that stays true, and is why every caller has to handle it.
   */
  it('returns null when nothing is configured', () => {
    expect(
      createSupabaseClient({ url: undefined, publishableKey: undefined }),
    ).toBeNull();
  });

  it('returns null for a blank value rather than building a broken client', () => {
    expect(createSupabaseClient({ url: '', publishableKey: '' })).toBeNull();
    expect(createSupabaseClient({ ...CONFIG, url: '' })).toBeNull();
    expect(createSupabaseClient({ ...CONFIG, publishableKey: '' })).toBeNull();
  });

  it('builds a client when both values are present', () => {
    expect(createSupabaseClient(CONFIG)).not.toBeNull();
  });

  /**
   * The config is injectable for the same reason `initErrorReporting`'s is:
   * Babel inlines EXPO_PUBLIC_* at build time, so they are literals by the time
   * this runs and a test cannot reach them by mutating `process.env`.
   */
  it('takes its configuration as an argument rather than reading the environment', () => {
    const before = process.env.EXPO_PUBLIC_SUPABASE_URL;
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mutated.example.com';

    expect(createSupabaseClient(CONFIG)).not.toBeNull();

    process.env.EXPO_PUBLIC_SUPABASE_URL = before;
  });
});

describe('getSupabaseClient', () => {
  /**
   * `createClient` starts a token-refresh timer, so two clients would race each
   * other refreshing the same session.
   */
  it('builds the client once and hands back the same one', () => {
    expect(getSupabaseClient(CONFIG)).toBe(getSupabaseClient(CONFIG));
  });

  it('caches the unconfigured answer too', () => {
    expect(getSupabaseClient({ url: '', publishableKey: '' })).toBeNull();
    // Cached, so a later call with real config does not quietly change its mind
    // half way through a session.
    expect(getSupabaseClient(CONFIG)).toBeNull();
  });

  it('rebuilds after a reset', () => {
    const first = getSupabaseClient(CONFIG);
    resetSupabaseClient();

    expect(getSupabaseClient(CONFIG)).not.toBe(first);
  });
});

describe('isSyncConfigured', () => {
  it('is false without credentials and true with them', () => {
    expect(isSyncConfigured({ url: '', publishableKey: '' })).toBe(false);
    resetSupabaseClient();
    expect(isSyncConfigured(CONFIG)).toBe(true);
  });
});
