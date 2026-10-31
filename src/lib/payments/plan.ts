// What Premium costs and includes. Shared by server and browser (no secrets here).

/** Free invites can send this many personal family cards. */
export const FREE_FAMILY_CARDS = 5;

/** The perks, in the order the pricing page and upgrade box list them. */
export const PREMIUM_PERKS = [
  { key: 'link', title: 'Your own short link', detail: 'getnimantran.com/amit-nikita instead of a long code, easy to say on a call.' },
  { key: 'footer', title: 'No “Made with Nimantran” footer', detail: 'Your invite ends with your wedding, nothing else.' },
  { key: 'cards', title: 'Unlimited family cards', detail: `Free invites include ${FREE_FAMILY_CARDS}. Premium lets you send one to every family on your list.` },
  { key: 'download', title: 'Guest list download', detail: 'Everyone who replied, with headcount and functions, as a spreadsheet for caterers and the venue.' },
] as const;

/** What the browser needs to know (from GET /api/payments/plan). */
export type PlanInfo = { enabled: boolean; price: number; mrp: number; freeFamilyCards: number };

/** ₹ from paise, without decimals when whole: 29900 → "₹299". */
export const rupees = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
