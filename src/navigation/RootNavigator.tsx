import { StyleSheet, View } from 'react-native';

import { TabBar } from '../components/common/TabBar';
import { useCurrentScreen, useCurrentTab } from '../hooks/useAppState';
import { useDeepLinks } from '../hooks/useDeepLinks';
import { useHardwareBack } from '../hooks/useHardwareBack';
import { useNavigation } from '../hooks/useNavigation';
import { useReview } from '../hooks/useReview';
import { AccountScreen } from '../screens/Account/AccountScreen';
import { AchievementsScreen } from '../screens/Achievements/AchievementsScreen';
import { CategoryScreen } from '../screens/Category/CategoryScreen';
import { ExamScreen } from '../screens/Exam/ExamScreen';
import { GlossaryScreen } from '../screens/Glossary/GlossaryScreen';
import { InsightsScreen } from '../screens/Insights/InsightsScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { LessonScreen } from '../screens/Lesson/LessonScreen';
import { NotesScreen } from '../screens/Notes/NotesScreen';
import { ProductScreen } from '../screens/Product/ProductScreen';
import { ProductsScreen } from '../screens/Products/ProductsScreen';
import { PaywallScreen } from '../screens/Paywall/PaywallScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { QuizResults } from '../screens/Quiz/QuizResults';
import { QuizScreen } from '../screens/Quiz/QuizScreen';
import { ReviewScreen } from '../screens/Review/ReviewScreen';
import { showsTabBar } from '../store/slices/appSlice';
import { colors } from '../theme';

/**
 * Renders the screen named by `app.currentScreen`, with the tab bar beneath it.
 *
 * The spec makes Redux the single source of truth for navigation (every screen
 * reads `app.currentScreen`, `selectedCategoryId` and `selectedProductId`), so
 * a switch here avoids duplicating that state inside a stack navigator. Adding
 * tabs did not change that: `currentTab` records which tab a detail screen was
 * reached from, and the bar is a control over the same state rather than a
 * second navigator with its own history.
 *
 * The three things a navigator would have given us for free — the Android
 * hardware back button, deep links, and the tab bar itself — are registered
 * here instead.
 */
export function RootNavigator() {
  const screen = useCurrentScreen();
  const tab = useCurrentTab();
  const { goToTab } = useNavigation();
  const { dueCount } = useReview();

  useHardwareBack();
  useDeepLinks();

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Screen />
      </View>
      {showsTabBar(screen) && (
        <TabBar
          testID="tab-bar"
          current={tab}
          onSelect={goToTab}
          reviewBadge={dueCount}
        />
      )}
    </View>
  );
}

function Screen() {
  const screen = useCurrentScreen();

  switch (screen) {
    case 'products':
      return <ProductsScreen />;
    case 'review':
      return <ReviewScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'category':
      return <CategoryScreen />;
    case 'product':
      return <ProductScreen />;
    case 'lesson':
      return <LessonScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <QuizResults />;
    case 'glossary':
      return <GlossaryScreen />;
    case 'achievements':
      return <AchievementsScreen />;
    case 'insights':
      return <InsightsScreen />;
    case 'exam':
      return <ExamScreen />;
    case 'notes':
      return <NotesScreen />;
    case 'account':
      return <AccountScreen />;
    case 'paywall':
      return <PaywallScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
