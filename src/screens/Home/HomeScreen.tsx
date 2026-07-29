import { ScrollView, StyleSheet, Text } from 'react-native';

import { Header } from '../../components/common/Header';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { colors, spacing, typography } from '../../theme';
import { CategoryGrid } from './components/CategoryGrid';
import { ProgressCard } from './components/ProgressCard';
import { StreakBadge } from './components/StreakBadge';

export function HomeScreen() {
  return (
    <SafeAreaWrapper testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="OTC Learn"
          subtitle="Master derivatives, one product at a time"
          trailing={<StreakBadge />}
        />
        <ProgressCard />
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Asset classes
        </Text>
        <CategoryGrid />
        <Text testID="home-disclaimer" style={styles.disclaimer}>
          Educational content only. Nothing here is financial advice or an offer to
          trade.
        </Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  disclaimer: {
    ...typography.micro,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
