import { useCurrentScreen } from '../hooks/useAppState';
import { useHardwareBack } from '../hooks/useHardwareBack';
import { CategoryScreen } from '../screens/Category/CategoryScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { LessonScreen } from '../screens/Lesson/LessonScreen';
import { QuizResults } from '../screens/Quiz/QuizResults';
import { QuizScreen } from '../screens/Quiz/QuizScreen';

/**
 * Renders the screen named by `app.currentScreen`.
 *
 * The spec makes Redux the single source of truth for navigation (every screen
 * reads `app.currentScreen`, `selectedCategoryId` and `selectedProductId`), so
 * a switch here avoids duplicating that state inside a stack navigator. The
 * flat five-screen flow has no nested stacks or gestures that would need one.
 * The one thing a navigator would have given us for free is the Android
 * hardware back button, so `useHardwareBack` registers it here.
 */
export function RootNavigator() {
  const screen = useCurrentScreen();

  useHardwareBack();

  switch (screen) {
    case 'category':
      return <CategoryScreen />;
    case 'lesson':
      return <LessonScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <QuizResults />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}
