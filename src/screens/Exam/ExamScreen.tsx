import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { examScopes, examScopeName } from '../../data/examScopes';
import { useAppSelector } from '../../hooks/useAppState';
import { useAccess } from '../../hooks/useAccess';
import { useNavigation } from '../../hooks/useNavigation';
import { useQuiz } from '../../hooks/useQuiz';
import {
  bestResultFor,
  DEFAULT_EXAM_LENGTH,
  EXAM_LENGTHS,
  EXAM_PASS_MARK,
  SECONDS_PER_QUESTION,
  sortResults,
} from '../../utils/exam';
import { colors, radius, spacing, tabularNumbers, typography } from '../../theme';

/**
 * Sitting a practice exam.
 *
 * The setup is deliberately explicit about what an exam is and is not: it is
 * timed, it is drawn evenly rather than weighted toward your weak spots, and
 * it does not move mastery. A student revising for something real needs to
 * know which of the app's numbers this will and will not change — otherwise a
 * hard exam reads as losing progress.
 */
export function ExamScreen() {
  const { goToTab, goToExamQuiz, goToPaywall } = useNavigation();
  const { startExam } = useQuiz();
  const results = useAppSelector((state) => state.progress.examResults);

  const { productLocked } = useAccess();

  // Scoped to what the reader can open, so the question counts on screen are
  // the ones a paper would actually be drawn from.
  const scopes = examScopes((productId) => !productLocked(productId));
  const [scopeId, setScopeId] = useState(scopes[0]?.id ?? '');
  const [length, setLength] = useState<number>(DEFAULT_EXAM_LENGTH);

  const scope = scopes.find((entry) => entry.id === scopeId);
  // A scope cannot yield more questions than it has, so the paper — and the
  // time allowed with it — is the smaller of the two.
  const actualLength = Math.min(length, scope?.questionCount ?? 0);
  const minutes = Math.round((actualLength * SECONDS_PER_QUESTION) / 60);
  const best = bestResultFor(results, scopeId);
  const recent = sortResults(results).slice(0, 3);

  const begin = () => {
    startExam(scopeId, length);
    goToExamQuiz();
  };

  return (
    <SafeAreaWrapper testID="exam-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="exam-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Practice exam
        </Text>
        <Text style={styles.subtitle}>
          A timed, evenly drawn paper. Unlike a quiz, it does not favour the
          questions you have missed — so the score is a measurement. It leaves your
          mastery untouched.
        </Text>

        <Text accessibilityRole="header" style={styles.sectionTitle}>
          SCOPE
        </Text>
        <View style={styles.chips}>
          {scopes.map((entry) => (
            <Chip
              key={entry.id}
              testID={`exam-scope-${entry.id}`}
              label={entry.locked ? `${entry.name} · locked` : entry.name}
              selected={entry.id === scopeId}
              // A locked scope explains itself rather than selecting: choosing
              // it would leave the paper at zero questions with nothing on
              // screen saying why.
              onPress={
                entry.locked
                  ? () => goToPaywall('profile')
                  : () => setScopeId(entry.id)
              }
            />
          ))}
        </View>

        <Text accessibilityRole="header" style={styles.sectionTitle}>
          LENGTH
        </Text>
        <View style={styles.chips}>
          {EXAM_LENGTHS.map((count) => (
            <Chip
              key={count}
              testID={`exam-length-${count}`}
              label={`${count} questions`}
              selected={count === length}
              onPress={() => setLength(count)}
            />
          ))}
        </View>

        <View style={styles.summary} testID="exam-summary">
          <Text style={styles.summaryLine}>
            {actualLength} questions · about {minutes}{' '}
            {minutes === 1 ? 'minute' : 'minutes'} · {EXAM_PASS_MARK}% to pass
          </Text>
          {actualLength < length && (
            <Text style={styles.summaryNote}>
              {scope?.name} has {scope?.questionCount} questions, so this paper is
              shorter than the length you picked.
            </Text>
          )}
          {best !== null && (
            <Text style={styles.summaryNote} testID="exam-best">
              Your best on this scope: {best.scorePct}%
            </Text>
          )}
        </View>

        <Button
          testID="exam-begin"
          label="Begin exam"
          onPress={begin}
          disabled={actualLength === 0}
          style={styles.begin}
        />

        {recent.length > 0 && (
          <>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              RECENT SITTINGS
            </Text>
            <View style={styles.history}>
              {recent.map((result, index) => (
                <View
                  key={`${result.takenOn}-${result.scopeId}-${index}`}
                  testID={`exam-history-${index}`}
                  style={styles.historyRow}
                  accessibilityRole="text"
                  accessibilityLabel={`${examScopeName(result.scopeId)}, ${
                    result.scorePct
                  } percent, ${result.passed ? 'passed' : 'not passed'}, on ${
                    result.takenOn
                  }`}
                >
                  <View style={styles.historyText}>
                    <Text style={styles.historyScope}>
                      {examScopeName(result.scopeId)}
                    </Text>
                    <Text style={styles.historyMeta}>
                      {result.takenOn} · {result.correct}/{result.total}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.historyScore,
                      {
                        color: result.passed
                          ? colors.success.base
                          : colors.text.secondary,
                      },
                    ]}
                  >
                    {result.scorePct}%
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function Chip({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.body,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  chipLabel: {
    ...typography.body2,
    color: colors.text.primary,
  },
  chipLabelSelected: {
    color: colors.text.onDark,
  },
  summary: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryLine: {
    ...typography.bodyStrong,
    ...tabularNumbers,
    color: colors.text.primary,
  },
  summaryNote: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  begin: {
    marginBottom: spacing.xl,
  },
  history: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line.soft,
  },
  historyText: {
    flexShrink: 1,
  },
  historyScope: {
    ...typography.bodyStrong,
    color: colors.text.primary,
  },
  historyMeta: {
    ...typography.body2,
    color: colors.text.tertiary,
  },
  historyScore: {
    ...typography.h3,
    ...tabularNumbers,
  },
});
