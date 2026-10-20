import type { CSSProperties } from 'react';

/*
 * Every invitation design lives here. A design = colours + crest artwork +
 * border style. Adding a template is one entry (and its id in TEMPLATE_IDS).
 * Colours become CSS variables (see themeVars), which Tailwind utilities like
 * `text-inv-accent` read, so the same markup renders every design.
 */

export const TEMPLATE_IDS = [
  'royal', 'marigold', 'garden', 'midnight', 'blush', 'ivory',
  'peacock', 'lotus', 'sindoor', 'kasavu', 'mughal', 'sunset',
] as const;
export type Theme = (typeof TEMPLATE_IDS)[number];

export type Ornament = 'mandala' | 'leaves' | 'moon' | 'paisley' | 'lotus' | 'monogram' | 'arch' | 'lamp' | 'sun' | 'marigold';
export type Frame = 'double' | 'corners' | 'arch' | 'kasavu' | 'single';
export type EventSet = 'north' | 'nikah' | 'south' | 'destination';
export type Category = 'Traditional' | 'Pastel & modern' | 'Regional' | 'Destination';

type Colors = {
  heroFrom: string; heroVia: string; heroTo: string; // hero gradient
  heroText: string; accent: string;                    // text + ornaments on the hero
  primary: string; heading: string; surface: string;   // buttons, headings, page background
  chip: string;                                        // countdown boxes on the hero
};

export type TemplateInfo = {
  name: string;
  tagline: string;
  description: string;
  category: Category;
  bestFor: string;
  ornament: Ornament;
  frame: Frame;
  dark: boolean; // dark hero: light text + glow on names
  colors: Colors;
  /** Which ceremonies a new invite with this design starts with. */
  events: EventSet;
  sample: { partner1: string; partner2: string; blessing: string; city: string; venue: string };
};

export const TEMPLATES: Record<Theme, TemplateInfo> = {
  royal: {
    name: 'Royal Maroon', tagline: 'Classic, regal, timeless', category: 'Traditional', bestFor: 'Traditional weddings, palace venues',
    description: 'Deep maroon and antique gold with a mandala crest: the classic Indian wedding look, perfect for traditional ceremonies and palace venues.',
    ornament: 'mandala', frame: 'double', dark: true, events: 'north',
    colors: { heroFrom: '#8a1726', heroVia: '#6b0f1a', heroTo: '#3d0710', heroText: '#fbf5ea', accent: '#e8cf8a', primary: '#6b0f1a', heading: '#3d0710', surface: '#fbf5ea', chip: 'rgba(0,0,0,.18)' },
    sample: { partner1: 'Aarav', partner2: 'Meera', blessing: '॥ शुभ विवाह ॥', city: 'Jaipur', venue: 'The Leela Palace, Jaipur' },
  },
  marigold: {
    name: 'Marigold Haldi', tagline: 'Sunny, festive, joyful', category: 'Traditional', bestFor: 'Haldi, daytime & outdoor functions',
    description: 'Warm marigold yellows and saffron with a genda-phool crest, inspired by haldi mornings and flower garlands. Great for daytime and outdoor celebrations.',
    ornament: 'marigold', frame: 'corners', dark: true, events: 'north',
    colors: { heroFrom: '#f7b733', heroVia: '#e8871e', heroTo: '#b8460b', heroText: '#fffaf0', accent: '#fff1c1', primary: '#b8460b', heading: '#7a2e06', surface: '#fff8ec', chip: 'rgba(0,0,0,.14)' },
    sample: { partner1: 'Rohan', partner2: 'Isha', blessing: '॥ शुभ विवाह ॥', city: 'Udaipur', venue: 'Lake Pichola Gardens, Udaipur' },
  },
  garden: {
    name: 'Mehndi Garden', tagline: 'Fresh, green, botanical', category: 'Pastel & modern', bestFor: 'Garden weddings, mehndi, day functions',
    description: 'Soft sage and leaf greens with ivory and a botanical wreath: a fresh, modern palette for garden weddings, mehndi functions and destination ceremonies.',
    ornament: 'leaves', frame: 'corners', dark: true, events: 'north',
    colors: { heroFrom: '#9cc5a1', heroVia: '#5f8f6b', heroTo: '#2f5940', heroText: '#f6fbf4', accent: '#fbe7c6', primary: '#2f5940', heading: '#1f3d2b', surface: '#f5f8f1', chip: 'rgba(0,0,0,.15)' },
    sample: { partner1: 'Kabir', partner2: 'Naina', blessing: '॥ शुभ विवाह ॥', city: 'Bengaluru', venue: 'The Tamarind Tree, Bengaluru' },
  },
  midnight: {
    name: 'Midnight Sangeet', tagline: 'Elegant, evening, luxe', category: 'Pastel & modern', bestFor: 'Sangeet nights, evening receptions',
    description: 'Midnight navy and champagne gold with a crescent moon and stars. Understated and elegant, made for sangeet nights and evening receptions.',
    ornament: 'moon', frame: 'double', dark: true, events: 'north',
    colors: { heroFrom: '#1e2a5a', heroVia: '#141c3f', heroTo: '#0a0f24', heroText: '#f3efe6', accent: '#d9c08a', primary: '#1e2a5a', heading: '#141c3f', surface: '#f6f4ef', chip: 'rgba(255,255,255,.06)' },
    sample: { partner1: 'Dev', partner2: 'Tara', blessing: '॥ शुभ विवाह ॥', city: 'Mumbai', venue: 'Taj Lands End, Mumbai' },
  },
  blush: {
    name: 'Blush Rose', tagline: 'Soft, romantic, pastel', category: 'Pastel & modern', bestFor: 'Modern couples, intimate weddings',
    description: 'Blush pink and rose gold on a light background with delicate florals. Soft and romantic, popular with modern couples and intimate weddings.',
    ornament: 'leaves', frame: 'single', dark: false, events: 'north',
    colors: { heroFrom: '#fff6f4', heroVia: '#fbe3e3', heroTo: '#f3c9cf', heroText: '#6e2b3d', accent: '#b76e79', primary: '#a0485c', heading: '#6e2b3d', surface: '#fffaf9', chip: 'rgba(255,255,255,.55)' },
    sample: { partner1: 'Aditya', partner2: 'Sana', blessing: '॥ शुभ विवाह ॥', city: 'Pune', venue: 'JW Marriott, Pune' },
  },
  ivory: {
    name: 'Ivory Minimal', tagline: 'Clean, modern, monogram', category: 'Pastel & modern', bestFor: 'Minimal & court-marriage celebrations',
    description: 'Ivory, charcoal and a touch of bronze with your initials as a monogram. Clean and modern, with lots of breathing space and no clutter.',
    ornament: 'monogram', frame: 'single', dark: false, events: 'north',
    colors: { heroFrom: '#fdfbf7', heroVia: '#f6f1e8', heroTo: '#ece3d3', heroText: '#2d2a26', accent: '#9a7b4f', primary: '#2d2a26', heading: '#2d2a26', surface: '#fdfbf7', chip: 'rgba(255,255,255,.6)' },
    sample: { partner1: 'Neil', partner2: 'Ritika', blessing: 'Together with our families', city: 'Delhi', venue: 'The Lodhi, New Delhi' },
  },
  peacock: {
    name: 'Peacock Royale', tagline: 'Rich teal, feather motif', category: 'Traditional', bestFor: 'Grand weddings, Rajasthani & Gujarati themes',
    description: 'Deep peacock teal with gold and a mor-pankh feather crest. Rich and festive, perfect for grand weddings with a royal Rajasthani or Gujarati theme.',
    ornament: 'paisley', frame: 'double', dark: true, events: 'north',
    colors: { heroFrom: '#11727a', heroVia: '#0b4f57', heroTo: '#052e36', heroText: '#f2fbf8', accent: '#e2c275', primary: '#0b4f57', heading: '#073a40', surface: '#f4faf8', chip: 'rgba(0,0,0,.18)' },
    sample: { partner1: 'Yash', partner2: 'Khushi', blessing: '॥ शुभ विवाह ॥', city: 'Ahmedabad', venue: 'Courtyard Lawns, Ahmedabad' },
  },
  lotus: {
    name: 'Lavender Lotus', tagline: 'Serene, spiritual, graceful', category: 'Pastel & modern', bestFor: 'Temple weddings, serene ceremonies',
    description: 'Royal purple and lavender with a golden lotus crest. Serene and graceful, a beautiful fit for temple weddings and calm morning ceremonies.',
    ornament: 'lotus', frame: 'corners', dark: true, events: 'north',
    colors: { heroFrom: '#7b5ea7', heroVia: '#553c85', heroTo: '#2e1f4f', heroText: '#f7f2ff', accent: '#f3d9a4', primary: '#553c85', heading: '#3a2766', surface: '#f8f5fc', chip: 'rgba(0,0,0,.16)' },
    sample: { partner1: 'Varun', partner2: 'Ananya', blessing: '॥ शुभ विवाह ॥', city: 'Varanasi', venue: 'BrijRama Palace, Varanasi' },
  },
  sindoor: {
    name: 'Sindoor Red', tagline: 'Bold red, jharokha arch', category: 'Regional', bestFor: 'Bengali, Rajasthani & North Indian weddings',
    description: 'Vibrant sindoor red with marigold gold under a jharokha arch. Bold and auspicious, loved for Bengali, Rajasthani and North Indian weddings.',
    ornament: 'mandala', frame: 'arch', dark: true, events: 'north',
    colors: { heroFrom: '#d62828', heroVia: '#a4161a', heroTo: '#660708', heroText: '#fff8ee', accent: '#ffd166', primary: '#a4161a', heading: '#660708', surface: '#fff8f3', chip: 'rgba(0,0,0,.2)' },
    sample: { partner1: 'Sourav', partner2: 'Priyanka', blessing: '॥ शुभ विवाह ॥', city: 'Kolkata', venue: 'ITC Royal Bengal, Kolkata' },
  },
  kasavu: {
    name: 'Kasavu Gold', tagline: 'Ivory & gold, South Indian', category: 'Regional', bestFor: 'Kerala, Tamil & South Indian weddings',
    description: 'Inspired by the kasavu saree: ivory with a gold border and a traditional lamp crest. Elegant and auspicious for Kerala, Tamil and South Indian weddings.',
    ornament: 'lamp', frame: 'kasavu', dark: false, events: 'south',
    colors: { heroFrom: '#fffdf6', heroVia: '#fbf3dc', heroTo: '#f3e3b5', heroText: '#3b2f1e', accent: '#b8892b', primary: '#8c6414', heading: '#4a3510', surface: '#fffcf3', chip: 'rgba(255,255,255,.6)' },
    sample: { partner1: 'Arjun', partner2: 'Lakshmi', blessing: 'Shubha Vivaham', city: 'Kochi', venue: 'Bolgatty Palace, Kochi' },
  },
  mughal: {
    name: 'Mughal Emerald', tagline: 'Emerald, gold, Mughal arch', category: 'Regional', bestFor: 'Nikah, walima & Mughal-inspired weddings',
    description: 'Deep emerald and gold framed by a Mughal arch. Regal and graceful, designed for nikah, walima and Mughal-inspired celebrations.',
    ornament: 'arch', frame: 'arch', dark: true, events: 'nikah',
    colors: { heroFrom: '#0f7a4d', heroVia: '#0b5d3b', heroTo: '#03301e', heroText: '#f4fbf6', accent: '#e9c46a', primary: '#0b5d3b', heading: '#063d27', surface: '#f5faf6', chip: 'rgba(0,0,0,.2)' },
    sample: { partner1: 'Arman', partner2: 'Zoya', blessing: 'Nikah Mubarak', city: 'Hyderabad', venue: 'Taj Falaknuma Palace, Hyderabad' },
  },
  sunset: {
    name: 'Goa Sunset', tagline: 'Beach, sunset, destination', category: 'Destination', bestFor: 'Beach & destination weddings',
    description: 'A coral-to-violet sunset over the sea. Warm and carefree, made for beach weddings and destination celebrations in Goa, Kerala or abroad.',
    ornament: 'sun', frame: 'single', dark: true, events: 'destination',
    colors: { heroFrom: '#ffb36b', heroVia: '#e0607e', heroTo: '#4b2a73', heroText: '#fff8f0', accent: '#fff3d6', primary: '#b8466a', heading: '#4b2a73', surface: '#fff8f5', chip: 'rgba(255,255,255,.14)' },
    sample: { partner1: 'Rahul', partner2: 'Tanya', blessing: 'Save the date', city: 'Goa', venue: 'W Goa, Vagator' },
  },
};

export const CATEGORIES: Category[] = ['Traditional', 'Regional', 'Pastel & modern', 'Destination'];

export const isTheme = (t: string): t is Theme => (TEMPLATE_IDS as readonly string[]).includes(t);

/** CSS variables for one design, applied with style={themeVars(theme)}. */
export function themeVars(theme: Theme): CSSProperties {
  const c = TEMPLATES[theme].colors;
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
  const c = TEMPLATES[theme].colors;
  return `radial-gradient(120% 80% at 50% 0%, ${c.heroFrom} 0%, ${c.heroVia} 45%, ${c.heroTo} 100%)`;
};
