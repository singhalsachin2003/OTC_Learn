import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { Ring } from '../../components/ui/Ring';
import { masteryFill } from '../../components/ui/ProductRow';
import { getCategoryById } from '../../data/categories';
import { getProductById } from '../../data/products';
import {
  useBookmarks,
  useAppDispatch,
  useSelectedProductId,
} from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import { toggleProductBookmark } from '../../store/thunks/progressThunks';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';
import { track } from '../../utils/analytics';
import { masteryBand } from '../../utils/mastery';
import { KeyTermList } from './components/KeyTermList';
import { NoteEditor } from './components/NoteEditor';
import { RelatedProducts } from './components/RelatedProducts';
import { WorkedExample } from './components/WorkedExample';

/**
 * The product page — everything about one product that is not the lesson
 * itself: what it is, the terms, a worked example with real numbers, where it
 * shows up in practice, and how well the user knows it.
 *
 * This sits between the category list and the lesson deliberately. Going
 * straight from a list into a five-step lesson gave no way to look something up
 * without committing to the whole flow, and no home for detail that is
 * reference material rather than teaching.
 */
export function ProductScreen() {
  const dispatch = useAppDispatch();
  const productId = useSelectedProductId();
  const { goToCategory, goToLesson, goToQuiz } = useNavigation();
  const { progressFor, masteryFor } = useProgress();
  const bookmarks = useBookmarks();

  const product = getProductById(productId);
  const category = getCategoryById(product?.categoryId ?? null);

  if (product === undefined) {
    return (
      <SafeAreaWrapper testID="product-screen">
        <BackButton
          label="Back"
          onPress={() => goToCategory(category?.id ?? '')}
          testID="product-back"
        />
        <Text style={styles.empty}>That product is unavailable.</Text>
      </SafeAreaWrapper>
    );
  }

  const { accent, soft } = getCategoryColors(product.categoryId);
  const mastery = masteryFor(product.id);
  const progress = progressFor(product.id);
  const bookmarked = bookmarks.includes(product.id);
  const started = progress.attempts > 0;

  const onToggleBookmark = () => {
    void dispatch(toggleProductBookmark(product.id));
    track({
      name: 'bookmark_toggled',
      productId: product.id,
      bookmarked: !bookmarked,
    });
  };

  return (
    <SafeAreaWrapper testID="product-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <BackButton
            label={category?.name ?? 'Back'}
            onPress={() => goToCategory(product.categoryId)}
            testID="product-back"
          />
          <Pressable
            testID="product-bookmark"
            onPress={onToggleBookmark}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityState={{ selected: bookmarked }}
            accessibilityLabel={
              bookmarked ? 'Remove from saved' : 'Save this product'
            }
            style={styles.bookmark}
          >
            {/* A drawn star rather than "★"/"☆" characters — Plus Jakarta Sans
                lacks both glyphs, so Android substituted them from another
                family at a different weight, the same risk already fixed for
                the chevron beside this control. */}
            <Star
              size={22}
              strokeWidth={2}
              color={bookmarked ? accent : colors.chevron}
              fill={bookmarked ? accent : 'none'}
            />
          </Pressable>
        </View>

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.tag, { backgroundColor: soft, color: accent }]}>
              {product.difficulty.toUpperCase()}
            </Text>
            <Text accessibilityRole="header" style={styles.title}>
              {product.name}
            </Text>
            <Text style={styles.hook}>{product.hook}</Text>
          </View>
          <Ring
            testID="product-mastery-ring"
            size={62}
            innerSize={46}
            percent={mastery}
            fillColor={masteryFill(mastery)}
            accessibilityLabel={`${mastery} percent mastery`}
          >
            <Text style={styles.ringValue}>{mastery}%</Text>
          </Ring>
        </View>

        {started && (
          <Text testID="product-stats" style={styles.stats}>
            {progress.attempts} {progress.attempts === 1 ? 'attempt' : 'attempts'} ·
            best {progress.bestScorePct}% · {masteryBand(mastery)}
          </Text>
        )}

        <Text style={styles.summary}>{product.summary}</Text>

        <View style={styles.actions}>
          <Button
            testID="product-start-lesson"
            label={started ? 'Read the lesson again' : 'Start the lesson'}
            flex={1}
            onPress={() => goToLesson(product.id)}
          />
        </View>
        <Button
          testID="product-start-quiz"
          label={`Go straight to the quiz · ${product.quiz.length} in the bank`}
          variant="outline"
          onPress={() => goToQuiz(product.id)}
          style={styles.quizButton}
        />

        <Section title="KEY TERMS">
          <KeyTermList terms={product.keyTerms} accent={accent} />
        </Section>

        <Section title="WORKED EXAMPLE">
          <WorkedExample example={product.example} accent={accent} soft={soft} />
        </Section>

        <Section title="IN PRACTICE">
          <Text style={styles.body}>{product.inPractice}</Text>
        </Section>

        <Section title="YOUR NOTE">
          <NoteEditor noteKey={product.id} />
        </Section>

        <Section title="READ NEXT">
          <RelatedProducts ids={product.relatedProductIds} />
        </Section>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    marginTop: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  tag: {
    ...typography.micro,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: radius.small,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 8,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  hook: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: 3,
  },
  ringValue: {
    ...typography.micro,
    fontSize: 12,
    color: colors.text.primary,
  },
  stats: {
    ...typography.labelSmall,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  summary: {
    ...typography.body1,
    color: colors.text.body,
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  quizButton: {
    marginTop: spacing.sm,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body1,
    color: colors.text.body,
  },
  empty: {
    ...typography.body1,
    color: colors.text.body,
    marginTop: spacing.lg,
  },
});
