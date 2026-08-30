import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { ProfileScreen } from '../../src/screens/Profile/ProfileScreen';
import { createStore, type AppStore } from '../../src/store';
import { setNotes } from '../../src/store/slices/notesSlice';
import {
  recordQuestionResult,
  toggleBookmark,
} from '../../src/store/slices/progressSlice';
import { setName } from '../../src/store/slices/settingsSlice';
import { setSession } from '../../src/store/slices/syncSlice';
import { renderWithStore } from '../helpers/renderWithStore';

type AlertButton = { text?: string; onPress?: () => void };

let alert: jest.SpyInstance;

/** Taps a button on the most recent Alert, as the OS dialog would. */
async function pressAlertButton(text: string) {
  const buttons = alert.mock.calls[alert.mock.calls.length - 1][2] as
    AlertButton[] | undefined;
  const button = buttons?.find((b) => b.text === text);
  if (button === undefined) {
    throw new Error(`No "${text}" button on the alert`);
  }
  await act(async () => {
    button.onPress?.();
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  alert.mockRestore();
});

describe('ProfileScreen', () => {
  it('offers to take a name and stores it', async () => {
    const store = createStore();
    await renderWithStore(<ProfileScreen />, { store });

    expect(screen.getByText('Add your name')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('profile-name'));
    await fireEvent.changeText(screen.getByTestId('profile-name-input'), 'Sachin');
    await fireEvent(screen.getByTestId('profile-name-input'), 'submitEditing');

    expect(store.getState().settings.name).toBe('Sachin');
    expect(screen.getByText('Sachin')).toBeTruthy();
  });

  /**
   * Blanking the field is how a name is removed — `setName` treats whitespace
   * as unnamed, so there is no separate destructive control.
   */
  it('clears the name when the field is emptied', async () => {
    const store = createStore();
    store.dispatch(setName('Sachin'));
    await renderWithStore(<ProfileScreen />, { store });

    await fireEvent.press(screen.getByTestId('profile-name'));
    await fireEvent.changeText(screen.getByTestId('profile-name-input'), '   ');
    await fireEvent(screen.getByTestId('profile-name-input'), 'blur');

    expect(store.getState().settings.name).toBeNull();
    expect(screen.getByText('Add your name')).toBeTruthy();
  });

  it('counts the notes the user has written', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        irs: {
          body: 'Fixed against floating.',
          updatedOn: '2026-08-28',
          updatedAt: 0,
        },
        cds: {
          body: 'Protection buyer is short credit.',
          updatedOn: '2026-08-29',
          updatedAt: 0,
        },
      }),
    );
    await renderWithStore(<ProfileScreen />, { store });

    expect(screen.getByTestId('profile-notes')).toHaveTextContent('Notes2  ›');
  });

  it.each([
    ['profile-exam', 'exam'],
    ['profile-insights', 'insights'],
    ['profile-achievements', 'achievements'],
    ['profile-glossary', 'glossary'],
    ['profile-notes', 'notes'],
    ['profile-account', 'account'],
    ['profile-saved', 'products'],
  ])('opens %s', async (testID, expected) => {
    const store = createStore();
    await renderWithStore(<ProfileScreen />, { store });

    await fireEvent.press(screen.getByTestId(testID));

    expect(store.getState().app.currentScreen).toBe(expected);
  });

  /** Sync is off until someone signs in, and the row must not imply otherwise. */
  it('reports the account as off until signed in', async () => {
    await renderWithStore(<ProfileScreen />);

    expect(screen.getByTestId('profile-account')).toHaveTextContent(
      'AccountOff  ›',
    );
    expect(
      screen.getByText(/Sign in if you want your progress to survive a reinstall/),
    ).toBeTruthy();
  });

  it('names the account once signed in', async () => {
    const store = createStore();
    store.dispatch(setSession({ userId: 'u1', email: 'student@example.com' }));
    await renderWithStore(<ProfileScreen />, { store });

    expect(screen.getByTestId('profile-account')).toHaveTextContent(
      'Accountstudent@example.com  ›',
    );
    expect(screen.getByText(/backed up to your account/)).toBeTruthy();
  });

  /** The queue count is a read-out, not a way in — there is a tab for that. */
  it('leaves the review-queue row inert', async () => {
    const store = createStore();
    await renderWithStore(<ProfileScreen />, { store });

    await fireEvent.press(screen.getByText('In the review queue'));

    expect(store.getState().app.currentScreen).toBe('home');
  });

  it('confirms before resetting, and does nothing if cancelled', async () => {
    const store = createStore();
    answerSomething(store);
    await renderWithStore(<ProfileScreen />, { store });

    await fireEvent.press(screen.getByTestId('profile-reset'));

    expect(alert).toHaveBeenCalled();
    expect(answeredCount(store)).toBe(2);
    expect(store.getState().progress.bookmarkedProductIds).toEqual(['irs']);
  });

  it('wipes progress and returns home once the reset is confirmed', async () => {
    const store = createStore();
    answerSomething(store);
    await renderWithStore(<ProfileScreen />, { store });

    await fireEvent.press(screen.getByTestId('profile-reset'));
    await pressAlertButton('Reset everything');

    expect(answeredCount(store)).toBe(0);
    expect(store.getState().progress.bookmarkedProductIds).toEqual([]);
    expect(store.getState().app.currentScreen).toBe('home');
  });
});

/** Enough progress that a reset has something visible to undo. */
function answerSomething(store: AppStore) {
  store.dispatch(recordQuestionResult({ questionId: 'irs-q1', correct: true }));
  store.dispatch(recordQuestionResult({ questionId: 'irs-q2', correct: false }));
  store.dispatch(toggleBookmark('irs'));
}

function answeredCount(store: AppStore) {
  return Object.keys(store.getState().progress.questionHistory).length;
}
