import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';
import { track } from '../../utils/analytics';
import { Button } from '../ui/Button';
import { SafeAreaWrapper } from './SafeAreaWrapper';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Called when the user asks to recover. Navigation state is not reset by the
   * boundary itself — the host decides where "home" is.
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors below it and offers a way back instead of a blank
 * screen. Hooks cannot do this, so this stays a class component.
 *
 * Errors are reported through the `track` facade rather than to a provider
 * directly, so whatever sink is installed — Sentry in production, nothing in
 * tests — receives them without this component knowing about it.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    track({
      name: 'app_error',
      error,
      componentStack: info.componentStack ?? null,
    });
  }

  private handleReset = () => {
    // Clearing the error remounts the children. The screen that threw is very
    // likely the one still selected, so the host resets navigation too.
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    const { error } = this.state;

    if (error === null) {
      return this.props.children;
    }

    return (
      <SafeAreaWrapper testID="error-boundary">
        <View style={styles.body}>
          <Text accessibilityRole="header" style={styles.title}>
            Something went wrong
          </Text>
          <Text style={styles.blurb}>
            The app hit an unexpected problem. Your progress is saved — going back
            to the home screen should put things right.
          </Text>
          <Button
            testID="error-reset"
            label="Back to home"
            onPress={this.handleReset}
            style={styles.button}
          />
        </View>
      </SafeAreaWrapper>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  blurb: {
    ...typography.label,
    fontFamily: typography.body1.fontFamily,
    lineHeight: 19.5,
    color: colors.text.blurb,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
