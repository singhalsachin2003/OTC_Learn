import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * The daily study reminder.
 *
 * One local notification, scheduled on the device — there is no push server and
 * no token, so nothing about the user leaves the phone. The OS is the source of
 * truth for whether it is active: permission can be revoked in system settings
 * at any time, and a toggle that kept claiming "on" after that would be lying.
 * `syncReminder` exists to reconcile the two on launch.
 */

const IDENTIFIER = 'otc-learn-daily-reminder';
const CHANNEL_ID = 'study-reminders';

/** Early evening: after work, before the evening gets away from people. */
export const REMINDER_HOUR = 19;
export const REMINDER_MINUTE = 30;

export function reminderTimeLabel(): string {
  const hour = REMINDER_HOUR % 12 === 0 ? 12 : REMINDER_HOUR % 12;
  const suffix = REMINDER_HOUR < 12 ? 'am' : 'pm';
  const minute = String(REMINDER_MINUTE).padStart(2, '0');
  return `${hour}:${minute}${suffix}`;
}

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Android will not show a notification without a channel, and creating one is
 * idempotent, so it is done before every schedule rather than tracked.
 */
async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Study reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Asks for permission only if it has not already been decided.
 *
 * Calling `requestPermissionsAsync` when permission was previously denied does
 * not re-prompt on either platform — it resolves denied immediately — so this
 * reports honestly rather than appearing to hang.
 */
async function ensurePermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

/**
 * Schedules the reminder. Returns whether it is now actually scheduled — false
 * means permission was refused, and the caller should leave its toggle off.
 */
export async function scheduleDailyReminder(): Promise<boolean> {
  if (!supported) {
    return false;
  }
  try {
    if (!(await ensurePermission())) {
      return false;
    }
    await ensureChannel();
    // Cancel first: scheduling twice would otherwise leave two daily alarms.
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER).catch(
      () => undefined,
    );
    await Notifications.scheduleNotificationAsync({
      identifier: IDENTIFIER,
      content: {
        title: 'Five minutes on derivatives',
        body: 'One product, one quiz. Keep the streak going.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
        channelId: CHANNEL_ID,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  if (!supported) {
    return;
  }
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER);
  } catch {
    // Cancelling something that is not scheduled is not a failure.
  }
}

/** Is the reminder currently scheduled with the OS? */
export async function isReminderScheduled(): Promise<boolean> {
  if (!supported) {
    return false;
  }
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.some((item) => item.identifier === IDENTIFIER);
  } catch {
    return false;
  }
}

/**
 * Reconciles the persisted preference with the OS on launch.
 *
 * Returns whether the reminder is genuinely active afterwards. A stored `true`
 * with no scheduled notification — a reinstall, a restore to a new device, a
 * revoked permission — is repaired by rescheduling, and if that fails the
 * caller switches its setting back off.
 */
export async function syncReminder(preferenceEnabled: boolean): Promise<boolean> {
  if (!supported) {
    return false;
  }
  const scheduled = await isReminderScheduled();

  if (preferenceEnabled && !scheduled) {
    return scheduleDailyReminder();
  }
  if (!preferenceEnabled && scheduled) {
    await cancelDailyReminder();
    return false;
  }
  return scheduled;
}
