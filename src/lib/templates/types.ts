export type Ornament =
  | 'mandala' | 'leaves' | 'moon' | 'paisley' | 'lotus' | 'monogram' | 'arch' | 'lamp' | 'sun' | 'marigold'
  | 'rings' | 'kalash' | 'hearts';
export type Frame = 'double' | 'corners' | 'arch' | 'kasavu' | 'single' | 'toran';
/** How the couple's names are lettered: flowing script or engraved serif capitals. */
export type NameStyle = 'script' | 'serif';
export type EventSet = 'north' | 'nikah' | 'south' | 'destination';
export type Category = 'Traditional' | 'Regional' | 'Pastel & modern' | 'Destination';

export type Colors = {
  heroFrom: string; heroVia: string; heroTo: string; // hero gradient
  heroText: string; accent: string;                    // text + ornaments on the hero
  primary: string; heading: string; surface: string;   // buttons, headings, page background
  chip: string;                                        // countdown boxes on the hero
};

export type TemplateInfo = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  bestFor: string;
  ornament: Ornament;
  frame: Frame;
  nameStyle: NameStyle;
  dark: boolean; // dark hero: light text + glow on names
  colors: Colors;
  /** Which ceremonies a new invite with this design starts with. */
  events: EventSet;
  sample: { partner1: string; partner2: string; blessing: string; city: string; venue: string };
  /** Search keywords (English + common Hindi words). */
  tags: string[];
  featured: boolean;
};

/** Shape of the hand-written featured entries (id/tags/etc. are filled in). */
export type FeaturedInfo = Omit<TemplateInfo, 'id' | 'nameStyle' | 'tags' | 'featured'> & { nameStyle?: NameStyle; tags?: string[] };
