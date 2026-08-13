import reducer, {
  initialsFor,
  initialSettingsState,
  resetSettings,
  setHydrated,
  setName,
  setSessionSize,
  setSettings,
  toggleSetting,
} from '../../src/store/slices/settingsSlice';
import { defaultSettings } from '../../src/utils/storage';

describe('settingsSlice', () => {
  it('starts on the defaults, unnamed and unhydrated', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialSettingsState);
    expect(initialSettingsState.settings).toEqual(defaultSettings);
    expect(initialSettingsState.name).toBeNull();
    expect(initialSettingsState.hydrated).toBe(false);
  });
});

describe('settingsSlice toggles', () => {
  it('turns a setting that starts on off', () => {
    const state = reducer(initialSettingsState, toggleSetting('haptics'));

    expect(state.settings.haptics).toBe(false);
  });

  it('turns a setting that starts off on', () => {
    const state = reducer(initialSettingsState, toggleSetting('dailyReminder'));

    expect(state.settings.dailyReminder).toBe(true);
  });

  it('returns to the original value on a second toggle', () => {
    const once = reducer(initialSettingsState, toggleSetting('spacedRepetition'));
    const twice = reducer(once, toggleSetting('spacedRepetition'));

    expect(twice.settings).toEqual(defaultSettings);
  });

  it('leaves the other settings alone', () => {
    const state = reducer(initialSettingsState, toggleSetting('timedQuizzes'));

    expect(state.settings).toEqual({ ...defaultSettings, timedQuizzes: true });
  });
});

describe('settingsSlice session size', () => {
  it('accepts a size inside the allowed range', () => {
    const state = reducer(initialSettingsState, setSessionSize(9));

    expect(state.settings.sessionSize).toBe(9);
  });

  // The bounds exist because the smallest banks cannot fill a longer paper and
  // a longer sitting stops being a quick session.
  it('clamps a size below the floor up to three', () => {
    expect(
      reducer(initialSettingsState, setSessionSize(1)).settings.sessionSize,
    ).toBe(3);
    expect(
      reducer(initialSettingsState, setSessionSize(0)).settings.sessionSize,
    ).toBe(3);
    expect(
      reducer(initialSettingsState, setSessionSize(-5)).settings.sessionSize,
    ).toBe(3);
  });

  it('clamps a size above the ceiling down to twelve', () => {
    expect(
      reducer(initialSettingsState, setSessionSize(20)).settings.sessionSize,
    ).toBe(12);
  });

  it('keeps the boundary values themselves', () => {
    expect(
      reducer(initialSettingsState, setSessionSize(3)).settings.sessionSize,
    ).toBe(3);
    expect(
      reducer(initialSettingsState, setSessionSize(12)).settings.sessionSize,
    ).toBe(12);
  });
});

describe('settingsSlice name', () => {
  it('stores the name the user typed', () => {
    const state = reducer(initialSettingsState, setName('Ada'));

    expect(state.name).toBe('Ada');
  });

  // The field is a plain text input, so stray spaces from a paste or an
  // autocorrect must not become part of the stored name.
  it('trims the surrounding whitespace', () => {
    const state = reducer(initialSettingsState, setName('  Ada Lovelace  '));

    expect(state.name).toBe('Ada Lovelace');
  });

  it('treats a blank name as unnamed', () => {
    const named = reducer(initialSettingsState, setName('Ada'));

    expect(reducer(named, setName('')).name).toBeNull();
    expect(reducer(named, setName('   ')).name).toBeNull();
  });

  it('clears the name when passed null', () => {
    const named = reducer(initialSettingsState, setName('Ada'));

    expect(reducer(named, setName(null)).name).toBeNull();
  });
});

describe('settingsSlice hydration', () => {
  it('replaces the settings wholesale', () => {
    const stored = {
      spacedRepetition: false,
      timedQuizzes: true,
      haptics: false,
      dailyReminder: true,
      sessionSize: 10,
    };

    expect(reducer(initialSettingsState, setSettings(stored)).settings).toEqual(
      stored,
    );
  });

  it('tracks the hydration flag', () => {
    const state = reducer(initialSettingsState, setHydrated(true));

    expect(state.hydrated).toBe(true);
    expect(reducer(state, setHydrated(false)).hydrated).toBe(false);
  });

  // Reset comes after storage has already been read, so the UI must not fall
  // back to its pre-hydration placeholder afterwards.
  it('returns to the defaults but stays hydrated on reset', () => {
    let state = reducer(initialSettingsState, setName('Ada'));
    state = reducer(state, toggleSetting('haptics'));
    state = reducer(state, setSessionSize(12));

    const reset = reducer(state, resetSettings());

    expect(reset.settings).toEqual(defaultSettings);
    expect(reset.name).toBeNull();
    expect(reset.hydrated).toBe(true);
  });
});

describe('initialsFor', () => {
  it('takes the first and last initials of a full name', () => {
    expect(initialsFor('Ada Lovelace')).toBe('AL');
  });

  it('skips the middle names', () => {
    expect(initialsFor('Ada Byron King Lovelace')).toBe('AL');
  });

  it('takes a single initial from a one-word name', () => {
    expect(initialsFor('Ada')).toBe('A');
  });

  it('uppercases whatever the user typed', () => {
    expect(initialsFor('ada lovelace')).toBe('AL');
  });

  // The avatar is rendered before the user has named themselves, and from
  // whatever they typed, so neither absence nor whitespace may leave it blank.
  it('falls back to a placeholder for an unnamed user', () => {
    expect(initialsFor(null)).toBe('·');
  });

  it('falls back to a placeholder for a blank name', () => {
    expect(initialsFor('')).toBe('·');
    expect(initialsFor('   ')).toBe('·');
  });

  it('ignores the extra spaces between names', () => {
    expect(initialsFor('  Ada   Lovelace ')).toBe('AL');
  });
});
