import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { signIn, signOutAccount, syncNow } from '../../store/thunks/syncThunks';
import { colors, radius, spacing, typography } from '../../theme';
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
  const dispatch = useAppDispatch();
  const { goToTab } = useNavigation();
  const sync = useAppSelector((state) => state.sync);
  const configured = isSyncConfigured();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const busy = sync.status === 'busy';
  const signedIn = sync.userId !== null;
  const canSubmit = email.trim() !== '' && password !== '' && !busy;

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

const styles = StyleSheet.create({
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
});
