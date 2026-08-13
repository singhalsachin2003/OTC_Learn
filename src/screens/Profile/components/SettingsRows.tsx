import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Toggle } from '../../../components/ui/Toggle';
import { useAppDispatch, useSettings } from '../../../hooks/useAppState';
import type { ToggleableSetting } from '../../../store/slices/settingsSlice';
import { updateSetting } from '../../../store/thunks/settingsThunks';
import { colors, spacing, typography } from '../../../theme';
import { track } from '../../../utils/analytics';
import {
  cancelDailyReminder,
  reminderTimeLabel,
  scheduleDailyReminder,
} from '../../../utils/notifications';

interface Row {
  key: ToggleableSetting;
  name: string;
  note: string;
}

const ROWS: Row[] = [
  {
    key: 'spacedRepetition',
    name: 'Spaced repetition',
    note: 'Bring missed questions back on a schedule',
  },
  {
    key: 'dailyReminder',
    name: 'Daily reminder',
    note: `A nudge at ${reminderTimeLabel()}`,
  },
  {
    key: 'timedQuizzes',
    name: 'Show a timer',
    note: 'Count up while you answer',
  },
  {
    key: 'haptics',
    name: 'Haptic feedback',
    note: 'A small buzz when you answer',
  },
];

export function SettingsRows() {
  const dispatch = useAppDispatch();
  const settings = useSettings();

  // The OS owns whether a notification can be shown. If scheduling fails the
  // toggle must not claim otherwise, so the row explains why instead.
  const [reminderBlocked, setReminderBlocked] = useState(false);

  const onToggleReminder = useCallback(async () => {
    if (settings.dailyReminder) {
      await cancelDailyReminder();
      setReminderBlocked(false);
      void dispatch(updateSetting('dailyReminder'));
      track({ name: 'reminder_toggled', enabled: false });
      return;
    }

    const scheduled = await scheduleDailyReminder();
    setReminderBlocked(!scheduled);
    if (scheduled) {
      void dispatch(updateSetting('dailyReminder'));
      track({ name: 'reminder_toggled', enabled: true });
    }
  }, [dispatch, settings.dailyReminder]);

  return (
    <View testID="settings-rows" style={styles.group}>
      {ROWS.map((row) => (
        <View key={row.key} style={styles.row}>
          <View style={styles.text}>
            <Text style={styles.name}>{row.name}</Text>
            <Text style={styles.note}>
              {row.key === 'dailyReminder' && reminderBlocked
                ? 'Notifications are turned off for OTC Learn in system settings'
                : row.note}
            </Text>
          </View>
          <Toggle
            testID={`setting-${row.key}`}
            accessibilityLabel={row.name}
            value={settings[row.key]}
            onToggle={() => {
              if (row.key === 'dailyReminder') {
                void onToggleReminder();
                return;
              }
              // Everything else is a pure preference: flip it and persist.
              void dispatch(updateSetting(row.key));
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    paddingVertical: 14,
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  text: {
    flex: 1,
  },
  name: {
    ...typography.body2,
    color: colors.text.primary,
  },
  note: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 3,
  },
});
