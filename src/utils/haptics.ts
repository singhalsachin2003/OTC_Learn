import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback, funnelled through one module.
 *
 * Every call is fire-and-forget and swallows its own failure: a device with no
 * vibrator, or one where the user has disabled system haptics, rejects these
 * calls, and an unhandled rejection during a quiz answer would be absurd. The
 * caller passes whether the user has haptics switched on, so the setting is
 * enforced in one place rather than at every call site.
 */

/** Web has no haptics API; calling through would throw on every tap. */
const supported = Platform.OS === 'ios' || Platform.OS === 'android';

function safely(run: () => Promise<void>): void {
  if (!supported) {
    return;
  }
  void run().catch(() => {
    // Nothing to do — feedback is a nicety, never a requirement.
  });
}

/** A correct answer: the success notification pattern. */
export function hapticSuccess(enabled: boolean): void {
  if (enabled) {
    safely(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    );
  }
}

/** A wrong answer: a warning rather than an error, which reads as punitive. */
export function hapticWarning(enabled: boolean): void {
  if (enabled) {
    safely(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    );
  }
}

/** A light tap for navigation — advancing a lesson step, switching a tab. */
export function hapticSelection(enabled: boolean): void {
  if (enabled) {
    safely(() => Haptics.selectionAsync());
  }
}

/** A heavier knock for a milestone: finishing a quiz, unlocking a badge. */
export function hapticImpact(enabled: boolean): void {
  if (enabled) {
    safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  }
}
