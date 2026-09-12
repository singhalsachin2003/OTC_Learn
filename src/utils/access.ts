import { categories } from '../data/categories';
import { products } from '../data/products';
import type { Question } from '../data/types';

/**
 * Who can open what.
 *
 * The rule is that **everything the app has already shipped is free, and stays
 * free**. A subscription buys the asset classes added after the paywall — new
 * topics, not the existing catalogue — and each category says which side of
 * that line it falls on through its own `premium` flag.
 *
 * This is the inverse of what v1.2 first built, which held five of six asset
 * classes back and left Interest Rate open. That model was wrong for a reason
 * worth recording, because it will look like the obvious design again to the
 * next person who reads this: **a content paywall over a finished catalogue
 * makes the subscriptions irrational.** Nothing renews if nothing is added, so
 * every rational buyer takes the cheapest one-off tier and recurring revenue
 * collapses. Selling the pipeline instead is what gives a renewal something to
 * be a renewal *of*.
 *
 * Four guards sit around the rule, and all four exist to stop the paywall
 * doing damage rather than to make it work.
 *
 * **It is inert unless purchases are configured.** A build with no RevenueCat
 * key cannot tell whether anyone has paid, so `isPremium` answers `false` for
 * everybody. Gating on that would lock content for every user of a build that
 * has no way to sell them anything. Off by default is the only safe default.
 *
 * **Never lock what cannot be bought.** A key alone is not enough: the Play
 * product has to exist and RevenueCat has to be serving an offering that
 * contains it. The key is one environment variable and the product is weeks of
 * merchant verification away, so the order they arrive in is not something to
 * rely on getting right. The SDK caches the last offering it fetched, so this
 * stays true offline once it has been true once.
 *
 * **Never sell what does not exist.** The mirror of the guard above, and the
 * one this model needs that the old one did not. Until a category is actually
 * marked `premium`, a subscription would add nothing to what the reader
 * already has, and the honest thing to do with a pitch for nothing is not show
 * it. This guard held the paywall inert from 2026-09-06 until Exotics shipped
 * on 2026-09-08; it now passes, and the other three are what decide whether any
 * given install sees a lock.
 *
 * **Anyone who was already using the app keeps all of it.** `grandfathered` is
 * set once, for installs that predate the paywall, and never expires. Under
 * the old model this stopped five asset classes being taken back from people
 * who had them. Under this one nothing is being taken from anybody, so what it
 * now means is narrower and more generous: those installs get the new asset
 * classes free as well, permanently. That is a promise the shipped build
 * already made them in as many words, so it is kept.
 *
 * A fifth input sits beside those four rather than among them, because it is
 * not a guard: `promoUnlocked` is a promotional code running, and unlike the
 * other four it **expires**. It reads as a temporary `grandfathered`, and
 * `utils/promoCode.ts` carries the reasoning — including why a code can only
 * ever grant free access for a while and never a discount.
 */

/**
 * What is deliberately *not* behind this, so a later reader does not take it
 * for an oversight:
 *
 * - **The entire current catalogue** — every product, question bank, exam and
 *   review sitting in all six asset classes. That is the point of the model,
 *   not an omission from it.
 * - **The glossary's index**, but not all of its definitions. Every term stays
 *   listed, including those from a paid asset class, so the reference still
 *   answers "does this app cover vanna" and a search still finds it. The
 *   *definition* of a paid term is withheld, which reverses the call made when
 *   Exotics shipped: leaving 72 definitions open was the largest thing the app
 *   gave away, and a definition is the teaching rather than the index. Every
 *   free term is defined as it always was.
 * - **Insights, notes and achievements.** They describe the reader's own
 *   record. They were built before the paywall and shipped unlocked, and
 *   closing them now would be the same removal this model exists to avoid.
 * - **Everything a product shipped with**, even where paid depth has since been
 *   added to it: the five lesson steps, the twelve questions, the worked
 *   example and the key terms of all 36 free products. Depth is strictly extra.
 * - **Mastery already earned.** Nothing is ever recalculated or withdrawn. A
 *   lapsed subscriber keeps every number they earned and gets it all back the
 *   moment they resubscribe.
 */

/** The ids of the asset classes a subscription adds. Read from the catalogue. */
function premiumCategoryIds(): Set<string> {
  return new Set(categories.filter((c) => c.premium).map((c) => c.id));
}

export interface AccessState {
  /** Whether this build can sell anything at all. */
  purchasesConfigured: boolean;
  /** Whether the store is actually offering something to buy. */
  hasPurchasableOffer: boolean;
  /** Whether the user holds the entitlement. */
  premium: boolean;
  /** Whether this install predates the paywall. */
  grandfathered: boolean;
  /** Whether a promotional code is currently running. See `utils/promoCode.ts`. */
  promoUnlocked: boolean;
}

/**
 * Whether the paywall applies to this user at all.
 *
 * Every `false` here means the app behaves exactly as it did before billing
 * existed, which is the state every install is in today and will stay in until
 * the catalogue has something premium in it.
 */
export function paywallApplies(access: AccessState): boolean {
  return (
    access.purchasesConfigured &&
    access.hasPurchasableOffer &&
    !access.premium &&
    !access.grandfathered &&
    !access.promoUnlocked &&
    premiumCategoryCount() > 0
  );
}

export function canOpenCategory(categoryId: string, access: AccessState): boolean {
  return !paywallApplies(access) || !premiumCategoryIds().has(categoryId);
}

/**
 * Products carry their category, so this is the same question asked of a
 * product.
 *
 * An id that does not resolve now fails *open*, where under the old model it
 * failed closed. That reversal is deliberate and follows from the inversion:
 * when only one asset class was free, anything unrecognised might well have
 * been paid content, so locking it protected revenue. Now that paid content is
 * an explicit, short list, anything unrecognised is by definition not on it —
 * and locking it would put a "subscribe to read this" card in front of
 * something that does not exist to be sold. A bad id is still a bug; the
 * screens handle a missing product on their own, and this should not answer a
 * question about pricing by inventing a product.
 */
export function canOpenProduct(
  product: { categoryId: string } | undefined,
  access: AccessState,
): boolean {
  if (!paywallApplies(access)) {
    return true;
  }
  return product === undefined || !premiumCategoryIds().has(product.categoryId);
}

/**
 * Whether the reader may open the paid depth on an otherwise free product.
 *
 * Depth is the second thing a subscription buys, and it is the one that needed
 * the model read carefully. The rule is that a subscription buys what is added
 * *after* the paywall — which permits adding to a product that already exists,
 * and forbids taking anything out of one. So the five lesson steps and twelve
 * questions every product shipped with stay open to everybody forever, and the
 * sections and second bank added later do not.
 *
 * Note what this does not depend on: the product's category. A free asset class
 * can carry paid depth, which is the whole point — it makes the subscription
 * worth something to a reader who only ever opens Interest Rate.
 */
export function canOpenDepth(access: AccessState): boolean {
  return !paywallApplies(access);
}

/**
 * The questions a quiz on this product may draw from, for this reader.
 *
 * A subscriber draws from both banks, so papers vary more and run harder; for
 * everyone else this returns exactly what it returned before depth existed.
 */
export function openQuizFor(
  product: { quiz: Question[]; depth?: { quiz: Question[] } },
  access: AccessState,
): Question[] {
  if (product.depth === undefined || !canOpenDepth(access)) {
    return product.quiz;
  }
  return [...product.quiz, ...product.depth.quiz];
}

/**
 * Whether one question is out of reach — asked by the review queue, which
 * stores ids and has to survive a subscription lapsing between sittings.
 *
 * An unresolvable id fails *open*, as everywhere else here: it is a bug in the
 * queue rather than a thing to sell.
 */
export function canOpenQuestion(
  found: { product: { categoryId: string }; depth: boolean } | undefined,
  access: AccessState,
): boolean {
  if (found === undefined) {
    return true;
  }
  return found.depth ? canOpenDepth(access) : canOpenProduct(found.product, access);
}

/** How many asset classes a subscription adds, for the paywall's copy. */
export function premiumCategoryCount(): number {
  return categories.filter((c) => c.premium).length;
}

/** How many products come with them. Counted, never written down. */
export function premiumProductCount(): number {
  const premium = premiumCategoryIds();
  return products.filter((p) => premium.has(p.categoryId)).length;
}

/**
 * How many questions come with them. Also counted from the catalogue, and now
 * counting both halves of the pitch: the banks inside the paid asset classes,
 * and the depth banks added to the free ones.
 */
export function premiumQuestionCount(): number {
  const premium = premiumCategoryIds();
  return products.reduce((total, p) => {
    const paidBank = premium.has(p.categoryId) ? p.quiz.length : 0;
    return total + paidBank + (p.depth?.quiz.length ?? 0);
  }, 0);
}

/** How many free products a subscription adds depth to, for the same copy. */
export function depthProductCount(): number {
  const premium = premiumCategoryIds();
  return products.filter((p) => p.depth !== undefined && !premium.has(p.categoryId))
    .length;
}

/**
 * The premium asset classes by name, for copy that should list what is on
 * offer rather than count it.
 */
export function premiumCategoryNames(): string[] {
  return categories.filter((c) => c.premium).map((c) => c.name);
}
