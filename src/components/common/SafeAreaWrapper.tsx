import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '../../theme';
import { useThemedStyles } from '../../hooks/useTheme';
import type { Palette } from '../../theme/colors';

export interface SafeAreaWrapperProps {
  children: ReactNode;
  /** Applies the standard 20px horizontal screen padding. Default: true. */
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Fills the screen, honours the device safe-area insets, paints the background. */
export function SafeAreaWrapper({
  children,
  padded = true,
  style,
  testID,
}: SafeAreaWrapperProps) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + (padded ? layout.screenPadding : 0),
          paddingRight: insets.right + (padded ? layout.screenPadding : 0),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const makeStyles = ({ colors }: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
