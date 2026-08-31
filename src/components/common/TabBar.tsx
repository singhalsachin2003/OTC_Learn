import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  House,
  LayoutGrid,
  RotateCcw,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';

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
  Icon: LucideIcon;
}

const TABS: TabDefinition[] = [
  { key: 'home', label: 'Home', Icon: House },
  { key: 'products', label: 'Products', Icon: LayoutGrid },
  { key: 'review', label: 'Review', Icon: RotateCcw },
  { key: 'profile', label: 'Profile', Icon: UserRound },
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
 * Icons come from lucide, drawn as SVG through react-native-svg. They replaced
 * bordered squares and circles built from Views — which were legible enough,
 * but two of the four were indistinguishable circles, and a bar of hand-drawn
 * primitives is the clearest signal a product has not been finished.
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
              <tab.Icon
                size={21}
                strokeWidth={focused ? 2.4 : 1.8}
                color={focused ? tabColors.active : tabColors.inactive}
                accessibilityElementsHidden
              />
              {badge > 0 && (
                <View style={styles.badge}>
                  {/* Capped harder than the label: the badge is a fixed circle
                      drawn over the icon, so a scaling number escapes it. The
                      count is also in the tab's accessibility label. */}
                  <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.1}
                    style={styles.badgeText}
                  >
                    {badge > 99 ? '99+' : badge}
                  </Text>
                </View>
              )}
            </View>
            {/* Navigation furniture caps its scaling where the content it
                leads to does not. At the largest accessibility sizes "Products"
                wrapped onto a second line and overflowed the bar on every
                screen; a tab label that is unreadable *because* it is enormous
                helps nobody. The screens themselves still scale in full. */}
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[styles.label, focused && styles.labelFocused]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
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
