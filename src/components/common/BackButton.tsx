import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { colors, layout, spacing, typography } from '../../theme';

export interface BackButtonProps {
  /** Destination name, rendered after the arrow — e.g. "Home", "Exit quiz". */
  label: string;
  /**
   * Overrides the spoken label. Needed where `label` names an action rather
   * than a destination, so screen readers do not announce "Back to Exit quiz".
   */
  accessibilityLabel?: string;
  onPress: () => void;
  testID?: string;
}

export function BackButton({
  label,
  accessibilityLabel,
  onPress,
  testID,
}: BackButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Back to ${label}`}
      // The visual is only 17px tall; hitSlop brings the target to ~48px.
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* A drawn chevron rather than a "←" character. Plus Jakarta Sans has no
          arrow glyph, so Android silently substituted one from another family
          — a different weight and baseline from the label beside it. */}
      <View style={styles.row}>
        <ChevronLeft
          size={17}
          strokeWidth={2.25}
          color={colors.text.secondary}
          accessibilityElementsHidden
        />
        {/* Single line always: `alignSelf: flex-start` sizes the container to
            the text's shrink width, which on device wraps two-word
            destinations onto a second line ("← Interest / Rate"). */}
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget / 2,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 3,
  },
  label: {
    ...typography.label,
    color: colors.text.secondary,
  },
  pressed: {
    opacity: 0.6,
  },
});
