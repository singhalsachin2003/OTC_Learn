import { fireEvent, screen } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';

import { SettingsRows } from '../../src/screens/Profile/components/SettingsRows';
import { createStore } from '../../src/store';
import { reminderTimeLabel } from '../../src/utils/notifications';
import { renderWithStore } from '../helpers/renderWithStore';

const getPermissions = Notifications.getPermissionsAsync as jest.Mock;
const requestPermissions = Notifications.requestPermissionsAsync as jest.Mock;
const schedule = Notifications.scheduleNotificationAsync as jest.Mock;
const cancel = Notifications.cancelScheduledNotificationAsync as jest.Mock;

/** The OS answer the whole reminder row hangs off. */
function permission(status: 'granted' | 'denied') {
  getPermissions.mockResolvedValue({ status });
  requestPermissions.mockResolvedValue({ status });
}

describe('SettingsRows', () => {
  beforeEach(() => {
    permission('granted');
  });

  it('names the hour the reminder will arrive', async () => {
    await renderWithStore(<SettingsRows />);

    expect(screen.getByText(`A nudge at ${reminderTimeLabel()}`)).toBeTruthy();
  });

  it('flips a pure preference and asks the OS for nothing', async () => {
    const store = createStore();
    await renderWithStore(<SettingsRows />, { store });
    expect(store.getState().settings.settings.haptics).toBe(true);

    await fireEvent.press(screen.getByTestId('setting-haptics'));

    expect(store.getState().settings.settings.haptics).toBe(false);
    expect(schedule).not.toHaveBeenCalled();
  });

  it('schedules the reminder when the OS allows it', async () => {
    const store = createStore();
    await renderWithStore(<SettingsRows />, { store });

    await fireEvent.press(screen.getByTestId('setting-dailyReminder'));

    expect(schedule).toHaveBeenCalled();
    expect(store.getState().settings.settings.dailyReminder).toBe(true);
  });

  /**
   * The OS owns whether a notification can be shown, so a refused permission
   * must leave the toggle off. A switch that flipped anyway would be claiming
   * something the device will not do.
   */
  it('leaves the toggle off and says why when permission is refused', async () => {
    permission('denied');
    const store = createStore();
    await renderWithStore(<SettingsRows />, { store });

    await fireEvent.press(screen.getByTestId('setting-dailyReminder'));

    expect(store.getState().settings.settings.dailyReminder).toBe(false);
    expect(
      screen.getByText(
        'Notifications are turned off for OTC Learn in system settings',
      ),
    ).toBeTruthy();
  });

  it('cancels the reminder and clears the refusal note when turned back off', async () => {
    const store = createStore();
    await renderWithStore(<SettingsRows />, { store });

    // Refused once, so the row is explaining itself...
    permission('denied');
    await fireEvent.press(screen.getByTestId('setting-dailyReminder'));
    expect(store.getState().settings.settings.dailyReminder).toBe(false);

    // ...then granted, turned on, and turned off again.
    permission('granted');
    await fireEvent.press(screen.getByTestId('setting-dailyReminder'));
    expect(store.getState().settings.settings.dailyReminder).toBe(true);

    await fireEvent.press(screen.getByTestId('setting-dailyReminder'));

    expect(cancel).toHaveBeenCalled();
    expect(store.getState().settings.settings.dailyReminder).toBe(false);
    expect(screen.getByText(`A nudge at ${reminderTimeLabel()}`)).toBeTruthy();
  });
});
