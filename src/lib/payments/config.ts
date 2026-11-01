import 'server-only';
import { canShareWith, FREE_FAMILY_CARDS, MAX_INVITES, type PlanInfo } from './plan';

/*
 * Payments are off until PAYMENTS_ENABLED=true. While off, nothing about
 * Premium is shown and every invite works exactly as before (no limits).
 * While on, an invite must be paid for (Premium) before it can be published
 * and opened by guests. Invites that already paid keep their perks either way.
 */

// Forgiving about how it's typed in the hosting dashboard: true, TRUE, "true", 1, yes, on.
const truthy = (v: string | undefined) => ['true', '1', 'yes', 'on'].includes((v ?? '').trim().replace(/^["']|["']$/g, '').toLowerCase());
export const paymentsEnabled = () => truthy(process.env.PAYMENTS_ENABLED);

const paise = (v: string | undefined, fallback: number) => {
  const n = Number((v ?? '').trim().replace(/^["']|["']$/g, ''));
  return Number.isInteger(n) && n >= 100 ? n : fallback;
};

/** Price of Premium in paise. Change PREMIUM_PRICE_PAISE (29900 → 49900) to reprice; no code change. */
export const premiumPrice = () => paise(process.env.PREMIUM_PRICE_PAISE, 29900);
/** Optional "was" price shown struck through during the launch offer (e.g. 49900). 0 = none. */
export const premiumMrp = () => {
  const mrp = paise(process.env.PREMIUM_MRP_PAISE, 0);
  return mrp > premiumPrice() ? mrp : 0;
};

/**
 * When "pay to publish" began. Invites created before it keep working for free.
 * PAYWALL_START can move it (ISO date, e.g. 2026-11-01T00:00:00+05:30).
 */
export function paywallStart() {
  const raw = (process.env.PAYWALL_START ?? '').trim().replace(/^["']|["']$/g, '');
  const d = new Date(raw || '2026-11-01T00:00:00+05:30');
  return Number.isNaN(d.getTime()) ? '2026-11-01T00:00:00+05:30' : d.toISOString();
}

export const planInfo = (): PlanInfo => ({
  enabled: paymentsEnabled(), price: premiumPrice(), mrp: premiumMrp(),
  freeFamilyCards: FREE_FAMILY_CARDS, maxInvites: MAX_INVITES, paywallStart: paywallStart(),
});

/** Can guests open this invite (and can it be published)? See canShareWith. */
export const canShare = (inv: { premium?: boolean | null; createdAt?: string | Date | null }) =>
  canShareWith(inv, { enabled: paymentsEnabled(), paywallStart: paywallStart() });

/** Razorpay keys, or a message saying what's missing. */
export function razorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
  const missing = [!keyId && 'RAZORPAY_KEY_ID', !keySecret && 'RAZORPAY_KEY_SECRET'].filter(Boolean);
  return { keyId, keySecret, webhookSecret, problem: missing.length ? `Missing ${missing.join(' and ')}` : '' };
}

/**
 * Unlimited family cards and the guest list download. Limits only apply while
 * payments are on, and not to invites from before the paywall (they had these free).
 */
export const hasPerks = canShare;
