import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import {
  deleteAccount,
  signIn,
  signOutAccount,
  syncNow,
} from '../../store/thunks/syncThunks';
import { radius, spacing, typography } from '../../theme';
import { useTheme, useThemedStyles } from '../../hooks/useTheme';
import type { Palette } from '../../theme/colors';
import { isSyncConfigured } from '../../utils/supabase';

/**
 * Sign in, and what sync last did.
 *
 * An account buys exactly one thing — progress that survives the device — and
 * the screen says so rather than implying the app needs one. Everything here is
 * optional: the app worked without an account before this existed, and a build
 * with no credentials configured does not show the sign-in form at all.
 */
export function AccountScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const dispatch = useAppDispatch();
  const { goToTab } = useNavigation();
  const sync = useAppSelector((state) => state.sync);
  const configured = isSyncConfigured();
  const signedIn = sync.userId !== null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  // Emptied once a session exists, which is the only moment they are certainly
  // no longer needed. The screen never unmounts — signing out just flips a
  // branch — so without this the form comes back carrying the last email *and
  // the last password*, and typing into it appends rather than replaces.
  useEffect(() => {
    if (signedIn) {
      setEmail('');
      setPassword('');
    }
  }, [signedIn]);

  const busy = sync.status === 'busy';
  const canSubmit = email.trim() !== '' && password !== '' && !busy;

  /**
   * Two taps, and the second one names what it does rather than saying "OK".
   *
   * The body is explicit that the device keeps its own copy, because the
   * alternative reading — that deleting the account wipes the studying too —
   * is the one a cautious person assumes, and it would stop them using a
   * control Play requires to be usable.
   */
  const confirmDelete = () => {
    Alert.alert(
      'Delete your account?',
      'Your account and everything backed up to it — progress, review queue, notes, bookmarks — are permanently deleted from the server. This cannot be undone.\n\nStudy progress already on this phone is kept, and the app keeps working without an account. Use Reset all progress in Profile if you want that gone too.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            void dispatch(deleteAccount())
              .unwrap()
              .then((deleted) => {
                if (deleted) {
                  goToTab('profile');
                }
              })
              .catch(() => {
                // The thunk reports failure through sync.error, which this
                // screen already renders. Nothing to add here.
              });
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaWrapper testID="account-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="account-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Account
        </Text>

        {!configured ? (
          <Text testID="account-unavailable" style={styles.body}>
            This build has no sync configured, so there is nothing to sign in to.
            Everything you do is stored on this device, exactly as before.
          </Text>
        ) : signedIn ? (
          <View>
            <Text style={styles.body}>
              Signed in as{' '}
              <Text style={styles.email} testID="account-email">
                {sync.email ?? 'your account'}
              </Text>
              . Your progress is backed up, and will come back if you reinstall or
              change phone.
            </Text>

            <Text testID="account-last-sync" style={styles.meta}>
              {sync.lastSyncedAt === null
                ? 'Not synced yet'
                : `Last synced ${new Date(sync.lastSyncedAt).toLocaleString()}`}
            </Text>

            {/* Signed in, a failure used to be invisible: the screen said
                "Not synced yet" and gave no reason, because the error was only
                rendered on the signed-out branch. Found by driving the app —
                a second sign-in in one session leaves sync failing, and
                nothing on screen said so. */}
            {sync.error !== null && (
              <Text testID="account-sync-error" style={styles.error}>
                {sync.error}
              </Text>
            )}

            <Button
              testID="account-sync-now"
              label={busy ? 'Syncing…' : 'Sync now'}
              disabled={busy}
              onPress={() => {
                void dispatch(syncNow());
              }}
              style={styles.action}
            />
            <Button
              testID="account-sign-out"
              label="Sign out"
              variant="outline"
              disabled={busy}
              onPress={() => {
                void dispatch(signOutAccount());
              }}
              style={styles.action}
            />
            {/* Signing out is not a reset, and a screen that did not say so
                would make signing in feel like a risk. */}
            <Text style={styles.meta}>
              Signing out leaves everything on this device untouched.
            </Text>

            {/* Separated by a rule rather than sitting in the row above,
                because a destructive action next to "Sign out" is a mis-tap
                waiting to happen and the two are not peers. */}
            <View style={styles.danger}>
              <Text accessibilityRole="header" style={styles.dangerTitle}>
                Delete account
              </Text>
              <Text style={styles.body}>
                Permanently deletes your account and everything backed up to it.
                Progress already on this phone is kept.
              </Text>
              <Button
                testID="account-delete"
                label={busy ? 'Working…' : 'Delete account'}
                variant="outline"
                disabled={busy}
                accessibilityHint="Permanently deletes your account and its backed-up data"
                onPress={confirmDelete}
                textStyle={styles.dangerLabel}
                style={styles.dangerButton}
              />
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.body}>
              An account does one thing: it keeps your mastery, review queue and
              notes if you reinstall or change phone. The app works exactly the same
              without one.
            </Text>

            <TextInput
              testID="account-email-input"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.text.tertiary}
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.input}
            />
            <TextInput
              testID="account-password-input"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.text.tertiary}
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              textContentType="password"
              style={styles.input}
            />

            {sync.error !== null && (
              <Text testID="account-error" style={styles.error}>
                {sync.error}
              </Text>
            )}

            <Button
              testID="account-submit"
              label={busy ? 'Working…' : creating ? 'Create account' : 'Sign in'}
              disabled={!canSubmit}
              onPress={() => {
                void dispatch(signIn({ email, password, signingUp: creating }));
              }}
              style={styles.action}
            />
            <Button
              testID="account-toggle-mode"
              label={
                creating ? 'I already have an account' : 'Create an account instead'
              }
              variant="outline"
              disabled={busy}
              onPress={() => setCreating((was) => !was)}
              style={styles.action}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const makeStyles = ({ colors }: Palette) =>
  StyleSheet.create({
    content: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    body: {
      ...typography.body2,
      color: colors.text.body,
      marginBottom: spacing.lg,
    },
    email: {
      ...typography.body2,
      color: colors.text.primary,
    },
    meta: {
      ...typography.labelSmall,
      color: colors.text.muted,
      marginTop: spacing.sm,
    },
    input: {
      ...typography.body2,
      color: colors.text.primary,
      backgroundColor: colors.card,
      borderRadius: radius.large,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
    },
    error: {
      ...typography.labelSmall,
      color: colors.error.text,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    action: {
      marginTop: spacing.md,
    },
    danger: {
      marginTop: spacing.xl,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.line.base,
    },
    dangerTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    dangerButton: {
      borderColor: colors.error.strong,
    },
    dangerLabel: {
      color: colors.error.text,
    },
  });
