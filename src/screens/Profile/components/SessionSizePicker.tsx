import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useSettings } from '../../../hooks/useAppState';
import { updateSessionSize } from '../../../store/thunks/settingsThunks';
import { colors, radius, spacing, typography } from '../../../theme';

/** Offered sizes. Every product's bank holds 12, so 12 means "the lot". */
const SIZES = [4, 6, 8, 12] as const;

/**
 * How many questions a sitting draws.
 *
 * Worth exposing rather than fixing at six: the whole point of a bank larger
 * than a sitting is that different people want different amounts of it, and
 * someone revising before an interview wants all twelve.
 */
export function SessionSizePicker() {
  const dispatch = useAppDispatch();
  const { sessionSize } = useSettings();

  return (
    <View testID="session-size" style={styles.container}>
      <View style={styles.text}>
        <Text style={styles.name}>Questions per quiz</Text>
        <Text style={styles.note}>
          Drawn from a bank of 12, weighted toward what you have missed
        </Text>
      </View>
      <View style={styles.options}>
        {SIZES.map((size) => {
          const active = size === sessionSize;
          return (
            <Pressable
              key={size}
              testID={`session-size-${size}`}
              onPress={() => void dispatch(updateSessionSize(size))}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${size} questions per quiz`}
              style={({ pressed }) => [
                styles.option,
                active && styles.optionActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {size}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  text: {
    marginBottom: spacing.md,
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
  options: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  pressed: {
    opacity: 0.7,
  },
  optionText: {
    ...typography.label,
    fontSize: 13,
    color: colors.text.primary,
  },
  optionTextActive: {
    color: colors.text.onDark,
  },
});
