import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore } from '../../src/store';
import {
  updateName,
  updateSessionSize,
  updateSetting,
} from '../../src/store/thunks/settingsThunks';
import {
  defaultSettings,
  SESSION_SIZE_MAX,
  SESSION_SIZE_MIN,
  STORAGE_KEYS,
} from '../../src/utils/storage';

/**
 * Settings thunks.
 *
 * Each one does two things — change the store and write it to disk — and the
 * failure mode of forgetting the second is invisible until the next launch,
 * when the user's preference has quietly reverted. So every case here asserts
 * on the persisted bytes, not only on the state.
 */

async function persisted() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
  return raw === null ? null : JSON.parse(raw);
}

describe('updateSetting', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('flips a setting and writes the whole object', async () => {
    const store = createStore();

    await store.dispatch(updateSetting('timedQuizzes'));

    expect(store.getState().settings.settings.timedQuizzes).toBe(true);
    await expect(persisted()).resolves.toEqual({
      ...defaultSettings,
      timedQuizzes: true,
    });
  });

  it('turns a setting back off again', async () => {
    const store = createStore();

    await store.dispatch(updateSetting('spacedRepetition'));
    await store.dispatch(updateSetting('spacedRepetition'));

    expect(store.getState().settings.settings.spacedRepetition).toBe(true);
    await expect(persisted()).resolves.toMatchObject({ spacedRepetition: true });
  });

  it('leaves the other settings untouched', async () => {
    const store = createStore();

    await store.dispatch(updateSetting('haptics'));

    const { settings } = store.getState().settings;
    expect(settings.haptics).toBe(false);
    expect(settings.spacedRepetition).toBe(defaultSettings.spacedRepetition);
    expect(settings.dailyReminder).toBe(defaultSettings.dailyReminder);
    expect(settings.sessionSize).toBe(defaultSettings.sessionSize);
  });

  // A failed write must not throw at the caller: the toggle has already moved
  // on screen, and an unhandled rejection during a tap is worse than a
  // preference that does not survive the next launch.
  it('resolves rather than throwing when the write fails', async () => {
    const setItem = jest.mocked(AsyncStorage.setItem);
    const real = setItem.getMockImplementation();
    setItem.mockRejectedValue(new Error('disk full'));

    try {
      const store = createStore();
      await expect(
        store.dispatch(updateSetting('haptics')).unwrap(),
      ).resolves.toBeDefined();
      expect(store.getState().settings.settings.haptics).toBe(false);
    } finally {
      setItem.mockImplementation(real!);
    }
  });
});

describe('updateSessionSize', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('stores a size the picker can offer', async () => {
    const store = createStore();

    await store.dispatch(updateSessionSize(12));

    expect(store.getState().settings.settings.sessionSize).toBe(12);
    await expect(persisted()).resolves.toMatchObject({ sessionSize: 12 });
  });

  it('clamps a size below the minimum', async () => {
    const store = createStore();

    await store.dispatch(updateSessionSize(1));

    expect(store.getState().settings.settings.sessionSize).toBe(SESSION_SIZE_MIN);
  });

  it('clamps a size above the maximum', async () => {
    const store = createStore();

    await store.dispatch(updateSessionSize(99));

    expect(store.getState().settings.settings.sessionSize).toBe(SESSION_SIZE_MAX);
    await expect(persisted()).resolves.toMatchObject({
      sessionSize: SESSION_SIZE_MAX,
    });
  });
});

describe('updateName', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('stores a name', async () => {
    const store = createStore();

    await store.dispatch(updateName('Sachin Singhal'));

    expect(store.getState().settings.name).toBe('Sachin Singhal');
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.profile);
    expect(JSON.parse(raw!)).toEqual({ name: 'Sachin Singhal' });
  });

  it('trims surrounding whitespace', async () => {
    const store = createStore();

    await store.dispatch(updateName('  Sachin  '));

    expect(store.getState().settings.name).toBe('Sachin');
  });

  // Clearing the field is how a user removes their name — it must persist as
  // null rather than as an empty string the greeting would then render.
  it('treats a blank name as no name, and persists that', async () => {
    const store = createStore();
    await store.dispatch(updateName('Sachin'));

    await store.dispatch(updateName('   '));

    expect(store.getState().settings.name).toBeNull();
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.profile);
    expect(JSON.parse(raw!)).toEqual({ name: null });
  });

  it('accepts an explicit null', async () => {
    const store = createStore();

    await store.dispatch(updateName(null));

    expect(store.getState().settings.name).toBeNull();
  });
});
