// What Premium costs and includes. Shared by server and browser (no secrets here).

/** Free (unpaid) invites can try this many family cards, as a watermarked sample. */
export const FREE_FAMILY_CARDS = 1;
/** Invites per account (paid or not) while payments are on. */
export const MAX_INVITES = 1;

/** The perks, in the order the pricing page and upgrade box list them. */
export const PREMIUM_PERKS = [
  { key: 'publish', title: 'Publish and share with guests', detail: 'Your invite goes live: one link for WhatsApp, a QR code for printed cards, and guest replies.' },
  { key: 'link', title: 'Your own short link', detail: 'getnimantran.com/amit-nikita instead of a long code, easy to say on a call.' },
  { key: 'footer', title: 'No “Made with Nimantran” footer', detail: 'Your invite ends with your wedding, nothing else.' },
  { key: 'cards', title: 'Unlimited family cards', detail: 'A card and a personal link, with their name on it, for every family you invite.' },
  { key: 'download', title: 'Guest list download', detail: 'Everyone who replied, with headcount and functions, as a spreadsheet for caterers and the venue.' },
] as const;

/** What the browser needs to know (from GET /api/payments/plan). */
export type PlanInfo = { enabled: boolean; price: number; mrp: number; freeFamilyCards: number; maxInvites: number; paywallStart: string };

type Shareable = { premium?: boolean | null; createdAt?: string | Date | null };
/**
 * Can this invite be published and opened by guests? Always while payments are
 * off; otherwise only after paying, except invites created before the paywall
 * started (they were shared for free already and keep working, with their old limits).
 */
export function canShareWith(inv: Shareable, plan: { enabled: boolean; paywallStart: string }) {
  if (!plan.enabled || inv.premium === true) return true;
  return !!inv.createdAt && new Date(inv.createdAt).getTime() < new Date(plan.paywallStart).getTime();
}

/** ₹ from paise, without decimals when whole: 29900 → "₹299". */
export const rupees = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
