import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  layout,
  radius,
  spacing,
  tabColors,
  typography,
} from '../../theme';
import type { TabName } from '../../store/slices/appSlice';

interface TabDefinition {
  key: TabName;
  label: string;
  /** Drawn from primitives rather than an icon font — see the note below. */
  shape: 'square' | 'circle' | 'ring' | 'bars';
}

const TABS: TabDefinition[] = [
  { key: 'home', label: 'Home', shape: 'square' },
  { key: 'products', label: 'Products', shape: 'bars' },
  { key: 'review', label: 'Review', shape: 'ring' },
  { key: 'profile', label: 'Profile', shape: 'circle' },
];

export interface TabBarProps {
  current: TabName;
  onSelect: (tab: TabName) => void;
  /** Count shown on the review tab; hidden when zero. */
  reviewBadge?: number;
  testID?: string;
}

/**
 * The bottom tab bar.
 *
 * Glyphs are drawn from views rather than an icon set: the app has no icon
 * dependency, and adding one for four shapes would pull a font or an SVG
 * library's worth of paths into the bundle for very little. Swapping in a real
 * set later means changing `Glyph` and nothing else.
 */
export function TabBar({
  current,
  onSelect,
  reviewBadge = 0,
  testID,
}: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}
    >
      {TABS.map((tab) => {
        const focused = tab.key === current;
        const badge = tab.key === 'review' ? reviewBadge : 0;

        return (
          <Pressable
            key={tab.key}
            testID={`tab-${tab.key}`}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={
              badge > 0 ? `${tab.label}, ${badge} due` : tab.label
            }
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <View>
              <Glyph shape={tab.shape} focused={focused} />
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, focused && styles.labelFocused]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Glyph({
  shape,
  focused,
}: {
  shape: TabDefinition['shape'];
  focused: boolean;
}) {
  const tint = focused ? tabColors.active : tabColors.inactive;

  if (shape === 'bars') {
    return (
      <View style={styles.glyph}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={[styles.glyphBar, { backgroundColor: tint }]} />
        ))}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.glyph,
        {
          borderColor: tint,
          borderWidth: 1.75,
          borderRadius: shape === 'square' ? 4 : 9,
          backgroundColor: focused && shape !== 'ring' ? tint : 'transparent',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: tabColors.background,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: tabColors.border,
    paddingTop: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    rowGap: 5,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  glyph: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  glyphBar: {
    height: 2,
    width: 16,
    borderRadius: 1,
  },
  label: {
    ...typography.micro,
    fontSize: 10,
    color: tabColors.inactive,
  },
  labelFocused: {
    color: tabColors.active,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.error.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.micro,
    fontSize: 9,
    color: colors.text.onDark,
  },
});
