import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  saveProfile,
  saveSettings,
  saveSyncMeta,
  type StoredSettings,
} from '../../utils/storage';
import type { RootState } from '../index';
import {
  setName,
  setSessionSize,
  toggleSetting,
  type ToggleableSetting,
} from '../slices/settingsSlice';

/** Flips a boolean setting and persists the whole settings object. */
export const updateSetting = createAsyncThunk<
  StoredSettings,
  ToggleableSetting,
  { state: RootState }
>('settings/update', async (key, { dispatch, getState }) => {
  dispatch(toggleSetting(key));
  const updated = getState().settings.settings;
  // Stamped alongside, because settings merge as a whole row and the row itself
  // carries no time. Without this a change made offline loses to whatever the
  // server last saw, the first time the app syncs after a restart.
  await Promise.all([
    saveSettings(updated),
    saveSyncMeta({ settingsUpdatedAt: Date.now() }),
  ]);
  return updated;
});

export const updateSessionSize = createAsyncThunk<
  StoredSettings,
  number,
  { state: RootState }
>('settings/updateSessionSize', async (size, { dispatch, getState }) => {
  dispatch(setSessionSize(size));
  const updated = getState().settings.settings;
  await Promise.all([
    saveSettings(updated),
    saveSyncMeta({ settingsUpdatedAt: Date.now() }),
  ]);
  return updated;
});

export const updateName = createAsyncThunk<
  string | null,
  string | null,
  { state: RootState }
>('settings/updateName', async (name, { dispatch, getState }) => {
  dispatch(setName(name));
  const stored = getState().settings.name;
  await Promise.all([
    saveProfile({ name: stored }),
    saveSyncMeta({ profileUpdatedAt: Date.now() }),
  ]);
  return stored;
});
