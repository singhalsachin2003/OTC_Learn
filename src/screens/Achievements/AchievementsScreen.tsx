import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { achievements } from '../../data/achievements';
import { useAppSelector } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Badges, earned and unearned.
 *
 * Locked badges show their criteria rather than being hidden, because a badge
 * you cannot see is not a goal — it is a surprise, and surprises do not change
 * what anyone does today.
 */
export function AchievementsScreen() {
  const { goToTab } = useNavigation();
  const unlocked = useAppSelector((state) => state.progress.unlockedAchievementIds);

  return (
    <SafeAreaWrapper testID="achievements-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="achievements-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Achievements
        </Text>
        <Text style={styles.subtitle}>
          {unlocked.length} of {achievements.length} earned
        </Text>

        <View style={styles.list}>
          {achievements.map((achievement) => {
            const earned = unlocked.includes(achievement.id);
            return (
              <View
                key={achievement.id}
                testID={`achievement-${achievement.id}`}
                accessibilityRole="text"
                accessibilityLabel={`${achievement.name}. ${achievement.description} ${
                  earned ? 'Earned.' : 'Not yet earned.'
                }`}
                style={[styles.row, !earned && styles.rowLocked]}
              >
                <View style={[styles.glyphBox, earned && styles.glyphBoxEarned]}>
                  <Text style={[styles.glyph, earned && styles.glyphEarned]}>
                    {achievement.glyph}
                  </Text>
                </View>
                <View style={styles.text}>
                  <Text style={[styles.name, !earned && styles.nameLocked]}>
                    {achievement.name}
                  </Text>
                  <Text style={styles.description}>{achievement.description}</Text>
                </View>
                {earned && (
                  <Text style={styles.tick} accessibilityElementsHidden>
                    ✓
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 3,
  },
  list: {
    marginTop: spacing.lg,
    rowGap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowLocked: {
    backgroundColor: 'transparent',
  },
  glyphBox: {
    width: 42,
    height: 42,
    borderRadius: radius.medium,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphBoxEarned: {
    backgroundColor: colors.dark,
  },
  glyph: {
    ...typography.label,
    fontSize: 13,
    color: colors.text.tertiary,
  },
  glyphEarned: {
    color: colors.text.onDark,
  },
  text: {
    flex: 1,
  },
  name: {
    ...typography.label,
    fontSize: 13.5,
    color: colors.text.primary,
  },
  nameLocked: {
    color: colors.text.secondary,
  },
  description: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 3,
  },
  tick: {
    ...typography.label,
    fontSize: 15,
    color: colors.success.base,
  },
});
