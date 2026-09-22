import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Whether the reader has asked the system to reduce motion.
 *
 * People who turn this on are usually not expressing a preference — vestibular
 * disorders and motion sickness are the common reasons — so the setting is
 * closer to an accessibility requirement than a taste.
 *
 * Honouring it does not mean removing interaction. A card that follows a finger
 * keeps following it, because that is direct manipulation; what goes is the
 * motion the app invents on its own once the finger has left, and the rings
 * that sweep themselves into position on mount.
 *
 * Read once on mount and then watched, because the setting can change while the
 * app is backgrounded — which, for something built around a commute, is most of
 * the time.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let alive = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (alive) setReduced(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReduced(enabled),
    );

    return () => {
      alive = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
