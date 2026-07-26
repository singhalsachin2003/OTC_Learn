import { StyleSheet, View } from 'react-native';

import { colors } from '../../../theme';

export interface StepIndicatorProps {
  totalSteps: number;
  /** Zero-based index of the step currently shown. */
  currentStep: number;
  /** Category accent used to fill completed dots. */
  color: string;
  testID?: string;
}

/** Row of thin bars, filled up to and including the current step. */
export function StepIndicator({
  totalSteps,
  currentStep,
  color,
  testID,
}: StepIndicatorProps) {
  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${currentStep + 1} of ${totalSteps}`}
      accessibilityValue={{ min: 1, max: totalSteps, now: currentStep + 1 }}
      style={styles.row}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index <= currentStep ? color : colors.trackDot },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    columnGap: 6,
    marginBottom: 18,
  },
  dot: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
});
