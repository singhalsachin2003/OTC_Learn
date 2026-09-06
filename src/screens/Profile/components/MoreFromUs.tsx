import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ExternalLink, GraduationCap } from 'lucide-react-native';

import { CORNERSTONE_PLAY_URL } from '../../../data/links';
import { colors, radius, spacing, typography } from '../../../theme';
import { openExternal } from '../../../utils/openExternal';

/**
 * The other app on the same developer account.
 *
 * The most qualified traffic either app can send the other: someone reading a
 * derivatives lesson here is, more often than not, sitting a CFA or FRM paper
 * that covers the same instruments. It sits at the bottom of Profile rather
 * than anywhere on the study path, because an advertisement in the middle of a
 * lesson is a worse trade than the install it might win.
 *
 * The marks are used descriptively and nowhere near a claim of endorsement —
 * that restraint is deliberate, and it is the same rule Cornerstone's own
 * listing follows.
 */
export function MoreFromUs() {
  return (
    <Pressable
      testID="profile-cornerstone"
      onPress={() => void openExternal(CORNERSTONE_PLAY_URL)}
      accessibilityRole="link"
      accessibilityLabel="Cornerstone: Exam Study on Google Play"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.glyph}>
        <GraduationCap size={20} strokeWidth={2} color={colors.text.primary} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Cornerstone: Exam Study</Text>
        <Text style={styles.body}>
          Our study app for CFA and FRM candidates — topic snapshots, quizzes and a
          review queue, over the whole syllabus.
        </Text>
      </View>
      <ExternalLink size={16} strokeWidth={2} color={colors.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md + 2,
  },
  pressed: {
    opacity: 0.6,
  },
  glyph: {
    width: 40,
    height: 40,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  text: {
    flex: 1,
  },
  title: {
    ...typography.label,
    fontSize: 13.5,
    color: colors.text.primary,
    marginBottom: 3,
  },
  body: {
    ...typography.labelSmall,
    color: colors.text.muted,
  },
});
