import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface RingProps {
  /** Outer diameter. */
  size: number;
  /** Diameter of the hole; the difference sets the stroke width. */
  innerSize: number;
  /** 0–100. Values outside are clamped. */
  percent: number;
  fillColor?: string;
  trackColor?: string;
  children?: ReactNode;
  /** Skip the sweep animation — used where a ring appears in a long list. */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * A progress ring drawn as a stroked SVG arc.
 *
 * The design calls for a conic gradient, which React Native cannot render — an
 * arc with a dash offset gives the same read, anti-aliases properly, and is the
 * only shape here that can be animated cheaply: `strokeDashoffset` is a single
 * numeric prop, so the sweep runs without re-laying out anything.
 */
export function Ring({
  size,
  innerSize,
  percent,
  fillColor = colors.progressFill,
  trackColor = colors.track,
  children,
  animated = true,
  style,
  testID,
  accessibilityLabel,
}: RingProps) {
  const stroke = (size - innerSize) / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(
    0,
    Math.min(100, Number.isFinite(percent) ? percent : 0),
  );

  // Starts at the target when animation is off, so a list of rings paints in
  // its final state on first frame rather than sweeping twenty times at once.
  const sweep = useRef(new Animated.Value(animated ? 0 : clamped)).current;
  const target = useRef(animated ? 0 : clamped);

  useEffect(() => {
    // Nothing to sweep between. Worth checking rather than animating anyway:
    // an untouched catalogue is a screen full of rings at zero, and each one
    // would otherwise run a 650ms animation from 0 to 0 on every mount.
    if (!animated || target.current === clamped) {
      sweep.setValue(clamped);
      target.current = clamped;
      return;
    }
    target.current = clamped;

    const animation = Animated.timing(sweep, {
      toValue: clamped,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      // strokeDashoffset is an SVG prop, not a transform, so it cannot be
      // driven on the native thread.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [clamped, animated, sweep]);

  const dashoffset = sweep.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={[{ width: size, height: size }, styles.container, style]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {clamped > 0 && (
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={fillColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            // Start the sweep at 12 o'clock rather than 3.
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
