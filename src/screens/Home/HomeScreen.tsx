import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { WeekStrip } from '../../components/ui/WeekStrip';
import { useStudyDays, useUserName } from '../../hooks/useAppState';
import { colors, spacing, typography } from '../../theme';
import { CategoryGrid } from './components/CategoryGrid';
import { DashboardCard } from './components/DashboardCard';
import { QuickActions } from './components/QuickActions';
import { ResumeCard } from './components/ResumeCard';

/** Greeting keyed to the hour — the only time-of-day copy in the app. */
function greeting(hour: number): string {
  if (hour < 12) {
    return 'Good morning';
  }
  return hour < 17 ? 'Good afternoon' : 'Good evening';
}

export function HomeScreen() {
  const name = useUserName();
  const studyDays = useStudyDays();
  const hello = greeting(new Date().getHours());
  const firstName = name?.split(/\s+/)[0];

  return (
    <SafeAreaWrapper testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {firstName === undefined ? hello : `${hello}, ${firstName}`}
          </Text>
          <Text accessibilityRole="header" style={styles.title}>
            OTC Learn
          </Text>
        </View>

        <DashboardCard />
        <WeekStrip testID="home-week" studyDays={studyDays} style={styles.week} />
        <ResumeCard />
        <QuickActions />

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
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.body2,
    color: colors.text.muted,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: 2,
  },
  week: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 15,
    color: colors.text.primary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  disclaimer: {
    ...typography.micro,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
