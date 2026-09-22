import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { ThemePicker } from '../../src/screens/Profile/components/ThemePicker';
import { loadSettings, loadSyncMeta } from '../../src/utils/storage';
import { renderWithStore } from '../helpers/renderWithStore';

describe('ThemePicker', () => {
  it('starts on the system setting', async () => {
    await renderWithStore(<ThemePicker />);

    expect(
      screen.getByTestId('theme-system').props.accessibilityState.selected,
    ).toBe(true);
    expect(screen.getByTestId('theme-dark').props.accessibilityState.selected).toBe(
      false,
    );
  });

  it('records the choice in the store', async () => {
    const { store } = await renderWithStore(<ThemePicker />);

    fireEvent.press(screen.getByTestId('theme-dark'));

    expect(store.getState().settings.settings.theme).toBe('dark');
  });

  /**
   * The theme is a property of the device, so it must not stamp the settings
   * row's clock — see the note on `updateTheme`.
   */
  it('persists the choice without stamping the settings row', async () => {
    const before = await loadSyncMeta();

    await renderWithStore(<ThemePicker />);
    fireEvent.press(screen.getByTestId('theme-light'));
    await waitFor(async () => {
      expect((await loadSettings()).theme).toBe('light');
    });

    expect((await loadSyncMeta()).settingsUpdatedAt).toBe(before.settingsUpdatedAt);
  });
});
