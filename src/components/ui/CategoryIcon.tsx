import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { getCategoryColors, typography } from '../../theme';

export interface CategoryIconProps {
  categoryId: string;
  /** Two-letter identifier, e.g. "IR". */
  label: string;
  /** 36 in the home grid, 44 in the category header. */
  size?: 36 | 44;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function CategoryIcon({
  categoryId,
  label,
  size = 36,
  style,
  testID,
}: CategoryIconProps) {
  const { accent, soft } = getCategoryColors(categoryId);
  const isLarge = size === 44;

  return (
    <View
      testID={testID}
      // Decorative: the category name is always rendered alongside it.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          borderRadius: isLarge ? 14 : 11,
          backgroundColor: soft,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: accent, fontSize: isLarge ? 16 : 14 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.h1.fontFamily,
  },
});
