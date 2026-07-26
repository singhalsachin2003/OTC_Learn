import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Rendered to the right of the title — e.g. the streak pill on Home. */
  trailing?: ReactNode;
  testID?: string;
}

export function Header({ title, subtitle, trailing, testID }: HeaderProps) {
  return (
    <View testID={testID} style={styles.container}>
      <View style={styles.titleGroup}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  titleGroup: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.label,
    fontFamily: typography.body1.fontFamily,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
