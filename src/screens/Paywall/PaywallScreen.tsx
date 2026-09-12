import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  redeemPromo,
  restoreSubscription,
} from '../../store/thunks/accessThunks';
import { categories } from '../../data/categories';
import { TOTAL_PRODUCTS } from '../../data/products';
import { colors, radius, spacing, typography } from '../../theme';
import {
  depthProductCount,
  premiumCategoryCount,
  premiumProductCount,
  premiumQuestionCount,
} from '../../utils/access';
import { promoDaysRemaining, type RedeemOutcome } from '../../utils/promoCode';
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
 * What each *unsuccessful* redemption says to the reader.
 *
 * Kept here rather than in `utils/promoCode.ts` because it is copy, not rule:
 * the module decides what happened and the screen decides how to put it. Two of
 * these are deliberately not phrased as failures — an expired campaign is not
 * the reader's mistake, and a code shorter than what they already hold is good
 * news badly timed.
 *
 * There is no entry for `granted`, and the type says so rather than leaving a
 * string nothing can reach: a successful redemption unlocks the catalogue, which
 * turns this whole screen into its "Your access" state — headline, days
 * remaining and all. A confirmation line would be announcing something the
 * reader is already looking at, and it would be unmounted the instant it
 * rendered, since the field it sits in only exists while the paywall applies.
 */
const REDEEM_MESSAGE: Record<
  Exclude<RedeemOutcome['result'], 'granted'>,
  string
> = {
  empty: 'Enter a code first.',
  unknown: 'That code is not one we recognise. Check it and try again.',
  'campaign-ended': 'That code has expired.',
  'already-longer': 'You already have longer access than that code would add.',
};

/**
 * What a subscription opens, and how to buy one.
 *
 * The screen has to read sensibly in four states, only one of which is the
 * ordinary sales pitch: nothing on sale (every build so far, and every build
 * until the catalogue gains a premium asset class), already subscribed, and
 * grandfathered in. It is reachable from Profile in all of them, so none can
 * be an error page.
 *
 * What it sells is the pipeline, not the catalogue — everything already
 * written is free. So the pitch counts what a subscription *adds*, and that
 * count is read from the catalogue rather than written here, which is what
 * keeps it from promising content that does not exist.
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
    promoUnlock,
  } = useAppSelector((state) => state.access);

  // Annual first when it is there: it is the better deal for the reader as
  // well as for us, and defaulting to the cheaper-looking monthly one buries
  // that.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const selected =
    offers.find((offer) => offer.id === selectedId) ??
    offers.find((offer) => offer.period === 'annual') ??
    offers[0];

  useEffect(() => {
    void dispatch(loadPaywallOffers());
  }, [dispatch]);

  const saving = annualSavingPercent(offers);
  const busy = status !== 'idle';

  // Reads the grant rather than the derived flag, because the flag is settled at
  // launch and a code redeemed a moment ago has not been through one.
  const promoDays = promoDaysRemaining(promoUnlock, Date.now());

  const onRedeem = async () => {
    setRedeeming(true);
    const outcome = (await dispatch(redeemPromo(code))).payload as RedeemOutcome;
    setRedeeming(false);
    if (outcome.result === 'granted') {
      // Nothing to say and nowhere to say it — see `REDEEM_MESSAGE`. The field
      // is cleared anyway so that a grant that is later spent does not leave a
      // stale code sitting in it.
      setCode('');
      setCodeMessage(null);
      return;
    }
    // A rejected code stays in the field, so a typo can be corrected rather
    // than retyped from the slide it came off.
    setCodeMessage(REDEEM_MESSAGE[outcome.result]);
  };

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
                : promoDays > 0
                  ? // Says when it ends, because a promotional grant is the one
                    // kind of access here that stops on its own, and finding
                    // that out by hitting a locked lesson would feel like
                    // something being taken away.
                    `A promotional code has every asset class open to you for ${promoDays} more ${promoDays === 1 ? 'day' : 'days'}.`
                  : 'Every asset class is open to you. There is nothing to buy.'}
          </Text>
        ) : (
          <Text style={styles.body}>
            Everything the app shipped with stays free, permanently. A subscription
            adds the asset classes written since — and the ones still to come.
          </Text>
        )}

        {/* Only where something is actually being withheld. Listing what a
            subscription adds under "there is nothing to buy" reads as a pitch
            for content the reader already has. */}
        <View style={styles.list}>
          {paywalled ? (
            <>
              <Point
                text={`${premiumProductCount()} more products, across ${premiumCategoryCount()} new asset ${premiumCategoryCount() === 1 ? 'class' : 'classes'}`}
              />
              <Point
                text={`Their full question banks — ${premiumQuestionCount()} questions, drawn fresh each sitting`}
              />
              {depthProductCount() > 0 && (
                <Point
                  text={`Going deeper on ${depthProductCount()} of the free products, with twice the questions in each bank`}
                />
              )}
              <Point text="Every asset class added from here on, at no extra cost" />
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

        {/* A code is worth offering only to someone who would otherwise be
            paying. Showing it to a subscriber invites them to look for one, and
            showing it to a grandfathered reader offers to unlock what they
            already hold. */}
        {paywalled && (
          <View style={styles.promo}>
            {!codeOpen ? (
              // A text link rather than a button: a third full-width control
              // under Subscribe and Restore would read as a third way to pay.
              <Pressable
                testID="paywall-promo-open"
                accessibilityRole="button"
                onPress={() => setCodeOpen(true)}
              >
                <Text style={styles.promoLink}>Have a promo code?</Text>
              </Pressable>
            ) : (
              <>
                <TextInput
                  testID="paywall-promo-input"
                  value={code}
                  onChangeText={setCode}
                  placeholder="Promo code"
                  placeholderTextColor={colors.text.tertiary}
                  accessibilityLabel="Promo code"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoComplete="off"
                  editable={!redeeming}
                  style={styles.promoInput}
                />
                <Button
                  testID="paywall-promo-redeem"
                  label={redeeming ? 'Checking…' : 'Redeem'}
                  variant="outline"
                  disabled={redeeming}
                  onPress={() => {
                    void onRedeem();
                  }}
                />
                {codeMessage !== null && (
                  <Text testID="paywall-promo-message" style={styles.promoMessage}>
                    {codeMessage}
                  </Text>
                )}
                <Text style={styles.smallPrint}>
                  A code opens every asset class for a set number of days, at no
                  cost. It is not a subscription: nothing is charged and nothing
                  renews.
                </Text>
              </>
            )}
          </View>
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
  promo: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  promoInput: {
    ...typography.body2,
    color: colors.text.primary,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  promoLink: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  promoMessage: {
    ...typography.labelSmall,
    color: colors.text.secondary,
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
