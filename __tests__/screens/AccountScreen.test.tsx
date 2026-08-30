import { fireEvent, screen } from '@testing-library/react-native';

import { AccountScreen } from '../../src/screens/Account/AccountScreen';
import { createStore, type AppStore } from '../../src/store';
import {
  setSession,
  syncFailed,
  syncSucceeded,
} from '../../src/store/slices/syncSlice';
import { getSupabaseClient, resetSupabaseClient } from '../../src/utils/supabase';
import { renderWithStore } from '../helpers/renderWithStore';

/**
 * `getSupabaseClient` caches its answer, so priming it here is how a test picks
 * which build it is exercising. Without this the tests run as an unconfigured
 * build — which is a real state worth covering, but not the only one.
 */
function configureSync() {
  resetSupabaseClient();
  getSupabaseClient({
    url: 'https://example.supabase.co',
    publishableKey: 'sb_publishable_test',
  });
}

beforeEach(() => {
  resetSupabaseClient();
});

describe('AccountScreen with no sync configured', () => {
  it('says so rather than offering a form that cannot work', async () => {
    await renderWithStore(<AccountScreen />);

    expect(screen.getByTestId('account-unavailable')).toBeTruthy();
    expect(screen.queryByTestId('account-submit')).toBeNull();
  });

  /** This is the state every build has shipped in so far. */
  it('reassures rather than warns', async () => {
    await renderWithStore(<AccountScreen />);

    expect(
      screen.getByText(/stored on this device, exactly as before/),
    ).toBeTruthy();
  });

  it('returns to profile', async () => {
    const store = createStore();
    await renderWithStore(<AccountScreen />, { store });

    await fireEvent.press(screen.getByTestId('account-back'));

    expect(store.getState().app.currentScreen).toBe('profile');
  });
});

describe('AccountScreen signed out', () => {
  beforeEach(configureSync);

  it('offers a sign-in form', async () => {
    await renderWithStore(<AccountScreen />);

    expect(screen.getByTestId('account-email-input')).toBeTruthy();
    expect(screen.getByTestId('account-password-input')).toBeTruthy();
  });

  /** An account is optional, and the screen has to say so plainly. */
  it('explains what an account buys without implying one is needed', async () => {
    await renderWithStore(<AccountScreen />);

    expect(screen.getByText(/works exactly the same without one/)).toBeTruthy();
  });

  it('will not submit an empty form', async () => {
    await renderWithStore(<AccountScreen />);

    expect(screen.getByTestId('account-submit')).toBeDisabled();
  });

  it('enables the button once both fields are filled', async () => {
    await renderWithStore(<AccountScreen />);

    await fireEvent.changeText(
      screen.getByTestId('account-email-input'),
      'a@example.com',
    );
    await fireEvent.changeText(screen.getByTestId('account-password-input'), 'pw');

    expect(screen.getByTestId('account-submit')).not.toBeDisabled();
  });

  it('switches between signing in and creating an account', async () => {
    await renderWithStore(<AccountScreen />);
    expect(screen.getByTestId('account-submit')).toHaveTextContent('Sign in');

    await fireEvent.press(screen.getByTestId('account-toggle-mode'));

    expect(screen.getByTestId('account-submit')).toHaveTextContent(
      'Create account',
    );
  });

  it('shows why the last attempt failed', async () => {
    const store = createStore();
    store.dispatch(syncFailed('Invalid login credentials'));
    await renderWithStore(<AccountScreen />, { store });

    expect(screen.getByTestId('account-error')).toHaveTextContent(
      'Invalid login credentials',
    );
  });
});

describe('AccountScreen signed in', () => {
  beforeEach(configureSync);

  async function signedIn(): Promise<AppStore> {
    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'student@example.com' }));
    await renderWithStore(<AccountScreen />, { store });
    return store;
  }

  it('names the account and drops the form', async () => {
    await signedIn();

    expect(screen.getByTestId('account-email')).toHaveTextContent(
      'student@example.com',
    );
    expect(screen.queryByTestId('account-email-input')).toBeNull();
  });

  it('admits it has not synced yet rather than implying it has', async () => {
    await signedIn();

    expect(screen.getByTestId('account-last-sync')).toHaveTextContent(
      'Not synced yet',
    );
  });

  it('reports when the last sync finished', async () => {
    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'student@example.com' }));
    store.dispatch(syncSucceeded(Date.parse('2026-08-30T10:00:00Z')));
    await renderWithStore(<AccountScreen />, { store });

    expect(screen.getByTestId('account-last-sync')).not.toHaveTextContent(
      'Not synced yet',
    );
  });

  /**
   * Regression: the error was only rendered on the signed-out branch, so a
   * signed-in user whose sync failed saw "Not synced yet" and no reason at all.
   * Caught by driving the real app, not by these tests — which is why it is
   * here now.
   */
  it('says why a sync failed rather than just showing no timestamp', async () => {
    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'student@example.com' }));
    store.dispatch(syncFailed('JWT expired'));
    await renderWithStore(<AccountScreen />, { store });

    expect(screen.getByTestId('account-last-sync')).toHaveTextContent(
      'Not synced yet',
    );
    expect(screen.getByTestId('account-sync-error')).toHaveTextContent(
      'JWT expired',
    );
  });

  /**
   * Signing out is not a reset. A screen that did not say so would make signing
   * in feel like a risk rather than a safety net.
   */
  it('promises that signing out leaves the device alone', async () => {
    await signedIn();

    expect(
      screen.getByText('Signing out leaves everything on this device untouched.'),
    ).toBeTruthy();
  });

  it('signs out without touching study data', async () => {
    const store = await signedIn();

    await fireEvent.press(screen.getByTestId('account-sign-out'));

    expect(store.getState().sync.userId).toBeNull();
    expect(store.getState().progress.byProduct).toEqual({});
  });
});
