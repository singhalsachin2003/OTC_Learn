import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../theme';

export interface SegmentedBarProps {
  /** How many segments to draw — one per question in the sitting. */
  segments: number;
  /** Colour for segment `i`. Called once per segment on every render. */
  colorAt: (index: number) => string;
  height?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * One bar per question rather than a single filling track.
 *
 * A continuous bar says how far through you are; this says how far through you
 * are *and* how it has gone, because each answered segment carries its own
 * result colour. During a quiz that is the more useful of the two.
 */
export function SegmentedBar({
  segments,
  colorAt,
  height = 4,
  gap = 4,
  style,
  testID,
  accessibilityLabel,
}: SegmentedBarProps) {
  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, { columnGap: gap }, style]}
    >
      {Array.from({ length: Math.max(0, segments) }, (_, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            height,
            borderRadius: height / 2,
            backgroundColor: colorAt(index),
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'transparent',
  },
});

/** Shared segment palette, so the quiz bar and the results bar agree. */
export const segmentColors = {
  correct: colors.success.strong,
  incorrect: colors.error.strong,
  current: colors.text.tertiary,
  pending: colors.trackDot,
} as const;
