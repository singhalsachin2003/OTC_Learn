import { StyleSheet, Text, View } from 'react-native';
import { Lock, Star } from 'lucide-react-native';

import type { Product } from '../../data/types';
import {
  colors,
  masteryColors,
  radius,
  spacing,
  tabularNumbers,
  typography,
} from '../../theme';
import { masteryBand, MASTERY_COMPLETE } from '../../utils/mastery';
import { CompletedBadge } from './Badge';
import { Card } from './Card';
import { Ring } from './Ring';

export interface ProductRowProps {
  product: Product;
  /** 0–100. */
  mastery: number;
  onPress: () => void;
  /** Shows a bookmark mark when the user has saved this product. */
  bookmarked?: boolean;
  /** Shown instead of the hook where the extra context helps — e.g. search. */
  subtitle?: string;
  /** Needs a subscription. Shows a lock where the mastery ring would be. */
  locked?: boolean;
}

export function masteryFill(mastery: number): string {
  const band = masteryBand(mastery);
  if (band === 'strong') {
    return masteryColors.strong;
  }
  if (band === 'building') {
    return masteryColors.building;
  }
  return band === 'shaky' ? masteryColors.shaky : masteryColors.none;
}

/**
 * One product in a list: name, hook, and a mastery ring.
 *
 * The ring replaces the old completed-or-not tick for everything below the
 * threshold, because "37%" and "not started" are different states that the tick
 * could not tell apart. At full mastery the tick comes back — a ring reading
 * 100% is less legible at a glance than the badge it replaced.
 */
export function ProductRow({
  product,
  mastery,
  onPress,
  bookmarked = false,
  subtitle,
  locked = false,
}: ProductRowProps) {
  const mastered = mastery >= MASTERY_COMPLETE;

  return (
    <Card
      testID={`product-row-${product.id}`}
      onPress={onPress}
      accessibilityLabel={`${product.name}. ${subtitle ?? product.hook}. ${
        locked
          ? 'Needs a subscription.'
          : mastered
            ? 'Mastered.'
            : `${mastery} percent mastery.`
      }${bookmarked ? ' Saved.' : ''}`}
      accessibilityHint="Opens this product"
      style={styles.card}
    >
      <View style={styles.text}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{product.name}</Text>
          {bookmarked && (
            // lucide's icon doesn't forward testID to a queryable node itself
            // (it renders straight to react-native-svg primitives), so the
            // test hook sits on a wrapping View instead.
            <View
              testID={`product-saved-${product.id}`}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Star
                size={11}
                strokeWidth={2}
                color={colors.progressFillText}
                fill={colors.progressFillText}
              />
            </View>
          )}
        </View>
        <Text style={styles.hook}>{subtitle ?? product.hook}</Text>
      </View>

      {locked ? (
        // Where the ring would be, because it answers the same question — how
        // far in are you — with the reason there is no answer yet. lucide's
        // icons do not forward testID, so the hook sits on a wrapping View.
        <View testID={`product-locked-${product.id}`} style={styles.lock}>
          <Lock size={15} strokeWidth={2.5} color={colors.text.tertiary} />
        </View>
      ) : mastered ? (
        <CompletedBadge testID={`product-done-${product.id}`} />
      ) : (
        <Ring
          testID={`product-ring-${product.id}`}
          size={34}
          innerSize={26}
          percent={mastery}
          fillColor={masteryFill(mastery)}
          animated={false}
        >
          {/* Nothing inside an untouched ring. The "·" that used to sit here
              read as a stray glyph or a value that failed to bind — and on a
              fresh install it was every row on the screen. An empty ring at a
              visible track colour says "not started" without saying anything. */}
          {mastery > 0 && <Text style={styles.ringLabel}>{mastery}</Text>}
        </Ring>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    borderRadius: radius.large,
    marginBottom: 10,
  },
  text: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    marginBottom: 3,
  },
  name: {
    ...typography.label,
    fontSize: 14.5,
    color: colors.text.primary,
    flexShrink: 1,
  },
  hook: {
    ...typography.labelSmall,
    color: colors.text.muted,
  },
  lock: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    ...typography.micro,
    ...tabularNumbers,
    fontSize: 10,
    letterSpacing: 0,
    color: colors.text.secondary,
  },
});
