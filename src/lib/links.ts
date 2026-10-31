// Share links for an invite (browser and server).

/** Paths a custom link can never take (pages of the site, now or soon). */
const RESERVED = new Set([
  'i', 'api', 'dashboard', 'login', 'signup', 'logout', 'forgot-password', 'reset-password', 'templates', 'template',
  'privacy', 'privacy-policy', 'terms', 'terms-of-service', 'terms-and-conditions', 'contact', 'contact-us', 'help', 'support',
  'pricing', 'premium', 'refund-policy', 'refunds', 'wedding-invitation-wording', 'blog', 'about', 'admin', 'account',
  'settings', 'billing', 'payments', 'checkout', 'sitemap', 'robots', 'icon', 'apple-icon', 'brand', 'static', 'assets',
  'favicon', 'opengraph-image', 'nimantran', 'getnimantran', 'www', 'mail', 'app', 'invite', 'invites', 'wedding', 'weds',
]);

export const CUSTOM_SLUG_RULE = 'Use 3–40 small letters, numbers and single hyphens, like amit-nikita.';

/** Normalise what the couple typed ("Amit & Nikita" → "amit-nikita"). */
export const tidySlug = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

/** '' if fine, else why not. */
export function customSlugProblem(slug: string) {
  if (!/^[a-z0-9](?:[a-z0-9]|-(?!-)){1,38}[a-z0-9]$/.test(slug)) return CUSTOM_SLUG_RULE;
  if (RESERVED.has(slug)) return 'That name is used by a page of the site. Please pick another.';
  return '';
}

/** A suggestion for the custom link box: "amit-nikita". */
export const suggestSlug = (p1: string, p2: string) => tidySlug(`${p1.split(/\s+/)[0]}-${p2.split(/\s+/)[0]}`) || 'our-wedding';

type Linkable = { slug: string; premium?: boolean; customSlug?: string };

/** Path guests should be sent to: the short link for Premium invites, else /i/<slug>. */
export const sharePath = (inv: Linkable) => (inv.premium && inv.customSlug ? `/${inv.customSlug}` : `/i/${inv.slug}`);

/** Where the invite page itself lives (the short link redirects here). */
export const pagePath = (inv: Linkable) => `/i/${inv.premium && inv.customSlug ? inv.customSlug : inv.slug}`;
