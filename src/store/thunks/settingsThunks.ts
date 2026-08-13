import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  saveProfile,
  saveSettings,
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
  await saveSettings(updated);
  return updated;
});

export const updateSessionSize = createAsyncThunk<
  StoredSettings,
  number,
  { state: RootState }
>('settings/updateSessionSize', async (size, { dispatch, getState }) => {
  dispatch(setSessionSize(size));
  const updated = getState().settings.settings;
  await saveSettings(updated);
  return updated;
});

export const updateName = createAsyncThunk<
  string | null,
  string | null,
  { state: RootState }
>('settings/updateName', async (name, { dispatch, getState }) => {
  dispatch(setName(name));
  const stored = getState().settings.name;
  await saveProfile({ name: stored });
  return stored;
});
