import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, X } from 'lucide-react-native';

import { colors, layout, radius, spacing, typography } from '../../../theme';

export interface ChoiceOptionsProps {
  options: readonly string[];
  isAnswered: boolean;
  /** Index the user picked, or null before they answer. */
  selectedIndex: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;

/**
 * The four options of a multiple-choice question.
 *
 * After answering, the right option is always marked — not just the one that
 * was picked — because being told "wrong" without being shown the answer is
 * the least useful thing a quiz can do. Correctness is carried by the ✓/✗ mark
 * and the letter badge as well as by colour, so it survives a colour-blind
 * reader and a greyscale screenshot.
 */
export function ChoiceOptions({
  options,
  isAnswered,
  selectedIndex,
  correctIndex,
  onSelect,
}: ChoiceOptionsProps) {
  return (
    <View testID="quiz-options" style={styles.list}>
      {options.map((option, index) => {
        const isCorrect = index === correctIndex;
        const isSelected = index === selectedIndex;
        const reveal = isAnswered && (isCorrect || isSelected);
        const tone = !reveal ? 'idle' : isCorrect ? 'correct' : 'incorrect';

        return (
          <Pressable
            key={option}
            testID={`quiz-option-${index}`}
            disabled={isAnswered}
            onPress={() => onSelect(index)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected, disabled: isAnswered }}
            accessibilityLabel={`${LETTERS[index] ?? index + 1}. ${option}`}
            style={({ pressed }) => [
              styles.option,
              tone === 'correct' && styles.correct,
              tone === 'incorrect' && styles.incorrect,
              pressed && !isAnswered && styles.pressed,
            ]}
          >
            {reveal ? (
              <View
                style={[
                  styles.letter,
                  styles.letterMark,
                  isCorrect ? styles.letterCorrect : styles.letterIncorrect,
                ]}
              >
                {isCorrect ? (
                  <Check size={13} strokeWidth={3} color={colors.text.onDark} />
                ) : (
                  <X size={13} strokeWidth={3} color={colors.text.onDark} />
                )}
              </View>
            ) : (
              <Text style={styles.letter}>{LETTERS[index] ?? '?'}</Text>
            )}
            <Text
              style={[
                styles.label,
                tone === 'correct' && styles.labelCorrect,
                tone === 'incorrect' && styles.labelIncorrect,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    rowGap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    minHeight: layout.minTouchTarget,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.large,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.8,
  },
  correct: {
    borderColor: colors.success.strong,
    backgroundColor: colors.success.bgSoft,
  },
  incorrect: {
    borderColor: colors.error.strong,
    backgroundColor: colors.error.bgSoft,
  },
  letter: {
    ...typography.label,
    fontSize: 12,
    width: 22,
    height: 22,
    lineHeight: 22,
    textAlign: 'center',
    borderRadius: 11,
    overflow: 'hidden',
    color: colors.text.secondary,
    backgroundColor: colors.track,
  },
  /** The same disc, laid out to centre an icon rather than a letter. */
  letterMark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCorrect: {
    color: colors.text.onDark,
    backgroundColor: colors.success.strong,
  },
  letterIncorrect: {
    color: colors.text.onDark,
    backgroundColor: colors.error.strong,
  },
  label: {
    ...typography.body2,
    color: colors.text.primary,
    flex: 1,
  },
  labelCorrect: {
    color: colors.success.text,
  },
  labelIncorrect: {
    color: colors.error.text,
  },
});
