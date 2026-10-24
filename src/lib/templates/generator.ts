import { FRAMES, NAME_STYLES, ORNAMENTS, PALETTES, SAMPLE_COUPLES, type Palette } from './parts';
import type { Category, EventSet, Frame, NameStyle, Ornament, TemplateInfo } from './types';

/*
 * Generated templates: every sensible palette × crest × border × lettering
 * combination (a few thousand). Nothing is stored: the id spells out the
 * parts (g-maroon-lotus-toran-serif), so any id can be rebuilt instantly on
 * the server or in the browser, and existing invites never break.
 */

const SUN_PALETTES = new Set(['sunset', 'ocean', 'saffron', 'turmeric', 'terracotta', 'peach', 'sky', 'lemon', 'royalblue', 'magenta']);
const COOL_OK_LAMP = new Set(['navy', 'emerald', 'peacock', 'forest', 'indigo', 'onyx', 'sage', 'mint']);

/** Combination rules that keep every generated design looking intentional. */
export function allowed(p: Palette, o: Ornament, f: Frame): boolean {
  if (f === 'kasavu' && p.dark) return false;                 // kasavu = cream saree bands
  if (o === 'sun' && !SUN_PALETTES.has(p.id)) return false;  // sunsets need sunset colours
  if (o === 'sun' && f === 'kasavu') return false;
  if (o === 'lamp' && !p.warm && !COOL_OK_LAMP.has(p.id)) return false;
  if (f === 'arch' && (o === 'sun' || o === 'hearts')) return false;
  if (o === 'hearts' && (p.id === 'charcoal' || p.id === 'chocolate')) return false;
  return true;
}

export const FAMILY: Record<string, string> = {
  maroon: 'Red', ruby: 'Red', wine: 'Red', terracotta: 'Orange & yellow', chocolate: 'Orange & yellow',
  magenta: 'Pink', plum: 'Purple', saffron: 'Orange & yellow', turmeric: 'Orange & yellow', sunset: 'Pink',
  emerald: 'Green', forest: 'Green', peacock: 'Blue & teal', navy: 'Blue & teal', royalblue: 'Blue & teal',
  ocean: 'Blue & teal', indigo: 'Purple', purple: 'Purple', onyx: 'Black & grey', charcoal: 'Black & grey',
  ivory: 'Ivory & gold', champagne: 'Ivory & gold', pearl: 'White & silver', blush: 'Pink', peach: 'Orange & yellow',
  mint: 'Green', sky: 'Blue & teal', lilac: 'Purple', lemon: 'Orange & yellow', sage: 'Green',
};

function categoryOf(o: Ornament, f: Frame, p: Palette): Category {
  if (o === 'sun') return 'Destination';
  if (o === 'arch' || o === 'lamp' || f === 'kasavu') return 'Regional';
  if (!p.dark || o === 'monogram' || o === 'rings' || o === 'hearts') return 'Pastel & modern';
  return 'Traditional';
}

type ClassicEvents = Extract<EventSet, 'north' | 'nikah' | 'south' | 'destination'>;

function eventsOf(o: Ornament, f: Frame): ClassicEvents {
  if (o === 'arch' || o === 'moon') return 'nikah';
  if (o === 'lamp' || f === 'kasavu') return 'south';
  if (o === 'sun') return 'destination';
  return 'north';
}

const BLESSING: Record<ClassicEvents, string[]> = {
  north: ['॥ शुभ विवाह ॥', '॥ श्री गणेशाय नमः ॥', 'Together with our families'],
  nikah: ['Nikah Mubarak', 'Bismillah', 'With the blessings of Allah'],
  south: ['Shubha Vivaham', 'Subha Muhurtham', 'With the blessings of elders'],
  destination: ['Save the date', 'Join us by the sea', 'Together with our families'],
};
const PLACES: Record<ClassicEvents, [string, string][]> = {
  north: [['Jaipur', 'Rambagh Palace, Jaipur'], ['Delhi', 'The Grand Lawns, New Delhi'], ['Udaipur', 'Lake Palace Gardens, Udaipur'], ['Lucknow', 'Taj Mahal Lucknow'], ['Amritsar', 'Hyatt Regency, Amritsar'], ['Ahmedabad', 'Courtyard Lawns, Ahmedabad']],
  nikah: [['Hyderabad', 'Taj Falaknuma, Hyderabad'], ['Lucknow', 'Awadh Banquets, Lucknow'], ['Bhopal', 'Noor-Us-Sabah Palace, Bhopal'], ['Mumbai', 'Sea Breeze Lawns, Mumbai']],
  south: [['Chennai', 'Sri Kalyana Mandapam, Chennai'], ['Kochi', 'Bolgatty Palace, Kochi'], ['Bengaluru', 'Palace Grounds, Bengaluru'], ['Madurai', 'Meenakshi Mahal, Madurai'], ['Hyderabad', 'N Convention, Hyderabad']],
  destination: [['Goa', 'W Goa, Vagator'], ['Andaman', 'Taj Exotica, Havelock'], ['Kovalam', 'The Leela, Kovalam'], ['Bali', 'Uluwatu Cliff, Bali']],
};
const BEST_FOR: Record<Category, string> = {
  Traditional: 'Traditional weddings, sangeet & reception',
  Regional: 'Regional ceremonies & temple weddings',
  'Pastel & modern': 'Modern weddings, engagements & day functions',
  Destination: 'Beach & destination weddings',
};
const FRAME_WORD: Record<Frame, string> = { double: 'Classic', corners: 'Flourish', arch: 'Jharokha', toran: 'Toran', kasavu: 'Kasavu', single: 'Minimal' };
const EVENT_WORDS: Record<ClassicEvents, string[]> = {
  north: ['hindu', 'north indian', 'punjabi', 'marwari', 'shaadi', 'vivah'],
  nikah: ['nikah', 'muslim', 'walima', 'islamic', 'urdu'],
  south: ['south indian', 'tamil', 'telugu', 'kannada', 'malayali', 'kerala', 'vivaham'],
  destination: ['destination', 'beach', 'resort', 'goa'],
};
const CATEGORY_WORDS: Record<Category, string[]> = {
  Traditional: ['traditional', 'classic', 'royal', 'shaadi'],
  Regional: ['regional'],
  'Pastel & modern': ['modern', 'contemporary'],
  Destination: ['destination', 'beach'],
};

/** Tiny stable hash (FNV-1a) used to vary samples and ordering. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));
const PAL = byId(PALETTES);
const ORN = byId(ORNAMENTS);
const FRM = byId(FRAMES);
const STY = byId(NAME_STYLES);

export const generatedId = (p: string, o: string, f: string, s: string) => `g-${p}-${o}-${f}-${s}`;

/** Rebuild a generated template from its id, or null if it isn't a valid one. */
export function buildGenerated(id: string): TemplateInfo | null {
  const m = /^g-([a-z]+)-([a-z]+)-([a-z]+)-([a-z]+)$/.exec(id);
  if (!m) return null;
  const p = PAL.get(m[1]), o = ORN.get(m[2] as Ornament), f = FRM.get(m[3] as Frame), s = STY.get(m[4] as NameStyle);
  if (!p || !o || !f || !s || !allowed(p, o.id, f.id)) return null;

  const h = hash(id);
  const category = categoryOf(o.id, f.id, p);
  const events = eventsOf(o.id, f.id);
  const [partner1, partner2] = SAMPLE_COUPLES[h % SAMPLE_COUPLES.length];
  const [city, venue] = PLACES[events][(h >>> 8) % PLACES[events].length];
  const blessing = BLESSING[events][(h >>> 16) % BLESSING[events].length];
  const name = `${p.name} ${o.name} ${FRAME_WORD[f.id]}${s.id === 'serif' ? ' Engraved' : ''}`;

  return {
    id, name, category, events, featured: false, layout: 'classic', lang: /[\u0900-\u097F]/.test(blessing) ? 'hi' : 'en',
    ornament: o.id, frame: f.id, nameStyle: s.id, dark: p.dark, colors: p.colors,
    tagline: `${p.mood[0].toUpperCase()}${p.mood.slice(1)} ${p.name.toLowerCase()} · ${f.name.toLowerCase()}`,
    description: `${/^[aeiou]/.test(p.mood) ? 'An' : 'A'} ${p.mood} ${p.name.toLowerCase()} design with a ${o.name.toLowerCase()} crest, ${f.name.toLowerCase()} and ${s.id === 'serif' ? 'engraved serif' : 'flowing script'} names. ${BEST_FOR[category]}.`,
    bestFor: BEST_FOR[category],
    sample: { partner1, partner2, blessing, city, venue },
    tags: [
      ...p.words, p.name.toLowerCase(), FAMILY[p.id]?.toLowerCase() ?? '', p.dark ? 'dark' : 'light pastel soft',
      ...o.words, o.name.toLowerCase(), ...f.words, ...s.words,
      ...EVENT_WORDS[events], ...CATEGORY_WORDS[category], city.toLowerCase(),
    ].filter(Boolean),
  };
}

/** Every valid generated id, in a deterministic but well-mixed order. */
export function generatedIds(): string[] {
  const ids: string[] = [];
  for (const p of PALETTES) for (const o of ORNAMENTS) for (const f of FRAMES) {
    if (!allowed(p, o.id, f.id)) continue;
    for (const s of NAME_STYLES) ids.push(generatedId(p.id, o.id, f.id, s.id));
  }
  return ids.sort((a, b) => hash(a) - hash(b));
}
