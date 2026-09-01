import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Check } from 'lucide-react-native';

import { ProductRow } from '../../components/ui/ProductRow';
import { Ring } from '../../components/ui/Ring';
import { getCategoryById } from '../../data/categories';
import { pathFor } from '../../data/paths';
import { pathSteps } from '../../utils/paths';
import { getProductById } from '../../data/products';
import { useBookmarks, useSelectedCategoryId } from '../../hooks/useAppState';
import { useAccess } from '../../hooks/useAccess';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';

export function CategoryScreen() {
  const categoryId = useSelectedCategoryId();
  const { goHome, goToProduct } = useNavigation();
  const { masteryFor, categoryPercent, masteredInCategory } = useProgress();
  const bookmarks = useBookmarks();
  const { productLocked } = useAccess();

  const category = getCategoryById(categoryId);
  // Path order, not catalogue order — the catalogue is the order things were
  // written in, which put an advanced product second.
  const steps = pathSteps(pathFor(categoryId), masteryFor);
  const products = steps.flatMap((step) => getProductById(step.productId) ?? []);

  if (category === undefined) {
    return (
      <SafeAreaWrapper testID="category-screen">
        <BackButton label="Home" onPress={goHome} testID="category-back" />
        <Text style={styles.empty}>That asset class is unavailable.</Text>
      </SafeAreaWrapper>
    );
  }

  const { accent, soft } = getCategoryColors(category.id);
  const percent = categoryPercent(category.id);
  const mastered = masteredInCategory(category.id);

  return (
    <SafeAreaWrapper testID="category-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton label="Home" onPress={goHome} testID="category-back" />

        <View style={[styles.header, { backgroundColor: soft }]}>
          <Ring size={54} innerSize={40} percent={percent} fillColor={accent}>
            <Text style={[styles.headerIcon, { color: accent }]}>
              {category.icon}
            </Text>
          </Ring>
          <View style={styles.headerText}>
            <Text accessibilityRole="header" style={styles.title}>
              {category.name}
            </Text>
            <Text style={styles.meta}>
              {mastered} of {products.length} mastered · {percent}% overall
            </Text>
          </View>
        </View>

        <Text style={styles.blurb}>{category.description}</Text>

        {steps.map((step) => {
          const product = getProductById(step.productId);
          if (product === undefined) {
            return null;
          }
          return (
            <View key={step.productId} style={styles.step}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.marker,
                    step.state === 'done' && { backgroundColor: accent },
                    step.state === 'current' && {
                      borderColor: accent,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  {step.state === 'done' ? (
                    <Check size={13} strokeWidth={3} color={colors.text.onDark} />
                  ) : (
                    <Text
                      style={[
                        styles.markerText,
                        step.state === 'current' && { color: accent },
                      ]}
                    >
                      {step.position}
                    </Text>
                  )}
                </View>
                {/* The line stops at the last marker rather than trailing off
                    the end of the route. */}
                {step.position < steps.length && <View style={styles.railLine} />}
              </View>

              <View style={styles.stepBody}>
                {step.state === 'current' && (
                  <Text
                    testID={`category-next-${step.productId}`}
                    style={[styles.upNext, { color: accent }]}
                  >
                    {steps.some((s) => s.state === 'done') ? 'NEXT' : 'START HERE'}
                  </Text>
                )}
                <ProductRow
                  product={product}
                  mastery={step.mastery}
                  bookmarked={bookmarks.includes(product.id)}
                  locked={productLocked(product.id)}
                  onPress={() => goToProduct(product.id)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  // The route down the left: a numbered marker per product, joined by a line,
  // so the order reads as a sequence rather than as a list that happens to be
  // in some order.
  step: {
    flexDirection: 'row',
    columnGap: spacing.md,
  },
  rail: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  marker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    ...typography.micro,
    fontSize: 12,
    color: colors.text.tertiary,
  },
  railLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  stepBody: {
    flex: 1,
  },
  upNext: {
    ...typography.micro,
    // No negative bottom margin to tuck this against the card below it: the
    // card is drawn after, so it covers the label's descenders and "NEXT"
    // renders as "NFXT". Worth the extra few pixels.
    marginTop: spacing.md,
    marginBottom: 2,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  headerIcon: {
    ...typography.micro,
    fontSize: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  meta: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    marginTop: 3,
  },
  blurb: {
    ...typography.body2,
    color: colors.text.blurb,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  empty: {
    ...typography.body1,
    color: colors.text.body,
    marginTop: spacing.lg,
  },
});
