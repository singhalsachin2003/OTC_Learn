import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useSettings } from '../../../hooks/useAppState';
import { useThemedStyles } from '../../../hooks/useTheme';
import { updateTheme } from '../../../store/thunks/settingsThunks';
import { radius, spacing, typography } from '../../../theme';
import type { Palette } from '../../../theme/colors';
import { THEME_PREFERENCES, type ThemePreference } from '../../../utils/storage';

const LABELS: Record<ThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

/**
 * Light, dark, or whatever the phone is set to.
 *
 * System is the default and is listed first, because it is the answer for
 * almost everyone: a phone that dims itself in the evening should dim this too
 * without anybody having to come here. The other two exist for the people whose
 * phone is wrong for the room they are in.
 */
export function ThemePicker() {
  const styles = useThemedStyles(makeStyles);
  const dispatch = useAppDispatch();
  const { theme } = useSettings();

  return (
    <View testID="theme-picker" style={styles.container}>
      <View style={styles.text}>
        <Text style={styles.name}>Theme</Text>
        <Text style={styles.note}>
          System follows your phone&rsquo;s light or dark setting
        </Text>
      </View>
      <View style={styles.options}>
        {THEME_PREFERENCES.map((preference) => {
          const active = preference === theme;
          return (
            <Pressable
              key={preference}
              testID={`theme-${preference}`}
              onPress={() => void dispatch(updateTheme(preference))}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${LABELS[preference]} appearance`}
              style={({ pressed }) => [
                styles.option,
                active && styles.optionActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {LABELS[preference]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = ({ colors }: Palette) =>
  StyleSheet.create({
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
      // The same 16 + 16 + 17 that clears the 48dp target in SessionSizePicker.
      paddingVertical: 16,
      borderRadius: radius.large,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      alignItems: 'center',
    },
    optionActive: {
      backgroundColor: colors.primaryFill,
      borderColor: colors.primaryFill,
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
      color: colors.text.onPrimary,
    },
  });
