import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { WeekStrip } from '../../components/ui/WeekStrip';
import { useStudyDays } from '../../hooks/useAppState';
import { colors, spacing, typography } from '../../theme';
import { CategoryGrid } from './components/CategoryGrid';
import { DashboardCard } from './components/DashboardCard';
import { QuickActions } from './components/QuickActions';
import { ResumeCard } from './components/ResumeCard';

export function HomeScreen() {
  const studyDays = useStudyDays();

  return (
    <SafeAreaWrapper testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* A masthead rather than a greeting. "Good evening, Sachin" is the
            voice of a consumer app checking in on you; this is a reference tool
            someone opens between meetings, and it should say what it is. */}
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            OTC Learn
          </Text>
          <Text style={styles.standfirst}>
            Over-the-counter derivatives, one product at a time
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
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  standfirst: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: 3,
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
