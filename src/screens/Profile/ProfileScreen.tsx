import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Pencil, User } from 'lucide-react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { StatTile } from '../../components/ui/StatTile';
import { achievements } from '../../data/achievements';
import { TOTAL_QUESTIONS } from '../../data/products';
import {
  useAppDispatch,
  useAppSelector,
  useBookmarks,
  useLongestStreak,
  useSettings,
  useStreak,
  useUserName,
} from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import { useReview } from '../../hooks/useReview';
import { initialsFor } from '../../store/slices/settingsSlice';
import { resetEverything } from '../../store/thunks/bootstrapThunks';
import { updateName } from '../../store/thunks/settingsThunks';
import { colors, spacing, typography } from '../../theme';
import { track } from '../../utils/analytics';
import { SessionSizePicker } from './components/SessionSizePicker';
import { SettingsRows } from './components/SettingsRows';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const name = useUserName();
  const settings = useSettings();
  const streak = useStreak();
  const longest = useLongestStreak();
  const bookmarks = useBookmarks();
  const unlocked = useAppSelector((state) => state.progress.unlockedAchievementIds);
  const noteCount = useAppSelector(
    (state) => Object.keys(state.notes.byProduct).length,
  );
  const syncEmail = useAppSelector((state) => state.sync.email);
  const signedIn = useAppSelector((state) => state.sync.userId !== null);
  const {
    goToGlossary,
    goToAchievements,
    goToInsights,
    goToExam,
    goToNotes,
    goToAccount,
    goToTab,
  } = useNavigation();
  const { queuedCount } = useReview();
  const {
    overallPercent,
    masteredCount,
    totalCount,
    questionsAnswered,
    accuracyPercent,
  } = useProgress();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const commitName = useCallback(() => {
    // An empty field clears the name rather than storing a blank string, which
    // is what `setName` does with whitespace.
    void dispatch(updateName(draft));
    setEditing(false);
  }, [dispatch, draft]);

  const confirmReset = () => {
    Alert.alert(
      'Reset all progress?',
      'Mastery, streaks, saved products, the review queue and your name will be erased from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: () => {
            track({ name: 'progress_reset' });
            void dispatch(resetEverything());
            goToTab('home');
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaWrapper testID="profile-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text accessibilityRole="header" style={styles.title}>
          Profile
        </Text>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            {/* A drawn icon rather than the "·" initialsFor(null) falls back
                to — at 17px inside a 54px solid circle that dot was nearly
                invisible, reading as a rendering glitch rather than a
                placeholder. */}
            {name === null ? (
              <User size={24} strokeWidth={2} color={colors.text.onDark} />
            ) : (
              <Text style={styles.initials}>{initialsFor(name)}</Text>
            )}
          </View>
          <View style={styles.identityText}>
            {editing ? (
              <TextInput
                testID="profile-name-input"
                value={draft}
                onChangeText={setDraft}
                onBlur={commitName}
                onSubmitEditing={commitName}
                autoFocus
                selectTextOnFocus
                maxLength={40}
                returnKeyType="done"
                placeholder="Your name"
                placeholderTextColor={colors.text.tertiary}
                accessibilityLabel="Your name"
                style={styles.nameInput}
              />
            ) : (
              <Pressable
                testID="profile-name"
                onPress={() => {
                  setDraft(name ?? '');
                  setEditing(true);
                }}
                accessibilityRole="button"
                accessibilityLabel={
                  name === null
                    ? 'Add your name'
                    : `Your name is ${name}. Tap to edit.`
                }
                hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                style={styles.nameRow}
              >
                <Text
                  style={[styles.name, name === null && styles.namePlaceholder]}
                >
                  {name ?? 'Add your name'}
                </Text>
                {/* The only visual cue elsewhere on this control that it's
                    tappable — nothing about plain text otherwise says so. */}
                <Pencil size={15} strokeWidth={2} color={colors.text.tertiary} />
              </Pressable>
            )}
            <Text style={styles.identityMeta}>
              {masteredCount} of {totalCount} products mastered · {overallPercent}%
            </Text>
          </View>
        </View>

        <View style={styles.tiles}>
          <StatTile
            testID="profile-streak"
            value={String(streak)}
            label="Day streak"
            tint={colors.progressFillText}
          />
          <StatTile
            testID="profile-answered"
            value={String(questionsAnswered)}
            label="Answered"
          />
          <StatTile
            testID="profile-accuracy"
            value={`${accuracyPercent}%`}
            label="Accuracy"
          />
        </View>
        <Text style={styles.tilesNote}>
          {questionsAnswered === 0
            ? `${TOTAL_QUESTIONS} questions in the bank, none answered yet.`
            : `Best streak ${longest} ${longest === 1 ? 'day' : 'days'} · ${questionsAnswered} of ${TOTAL_QUESTIONS} questions seen`}
        </Text>

        <Text style={styles.sectionTitle}>STUDY</Text>
        <SettingsRows />
        <SessionSizePicker />

        <Text style={styles.sectionTitle}>LIBRARY</Text>
        <View style={styles.rows}>
          <DisclosureRow
            testID="profile-exam"
            label="Practice exam"
            value="Timed, evenly drawn"
            onPress={goToExam}
          />
          <DisclosureRow
            testID="profile-insights"
            label="Insights"
            value="Where the gaps are"
            onPress={goToInsights}
          />
          <DisclosureRow
            testID="profile-achievements"
            label="Achievements"
            value={`${unlocked.length} of ${achievements.length}`}
            onPress={goToAchievements}
          />
          <DisclosureRow
            testID="profile-glossary"
            label="Glossary"
            value="All key terms"
            onPress={goToGlossary}
          />
          <DisclosureRow
            testID="profile-notes"
            label="Notes"
            value={String(noteCount)}
            onPress={goToNotes}
          />
          <DisclosureRow
            testID="profile-saved"
            label="Saved products"
            value={String(bookmarks.length)}
            onPress={() => goToTab('products')}
          />
          <DisclosureRow label="In the review queue" value={String(queuedCount)} />
        </View>

        <Text style={styles.sectionTitle}>DATA</Text>
        <View style={styles.rows}>
          <DisclosureRow
            testID="profile-account"
            label="Account"
            value={signedIn ? (syncEmail ?? 'Signed in') : 'Off'}
            onPress={goToAccount}
          />
          <Text style={styles.dataNote}>
            {signedIn
              ? 'Your progress is backed up to your account. Nothing else leaves this device.'
              : 'Everything is stored on this device only. Sign in if you want your progress to survive a reinstall.'}
            {settings.dailyReminder
              ? ' The daily reminder is scheduled locally.'
              : ''}
          </Text>
          <Pressable
            testID="profile-reset"
            onPress={confirmReset}
            accessibilityRole="button"
            accessibilityLabel="Reset all progress"
            style={({ pressed }) => [styles.reset, pressed && styles.pressed]}
          >
            <Text style={styles.resetText}>Reset all progress</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          Educational content only. Nothing here is financial advice or an offer to
          trade.
        </Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function DisclosureRow({
  label,
  value,
  onPress,
  testID,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? 'text' : 'button'}
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>
        {value}
        {onPress === undefined ? '' : '  ›'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.h3,
    fontSize: 17,
    color: colors.text.onDark,
  },
  identityText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: 6,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
  },
  namePlaceholder: {
    color: colors.text.tertiary,
  },
  nameInput: {
    ...typography.h2,
    color: colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.progressFill,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  identityMeta: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 4,
  },
  tiles: {
    flexDirection: 'row',
    columnGap: spacing.sm,
    marginTop: spacing.lg,
  },
  tilesNote: {
    ...typography.labelSmall,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  rows: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  rowLabel: {
    ...typography.body2,
    color: colors.text.primary,
  },
  rowValue: {
    ...typography.body2,
    color: colors.text.muted,
  },
  dataNote: {
    ...typography.labelSmall,
    color: colors.text.muted,
    paddingVertical: spacing.md,
  },
  reset: {
    paddingVertical: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  resetText: {
    ...typography.label,
    fontSize: 13.5,
    color: colors.error.text,
  },
  disclaimer: {
    ...typography.micro,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
