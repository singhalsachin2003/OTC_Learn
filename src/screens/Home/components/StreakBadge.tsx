import { StreakBadge as StreakPill } from '../../../components/ui/StreakBadge';
import { useStreak } from '../../../hooks/useAppState';

/** Store-connected wrapper around the presentational streak pill. */
export function StreakBadge() {
  const streak = useStreak();
  return <StreakPill streak={streak} testID="home-streak" />;
}
