import 'server-only';
import { FREE_FAMILY_CARDS, type PlanInfo } from './plan';

/*
 * Payments are off until PAYMENTS_ENABLED=true. While off, nothing about
 * Premium is shown and every invite works exactly as before (no limits).
 * Invites that already paid keep their perks either way.
 */

export const paymentsEnabled = () => process.env.PAYMENTS_ENABLED === 'true';

const paise = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 100 ? n : fallback;
};

/** Price of Premium in paise. Change PREMIUM_PRICE_PAISE (29900 → 49900) to reprice; no code change. */
export const premiumPrice = () => paise(process.env.PREMIUM_PRICE_PAISE, 29900);
/** Optional "was" price shown struck through during the launch offer (e.g. 49900). 0 = none. */
export const premiumMrp = () => {
  const mrp = paise(process.env.PREMIUM_MRP_PAISE, 0);
  return mrp > premiumPrice() ? mrp : 0;
};

export const planInfo = (): PlanInfo => ({ enabled: paymentsEnabled(), price: premiumPrice(), mrp: premiumMrp(), freeFamilyCards: FREE_FAMILY_CARDS });

/** Razorpay keys, or a message saying what's missing. */
export function razorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
  const missing = [!keyId && 'RAZORPAY_KEY_ID', !keySecret && 'RAZORPAY_KEY_SECRET'].filter(Boolean);
  return { keyId, keySecret, webhookSecret, problem: missing.length ? `Missing ${missing.join(' and ')}` : '' };
}

/**
 * Limits only apply while payments are on: with them off, family cards and
 * the guest list download stay free for everyone, as before.
 */
export const hasPerks = (invite: { premium?: boolean | null }) => !paymentsEnabled() || invite.premium === true;
