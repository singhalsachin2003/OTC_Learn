import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAccess } from '../../hooks/useAccess';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import {
  buyOffer,
  loadPaywallOffers,
  restoreSubscription,
} from '../../store/thunks/accessThunks';
import { categories } from '../../data/categories';
import { TOTAL_PRODUCTS } from '../../data/products';
import { colors, spacing, typography } from '../../theme';
import {
  freeCategoryName,
  lockedCategoryCount,
  lockedProductCount,
  lockedQuestionCount,
} from '../../utils/access';
import {
  annualSavingPercent,
  hasRenewingOffer,
  presentCustomerCenter,
  type SubscriptionOffer,
} from '../../utils/purchases';

/** How a term reads in a sentence, since the store only supplies a price. */
const PERIOD_LABEL: Record<SubscriptionOffer['period'], string> = {
  monthly: 'Monthly',
  annual: 'Annual',
  lifetime: 'Lifetime',
  other: 'Subscription',
};

const PER_PERIOD: Record<SubscriptionOffer['period'], string> = {
  monthly: 'per month',
  annual: 'per year',
  // A one-off payment has no period, and "once" says so where a blank would
  // read as a value that failed to render.
  lifetime: 'once',
  other: '',
};

/**
 * What a subscription opens, and how to buy one.
 *
 * The screen has to read sensibly in four states, only one of which is the
 * ordinary sales pitch: nothing on sale (every build so far), already
 * subscribed, and grandfathered in. It is reachable from Profile in all of
 * them, so none can be an error page.
 *
 * No price is written here. Play returns them localised and tax-inclusive per
 * country, and the annual saving is worked out from the store's own two
 * figures rather than stated — see `annualSavingPercent`.
 */
export function PaywallScreen() {
  const dispatch = useAppDispatch();
  const { leavePaywall } = useNavigation();
  const { paywalled } = useAccess();
  const {
    offers,
    status,
    error,
    notice,
    premium,
    grandfathered,
    purchasesConfigured,
  } = useAppSelector((state) => state.access);

  // Annual first when it is there: it is the better deal for the reader as
  // well as for us, and defaulting to the cheaper-looking monthly one buries
  // that.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected =
    offers.find((offer) => offer.id === selectedId) ??
    offers.find((offer) => offer.period === 'annual') ??
    offers[0];

  useEffect(() => {
    void dispatch(loadPaywallOffers());
  }, [dispatch]);

  const saving = annualSavingPercent(offers);
  const busy = status !== 'idle';

  return (
    <SafeAreaWrapper testID="paywall-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton label="Back" onPress={leavePaywall} testID="paywall-back" />

        <Text accessibilityRole="header" style={styles.title}>
          {paywalled ? 'Open the whole book' : 'Your access'}
        </Text>

        {!paywalled ? (
          // Reached from Profile by someone who already has everything. Saying
          // "subscribe" to them would be selling something they hold.
          <Text testID="paywall-already-open" style={styles.body}>
            {premium
              ? 'You are subscribed, and every asset class is open.'
              : grandfathered
                ? 'You were here before this app had a subscription, so all of it stays open to you — permanently, and at no cost.'
                : 'Every asset class is open on this build. There is nothing to buy.'}
          </Text>
        ) : (
          <Text style={styles.body}>
            {freeCategoryName()} stays free, always. A subscription adds the rest of
            the catalogue.
          </Text>
        )}

        {/* Only where something is actually being withheld. Listing what a
            subscription adds under "there is nothing to buy" reads as a pitch
            for content the reader already has. */}
        <View style={styles.list}>
          {paywalled ? (
            <>
              <Point
                text={`${lockedProductCount()} more products, across ${lockedCategoryCount()} asset classes`}
              />
              <Point
                text={`Their full question banks — ${lockedQuestionCount()} questions, drawn fresh each sitting`}
              />
              <Point text="Exams and spaced review across everything you have studied" />
              <Point text="Still no adverts, and still nothing to sign up for" />
            </>
          ) : (
            <>
              <Point
                text={`All ${TOTAL_PRODUCTS} products, across ${categories.length} asset classes`}
              />
              <Point text="Every question bank, exam and review sitting" />
              <Point text="No adverts, and nothing to sign up for" />
            </>
          )}
        </View>

        {paywalled && offers.length > 0 && (
          <View testID="paywall-offers">
            {offers.map((offer) => {
              const isSelected = selected?.id === offer.id;
              return (
                <Card
                  key={offer.id}
                  testID={`paywall-offer-${offer.period}`}
                  onPress={() => setSelectedId(offer.id)}
                  accessibilityLabel={`${PERIOD_LABEL[offer.period]}, ${offer.priceString} ${PER_PERIOD[offer.period]}`}
                  accessibilityHint="Chooses this subscription"
                  style={[styles.offer, isSelected && styles.offerSelected]}
                >
                  <View style={styles.offerText}>
                    <View style={styles.offerHeading}>
                      <Text style={styles.offerTerm}>
                        {PERIOD_LABEL[offer.period]}
                      </Text>
                      {offer.period === 'annual' && saving !== null && (
                        <Badge
                          testID="paywall-saving"
                          label={`SAVE ${saving}%`}
                          color={colors.success.text}
                          backgroundColor={colors.success.bgSoft}
                        />
                      )}
                    </View>
                    <Text style={styles.offerPrice}>
                      {offer.priceString}
                      {PER_PERIOD[offer.period] !== '' &&
                        ` ${PER_PERIOD[offer.period]}`}
                    </Text>
                  </View>
                  <View
                    style={[styles.tick, isSelected && styles.tickSelected]}
                    testID={
                      isSelected ? `paywall-selected-${offer.period}` : undefined
                    }
                  >
                    {isSelected && (
                      <Check size={13} strokeWidth={3} color={colors.text.onDark} />
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {error !== null && (
          <Text testID="paywall-error" style={styles.error}>
            {error}
          </Text>
        )}
        {notice !== null && (
          <Text testID="paywall-notice" style={styles.meta}>
            {notice}
          </Text>
        )}

        {paywalled && selected !== undefined && (
          <Button
            testID="paywall-subscribe"
            label={
              status === 'purchasing'
                ? 'Contacting Google Play…'
                : // A lifetime purchase is not a subscription, and a button
                  // saying it is describes the wrong commitment at the moment
                  // the reader is deciding to make it.
                  selected.period === 'lifetime'
                  ? 'Buy'
                  : 'Subscribe'
            }
            disabled={busy}
            onPress={() => {
              void dispatch(buyOffer(selected.id));
            }}
            style={styles.action}
          />
        )}

        {/* Written before the Customer Center existed, this used to tell a
            subscriber to go to Google Play. The app can now open the manage
            and cancel flow itself, so it should, rather than sending them
            somewhere else to do it. */}
        {premium && (
          <Button
            testID="paywall-manage"
            label="Manage subscription"
            variant="outline"
            onPress={() => {
              void presentCustomerCenter();
            }}
            style={styles.action}
          />
        )}

        {/* Only where there is a store to ask. On a build with no key it
            would always report finding nothing, which reads as "your purchase
            is gone" rather than "this build cannot sell anything". */}
        {purchasesConfigured && !premium && !grandfathered && (
          <Button
            testID="paywall-restore"
            label={status === 'restoring' ? 'Checking…' : 'Restore a purchase'}
            variant="outline"
            disabled={busy}
            onPress={() => {
              void dispatch(restoreSubscription());
            }}
            style={styles.action}
          />
        )}

        {/* Only where something actually renews. "Renewed until you cancel"
            under a lifetime purchase would be untrue of the thing being sold. */}
        {paywalled && hasRenewingOffer(offers) && (
          <Text style={styles.smallPrint}>
            Subscriptions are billed through Google Play and renew until you cancel.
            Cancel any time in the Play Store; access lasts to the end of the period
            you have paid for. A lifetime purchase is a single payment and does not
            renew.
          </Text>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function Point({ text }: { text: string }) {
  return (
    <View style={styles.point}>
      <Check size={15} strokeWidth={3} color={colors.success.text} />
      <Text style={styles.pointText}>{text}</Text>
    </View>
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
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body2,
    color: colors.text.body,
  },
  list: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    rowGap: spacing.sm,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: spacing.sm,
  },
  pointText: {
    ...typography.body2,
    color: colors.text.body,
    flex: 1,
  },
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    marginTop: spacing.sm,
  },
  offerSelected: {
    borderColor: colors.dark,
  },
  offerText: {
    flex: 1,
  },
  offerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    marginBottom: 3,
  },
  offerTerm: {
    ...typography.label,
    fontSize: 14.5,
    color: colors.text.primary,
  },
  offerPrice: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  tick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickSelected: {
    borderColor: colors.dark,
    backgroundColor: colors.dark,
  },
  meta: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  error: {
    ...typography.labelSmall,
    color: colors.error.text,
    marginTop: spacing.md,
  },
  action: {
    marginTop: spacing.md,
  },
  smallPrint: {
    ...typography.micro,
    fontSize: 11,
    letterSpacing: 0,
    lineHeight: 16,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
});
