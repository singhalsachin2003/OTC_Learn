import * as Notifications from 'expo-notifications';

import {
  cancelDailyReminder,
  isReminderScheduled,
  REMINDER_HOUR,
  REMINDER_MINUTE,
  reminderTimeLabel,
  scheduleDailyReminder,
  syncReminder,
} from '../../src/utils/notifications';

/**
 * The identifier the module schedules under. It is deliberately hard-coded here
 * rather than imported: it is a value the OS holds between launches, so a build
 * that changed it would orphan the alarm an earlier build set, and this test is
 * what makes that change visible.
 */
const IDENTIFIER = 'otc-learn-daily-reminder';

const permission = (status: string) =>
  ({ status }) as unknown as Notifications.NotificationPermissionsStatus;

const request = (identifier: string) =>
  ({ identifier }) as unknown as Notifications.NotificationRequest;

const getPermissions = jest.mocked(Notifications.getPermissionsAsync);
const requestPermissions = jest.mocked(Notifications.requestPermissionsAsync);
const schedule = jest.mocked(Notifications.scheduleNotificationAsync);
const cancel = jest.mocked(Notifications.cancelScheduledNotificationAsync);
const getScheduled = jest.mocked(Notifications.getAllScheduledNotificationsAsync);

describe('daily reminder', () => {
  beforeEach(() => {
    // The global mock is shared across files, so each test restates the whole
    // OS state rather than inheriting whatever the last one left behind.
    jest.clearAllMocks();
    getPermissions.mockResolvedValue(permission('granted'));
    requestPermissions.mockResolvedValue(permission('granted'));
    schedule.mockResolvedValue('scheduled-id');
    cancel.mockResolvedValue(undefined);
    getScheduled.mockResolvedValue([]);
  });

  describe('scheduleDailyReminder', () => {
    it('schedules a daily notification at the reminder time', async () => {
      await expect(scheduleDailyReminder()).resolves.toBe(true);

      expect(schedule).toHaveBeenCalledTimes(1);
      expect(schedule).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: IDENTIFIER,
          trigger: expect.objectContaining({
            hour: REMINDER_HOUR,
            minute: REMINDER_MINUTE,
          }),
        }),
      );
    });

    // Two alarms a day would read as a bug in the app, not in the OS, so the
    // cancel has to happen first every time rather than only on a reschedule.
    it('cancels the existing alarm before scheduling a new one', async () => {
      await scheduleDailyReminder();

      expect(cancel).toHaveBeenCalledWith(IDENTIFIER);
      expect(cancel.mock.invocationCallOrder[0]).toBeLessThan(
        schedule.mock.invocationCallOrder[0],
      );
    });

    it('schedules even when there is no alarm to cancel', async () => {
      cancel.mockRejectedValueOnce(new Error('no such notification'));

      await expect(scheduleDailyReminder()).resolves.toBe(true);
      expect(schedule).toHaveBeenCalledTimes(1);
    });

    it('asks for permission when it has not been decided yet', async () => {
      getPermissions.mockResolvedValue(permission('undetermined'));

      await expect(scheduleDailyReminder()).resolves.toBe(true);
      expect(requestPermissions).toHaveBeenCalledTimes(1);
    });

    it('does not ask again when permission is already granted', async () => {
      await scheduleDailyReminder();

      expect(requestPermissions).not.toHaveBeenCalled();
    });

    // False is what tells the caller to leave its toggle off: a switch showing
    // "on" with no permission behind it would be a lie the user cannot see.
    it('reports failure and schedules nothing when permission is refused', async () => {
      getPermissions.mockResolvedValue(permission('denied'));
      requestPermissions.mockResolvedValue(permission('denied'));

      await expect(scheduleDailyReminder()).resolves.toBe(false);
      expect(schedule).not.toHaveBeenCalled();
    });

    it('reports failure when the OS rejects the schedule', async () => {
      schedule.mockRejectedValueOnce(new Error('scheduling unavailable'));

      await expect(scheduleDailyReminder()).resolves.toBe(false);
    });

    it('reports failure when the permission check itself throws', async () => {
      getPermissions.mockRejectedValueOnce(new Error('service unavailable'));

      await expect(scheduleDailyReminder()).resolves.toBe(false);
      expect(schedule).not.toHaveBeenCalled();
    });
  });

  describe('cancelDailyReminder', () => {
    it('cancels the reminder by its identifier', async () => {
      await cancelDailyReminder();

      expect(cancel).toHaveBeenCalledWith(IDENTIFIER);
    });

    it('treats cancelling something not scheduled as a success', async () => {
      cancel.mockRejectedValueOnce(new Error('no such notification'));

      await expect(cancelDailyReminder()).resolves.toBeUndefined();
    });
  });

  describe('isReminderScheduled', () => {
    it('finds the reminder among the scheduled notifications', async () => {
      getScheduled.mockResolvedValue([
        request('something-else'),
        request(IDENTIFIER),
      ]);

      await expect(isReminderScheduled()).resolves.toBe(true);
    });

    it('reports false when only other notifications are scheduled', async () => {
      getScheduled.mockResolvedValue([request('something-else')]);

      await expect(isReminderScheduled()).resolves.toBe(false);
    });

    it('reports false when the OS cannot be asked', async () => {
      getScheduled.mockRejectedValueOnce(new Error('service unavailable'));

      await expect(isReminderScheduled()).resolves.toBe(false);
    });
  });

  describe('syncReminder', () => {
    // A reinstall or a restore to a new device carries the preference across
    // but not the alarm, so the OS has to be brought back into line with it.
    it('reschedules when the preference is on but nothing is scheduled', async () => {
      getScheduled.mockResolvedValue([]);

      await expect(syncReminder(true)).resolves.toBe(true);
      expect(schedule).toHaveBeenCalledTimes(1);
    });

    it('reports false when the repair cannot be made', async () => {
      getScheduled.mockResolvedValue([]);
      getPermissions.mockResolvedValue(permission('denied'));
      requestPermissions.mockResolvedValue(permission('denied'));

      await expect(syncReminder(true)).resolves.toBe(false);
    });

    it('cancels when the preference is off but something is scheduled', async () => {
      getScheduled.mockResolvedValue([request(IDENTIFIER)]);

      await expect(syncReminder(false)).resolves.toBe(false);
      expect(cancel).toHaveBeenCalledWith(IDENTIFIER);
      expect(schedule).not.toHaveBeenCalled();
    });

    it('leaves an already-scheduled reminder alone', async () => {
      getScheduled.mockResolvedValue([request(IDENTIFIER)]);

      await expect(syncReminder(true)).resolves.toBe(true);
      expect(schedule).not.toHaveBeenCalled();
      expect(cancel).not.toHaveBeenCalled();
    });

    it('does nothing when the preference is off and nothing is scheduled', async () => {
      getScheduled.mockResolvedValue([]);

      await expect(syncReminder(false)).resolves.toBe(false);
      expect(cancel).not.toHaveBeenCalled();
      expect(schedule).not.toHaveBeenCalled();
    });
  });

  describe('reminderTimeLabel', () => {
    it('reads as a twelve-hour clock time', () => {
      expect(reminderTimeLabel()).toBe('7:30pm');
    });
  });
});
