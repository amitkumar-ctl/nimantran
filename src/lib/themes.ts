import type { CSSProperties } from 'react';
import { FEATURED, FEATURED_IDS, type FeaturedId } from './templates/featured';
import { buildGenerated, FAMILY, generatedIds } from './templates/generator';
import { ORNAMENTS, FRAMES } from './templates/parts';
import type { Category, TemplateInfo } from './templates/types';

/*
 * Every invitation design is reached through this file.
 *  - 12 hand-designed "featured" templates (templates/featured.ts)
 *  - a few thousand generated ones (templates/generator.ts), rebuilt from their id
 * Colours become CSS variables (see themeVars), which Tailwind utilities like
 * `text-inv-accent` read, so the same markup renders every design.
 */

export type { Category, EventSet, Frame, NameStyle, Ornament, TemplateInfo } from './templates/types';
export { FEATURED_IDS };
/** A template id: a featured id ('royal') or a generated one ('g-maroon-lotus-toran-serif'). */
export type Theme = string;

export const DEFAULT_THEME = 'royal';
export const CATEGORIES: Category[] = ['Traditional', 'Regional', 'Pastel & modern', 'Destination'];
export const COLOUR_FAMILIES = ['Red', 'Pink', 'Orange & yellow', 'Green', 'Blue & teal', 'Purple', 'Ivory & gold', 'White & silver', 'Black & grey'] as const;

const FEATURED_FAMILY: Record<FeaturedId, string> = {
  royal: 'Red', marigold: 'Orange & yellow', garden: 'Green', midnight: 'Blue & teal', blush: 'Pink', ivory: 'Ivory & gold',
  peacock: 'Blue & teal', lotus: 'Purple', sindoor: 'Red', kasavu: 'Ivory & gold', mughal: 'Green', sunset: 'Pink',
};
const ORNAMENT_WORDS = new Map(ORNAMENTS.map((o) => [o.id, o.words]));
const FRAME_WORDS = new Map(FRAMES.map((f) => [f.id, f.words]));
const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);

const isFeatured = (id: string): id is FeaturedId => (FEATURED_IDS as readonly string[]).includes(id);

function buildFeatured(id: FeaturedId): TemplateInfo {
  const f = FEATURED[id];
  return {
    ...f, id, featured: true, nameStyle: f.nameStyle ?? 'script',
    tags: [
      ...(f.tags ?? []), ...words(`${f.name} ${f.tagline} ${f.bestFor} ${f.description}`),
      ...(ORNAMENT_WORDS.get(f.ornament) ?? []), ...(FRAME_WORDS.get(f.frame) ?? []),
      FEATURED_FAMILY[id].toLowerCase(), f.dark ? 'dark' : 'light pastel soft', 'featured', 'popular',
    ],
  };
}

const cache = new Map<string, TemplateInfo | null>();
function lookup(id: string): TemplateInfo | null {
  if (!cache.has(id)) cache.set(id, isFeatured(id) ? buildFeatured(id) : buildGenerated(id));
  return cache.get(id)!;
}

export const isTheme = (id: unknown): id is Theme => typeof id === 'string' && id.length < 60 && lookup(id) !== null;

/** Any template by id; unknown ids fall back to the classic design. */
export const getTemplate = (id: string | null | undefined): TemplateInfo => (id && lookup(id)) || lookup(DEFAULT_THEME)!;

export const colourFamily = (t: TemplateInfo) =>
  t.featured ? FEATURED_FAMILY[t.id as FeaturedId] : FAMILY[t.id.split('-')[1]] ?? 'Red';

let all: TemplateInfo[] | null = null;
/** Every template: featured first, then the generated catalogue. */
export function allTemplates(): TemplateInfo[] {
  all ??= [...FEATURED_IDS, ...generatedIds()].map((id) => lookup(id)!);
  return all;
}
export const templateCount = () => allTemplates().length;

/* ----------------------------- search ----------------------------- */

export type TemplateFilters = { category?: Category; family?: string; ornament?: string; frame?: string; nameStyle?: string; tone?: 'dark' | 'light' };

/** Extra spellings people type, mapped onto words in our tags. */
const SYNONYMS: Record<string, string[]> = {
  red: ['lal', 'maroon', 'ruby', 'sindoor'], lal: ['red'], pink: ['gulabi', 'blush', 'rani'], gulabi: ['pink'],
  green: ['hara', 'emerald', 'mehndi', 'sage', 'mint'], hara: ['green'], blue: ['neela', 'navy', 'teal'], neela: ['blue'],
  yellow: ['peela', 'haldi', 'turmeric', 'lemon'], peela: ['yellow'], orange: ['kesari', 'saffron', 'peach'],
  purple: ['jamuni', 'lavender', 'lilac', 'violet'], black: ['kala', 'onyx'], white: ['safed', 'ivory', 'pearl'],
  golden: ['gold'], sunehri: ['gold'], silver: ['pearl', 'charcoal'], grey: ['gray'], gray: ['grey'],
  muslim: ['nikah'], islamic: ['nikah'], walima: ['nikah'], christian: ['church', 'rings'], church: ['christian'],
  engagement: ['rings', 'roka', 'sagai'], roka: ['engagement'], sagai: ['engagement'], ring: ['rings'],
  tamil: ['south'], telugu: ['south'], kannada: ['south'], malayalam: ['kerala'], malayali: ['kerala'], kerala: ['kasavu'],
  bengali: ['sindoor', 'red'], punjabi: ['north'], marathi: ['traditional'], gujarati: ['peacock'], rajasthani: ['royal', 'peacock'],
  simple: ['minimal'], minimalist: ['minimal'], elegant: ['minimal', 'luxury'], luxury: ['gold', 'royal'], beach: ['sea', 'goa'],
  wedding: [], shaadi: [], invite: [], invitation: [], card: [], template: [], design: [], theme: [], and: [], with: [],
  vivah: [], marriage: [], biyah: [],
};

const haystacks = new Map<string, string>();
const haystack = (t: TemplateInfo) => {
  let h = haystacks.get(t.id);
  if (!h) { h = ` ${[t.name, ...t.tags].join(' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ')} `; haystacks.set(t.id, h); }
  return h;
};

/** Words in a query; filler words ("wedding", "card"…) are ignored. */
export const queryTokens = (q: string) =>
  q.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(' ').filter((w) => w && !(w in SYNONYMS && SYNONYMS[w].length === 0));

export function matchesFilters(t: TemplateInfo, f: TemplateFilters) {
  return (!f.category || t.category === f.category)
    && (!f.family || colourFamily(t) === f.family)
    && (!f.ornament || t.ornament === f.ornament)
    && (!f.frame || t.frame === f.frame)
    && (!f.nameStyle || t.nameStyle === f.nameStyle)
    && (!f.tone || (f.tone === 'dark') === t.dark);
}

/**
 * Search the whole catalogue. Every word must match the start of some word in
 * the template's name/tags (or one of its synonyms); results are ranked with
 * name matches and featured designs first.
 */
export function searchTemplates(query: string, filters: TemplateFilters = {}): TemplateInfo[] {
  const tokens = queryTokens(query);
  const list = allTemplates().filter((t) => matchesFilters(t, filters));
  if (!tokens.length) return list;

  const phrase = ` ${tokens.join(' ')}`;
  const scored: { t: TemplateInfo; score: number; i: number }[] = [];
  list.forEach((t, i) => {
    const hay = haystack(t);
    const name = ` ${t.name.toLowerCase()} `;
    let score = t.featured ? 3 : 0;
    for (const tok of tokens) {
      const alts = [tok, ...(SYNONYMS[tok] ?? [])];
      if (!alts.some((a) => hay.includes(` ${a}`))) return; // every word must match
      if (name.includes(` ${tok}`)) score += 4;
      else if (hay.includes(` ${tok}`)) score += 2;
      else score += 1; // matched through a synonym
      if (t.bestFor.toLowerCase().includes(tok)) score += 1;
    }
    if (tokens.length > 1 && hay.includes(phrase)) score += 6; // "royal blue" as a phrase
    scored.push({ t, score, i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.t);
}

/* ----------------------------- styling ----------------------------- */

/** CSS variables for one design, applied with style={themeVars(theme)}. */
export function themeVars(theme: Theme): CSSProperties {
  const c = getTemplate(theme).colors;
  return {
    '--color-inv-hero-from': c.heroFrom,
    '--color-inv-hero-via': c.heroVia,
    '--color-inv-hero-to': c.heroTo,
    '--color-inv-hero-text': c.heroText,
    '--color-inv-accent': c.accent,
    '--color-inv-primary': c.primary,
    '--color-inv-heading': c.heading,
    '--color-inv-surface': c.surface,
    '--color-inv-chip': c.chip,
  } as CSSProperties;
}

/** The hero background for a design (also used by the small swatches). */
export const heroGradient = (theme: Theme) => {
  const c = getTemplate(theme).colors;
  return `radial-gradient(120% 80% at 50% 0%, ${c.heroFrom} 0%, ${c.heroVia} 45%, ${c.heroTo} 100%)`;
};
