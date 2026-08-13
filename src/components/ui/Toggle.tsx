import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { colors, radius } from '../../theme';

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 28;
const KNOB = 22;
const INSET = 3;

export interface ToggleProps {
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

/** A switch. The knob slides and the track cross-fades over 180ms. */
export function Toggle({
  value,
  onToggle,
  disabled = false,
  testID,
  accessibilityLabel,
}: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      // Interpolating backgroundColor rules out the native driver.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [INSET, TRACK_WIDTH - KNOB - INSET],
  });
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.trackDot, colors.success.strong],
  });

  return (
    <Pressable
      testID={testID}
      onPress={onToggle}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={[styles.track, { backgroundColor }, disabled && styles.disabled]}
      >
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.card,
    shadowColor: colors.text.primary,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  disabled: {
    opacity: 0.4,
  },
});
