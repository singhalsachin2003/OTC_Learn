import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  clampSessionSize,
  defaultSettings,
  type StoredSettings,
} from '../../utils/storage';

export interface SettingsState {
  settings: StoredSettings;
  /** Null until the user names themselves; the UI shows a prompt instead. */
  name: string | null;
  /** False until storage has been read, so the UI can avoid a flash of defaults. */
  hydrated: boolean;
}

export const initialSettingsState: SettingsState = {
  // A copy: `resetSettings` returns this object, and handing the module
  // singleton to immer freezes `defaultSettings` for every later reader of it.
  settings: { ...defaultSettings },
  name: null,
  hydrated: false,
};

export type ToggleableSetting = Exclude<keyof StoredSettings, 'sessionSize'>;

/** See the note in `progressSlice` — slices never import thunks. */
const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    toggleSetting(state, action: PayloadAction<ToggleableSetting>) {
      state.settings[action.payload] = !state.settings[action.payload];
    },

    setSessionSize(state, action: PayloadAction<number>) {
      state.settings.sessionSize = clampSessionSize(action.payload);
    },

    /** An empty or blank name clears back to the unnamed state. */
    setName(state, action: PayloadAction<string | null>) {
      const trimmed = action.payload?.trim() ?? '';
      state.name = trimmed === '' ? null : trimmed;
    },

    setSettings(state, action: PayloadAction<StoredSettings>) {
      state.settings = action.payload;
    },

    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },

    resetSettings() {
      return { ...initialSettingsState, hydrated: true };
    },
  },
});

export const {
  toggleSetting,
  setSessionSize,
  setName,
  setSettings,
  setHydrated,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

/** Initials for the avatar. Two letters at most, uppercased. */
export function initialsFor(name: string | null): string {
  if (name === null) {
    return '·';
  }
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '·';
  }
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}
