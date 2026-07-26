import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '../../theme';

export interface ProgressBarProps {
  /** Completion ratio; values outside 0–1 are clamped. */
  progress: number;
  color?: string;
  /** Bar height — 8 on the home card, 6 during a quiz. */
  height?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function ProgressBar({
  progress,
  color = colors.progressFill,
  height = 8,
  style,
  testID,
  accessibilityLabel,
}: ProgressBarProps) {
  const clamped = Math.min(
    1,
    Math.max(0, Number.isFinite(progress) ? progress : 0),
  );

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2 }, style]}
    >
      <View
        testID={testID === undefined ? undefined : `${testID}-fill`}
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.track,
    borderRadius: radius.small,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
