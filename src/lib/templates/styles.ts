import { CULTURES, getCulture, getLanguage, type Culture } from './languages';
import { hash } from './generator';
import type { Category, Colors, Layout, NameStyle, Ornament, Frame, TemplateInfo } from './types';

/*
 * Styled designs: eight complete layouts, each drawn its own way (a palace
 * scene, a watercolour garden, a magazine cover, an Art Deco programme, a
 * film poster, a sealed envelope, a temple kolam, a Mughal jaali), offered in
 * every language/tradition that suits it and a few hand-picked colourways.
 *
 * Ids spell out the parts, like generated ones: s-<look>-<tradition>-<colours>
 * (e.g. s-kovil-tamil-leaf), so nothing is stored and ids never go stale.
 */

type StyleLayout = Exclude<Layout, 'classic'>;

export type StylePalette = {
  id: string;
  name: string;
  family: string;
  dark: boolean;
  words: string[];
  colors: Required<Colors>;
};

export type StyleInfo = {
  id: StyleLayout;
  name: string;
  /** One line for cards and the filter. */
  tagline: string;
  description: string;
  category: Category;
  nameStyle: NameStyle;
  bestFor: string;
  words: string[];
  /** Traditions offered in this look ('*' = all). */
  cultures: string[] | '*';
  palettes: StylePalette[];
};

/*
 * Colour roles: heroFrom/Via/To = hero background, heroText = hero text,
 * accent = names & ornaments, primary = buttons, heading = section headings,
 * surface = page background, chip = countdown boxes, alt = second accent,
 * deep = darkest detail.
 */
const pal = (id: string, name: string, family: string, dark: boolean, words: string[], c: Required<Colors>): StylePalette => ({ id, name, family, dark, words, colors: c });

export const STYLES: StyleInfo[] = [
  {
    id: 'rajwada', name: 'Rajwada', tagline: 'A palace at night, with fireworks',
    description: 'An illustrated palace under a dusk sky, with lit jharokhas, elephants at the gate and fireworks overhead. Names in carved capitals; functions written on parchment scrolls.',
    category: 'Traditional', nameStyle: 'serif', bestFor: 'Royal, palace and destination weddings',
    words: ['palace', 'rajwada', 'royal', 'night', 'fireworks', 'elephant', 'illustrated', 'scroll', 'mahal'],
    cultures: '*',
    palettes: [
      pal('indigo', 'Indigo Night', 'Purple', true, ['indigo', 'purple', 'night', 'blue'], { heroFrom: '#120f33', heroVia: '#2a1d5c', heroTo: '#6a2f6e', heroText: '#f7ecd2', accent: '#f3c969', primary: '#7a2416', heading: '#6b1d12', surface: '#f6ead0', chip: 'rgba(255,255,255,.08)', alt: '#b07a3a', deep: '#1c0f2e' }),
      pal('maroon', 'Maroon Dusk', 'Red', true, ['maroon', 'red', 'lal', 'dusk'], { heroFrom: '#22060f', heroVia: '#5a1424', heroTo: '#b24a2e', heroText: '#fbeedd', accent: '#f2c66d', primary: '#7a1c22', heading: '#5a1424', surface: '#f8ebd4', chip: 'rgba(255,255,255,.08)', alt: '#a8692f', deep: '#1e060c' }),
      pal('emerald', 'Emerald Night', 'Green', true, ['emerald', 'green', 'hara'], { heroFrom: '#03150f', heroVia: '#0b3b30', heroTo: '#2f6a52', heroText: '#eef6ec', accent: '#e9c46a', primary: '#0b4a3a', heading: '#0b3b30', surface: '#f3ecd6', chip: 'rgba(255,255,255,.08)', alt: '#a8792f', deep: '#03140f' }),
      pal('midnight', 'Midnight Blue', 'Blue & teal', true, ['navy', 'blue', 'neela', 'midnight'], { heroFrom: '#050818', heroVia: '#14214d', heroTo: '#3d5596', heroText: '#eef0f8', accent: '#f0d79a', primary: '#1f3a85', heading: '#14214d', surface: '#f4eedd', chip: 'rgba(255,255,255,.08)', alt: '#a8803f', deep: '#060a1c' }),
      pal('rose', 'Rose Dusk', 'Pink', true, ['pink', 'rose', 'sunset', 'gulabi'], { heroFrom: '#2e1540', heroVia: '#a2406a', heroTo: '#f28a5c', heroText: '#fff3e6', accent: '#ffe3a3', primary: '#a2306a', heading: '#6e1f4a', surface: '#fbeee2', chip: 'rgba(255,255,255,.1)', alt: '#b47a46', deep: '#2a1030' }),
    ],
  },
  {
    id: 'bagh', name: 'Bagh', tagline: 'Watercolour garden, hand-lettered',
    description: 'Soft, hand-painted watercolour flowers on textured paper. Your names are written large in flowing script, like a letter; functions are pinned up like little cards with washi tape.',
    category: 'Pastel & modern', nameStyle: 'script', bestFor: 'Day weddings, garden venues and mehndi',
    words: ['watercolour', 'watercolor', 'garden', 'floral', 'flowers', 'bagh', 'painted', 'pastel', 'botanical', 'soft'],
    cultures: '*',
    palettes: [
      pal('blush', 'Blush', 'Pink', false, ['pink', 'blush', 'gulabi', 'rose'], { heroFrom: '#f6d4c8', heroVia: '#dfe8d6', heroTo: '#f3d9cf', heroText: '#4a3a3f', accent: '#7c3a4d', primary: '#7c3a4d', heading: '#7c3a4d', surface: '#fbf8f3', chip: 'rgba(255,255,255,.7)', alt: '#e39aa6', deep: '#93ae90' }),
      pal('sage', 'Sage', 'Green', false, ['sage', 'green', 'hara', 'mint'], { heroFrom: '#dfe8d6', heroVia: '#eaf0e1', heroTo: '#f3e6d2', heroText: '#33402f', accent: '#3f5a3c', primary: '#3f5a3c', heading: '#3f5a3c', surface: '#f8f9f3', chip: 'rgba(255,255,255,.7)', alt: '#f0b991', deep: '#7fa27a' }),
      pal('lilac', 'Lilac', 'Purple', false, ['lilac', 'lavender', 'purple', 'jamuni'], { heroFrom: '#e7dcf3', heroVia: '#dfe8d6', heroTo: '#f3e3ee', heroText: '#3d3148', accent: '#5a3f7a', primary: '#5a3f7a', heading: '#5a3f7a', surface: '#fbf9fc', chip: 'rgba(255,255,255,.7)', alt: '#b59ddb', deep: '#93ae90' }),
      pal('marigold', 'Marigold', 'Orange & yellow', false, ['yellow', 'marigold', 'genda', 'haldi', 'peela', 'orange'], { heroFrom: '#fbe3b0', heroVia: '#e3ead2', heroTo: '#fde8cf', heroText: '#4a3418', accent: '#9a4a12', primary: '#9a4a12', heading: '#9a4a12', surface: '#fffaf1', chip: 'rgba(255,255,255,.7)', alt: '#f2a43a', deep: '#8fae6a' }),
      pal('sky', 'Powder Blue', 'Blue & teal', false, ['blue', 'sky', 'neela', 'powder blue'], { heroFrom: '#d8e6f3', heroVia: '#e3ece0', heroTo: '#f1e3e8', heroText: '#2c3a4a', accent: '#2f4f73', primary: '#2f4f73', heading: '#2f4f73', surface: '#f8fafc', chip: 'rgba(255,255,255,.7)', alt: '#93b4dc', deep: '#93ae90' }),
    ],
  },
  {
    id: 'patrika', name: 'Patrika', tagline: 'Modern editorial, magazine-cover type',
    description: 'Pure typography, like a fashion magazine cover: towering high-contrast serif names, the city set vertically and a huge date as the hero. Functions read as an elegant agenda with big times.',
    category: 'Pastel & modern', nameStyle: 'serif', bestFor: 'Modern couples who want “not traditional”',
    words: ['modern', 'editorial', 'magazine', 'typography', 'minimal', 'patrika', 'clean', 'bodoni', 'vogue', 'contemporary'],
    cultures: '*',
    palettes: [
      pal('oxblood', 'Oxblood', 'Red', false, ['red', 'oxblood', 'maroon', 'white'], { heroFrom: '#ffffff', heroVia: '#ffffff', heroTo: '#ffffff', heroText: '#1d1a18', accent: '#5e1224', primary: '#5e1224', heading: '#1d1a18', surface: '#ffffff', chip: '#f4efe9', alt: '#8a7f78', deep: '#1d1a18' }),
      pal('ink', 'Ink & Emerald', 'Green', false, ['green', 'emerald', 'white'], { heroFrom: '#fbfaf6', heroVia: '#fbfaf6', heroTo: '#fbfaf6', heroText: '#14201b', accent: '#0f5b4a', primary: '#0f5b4a', heading: '#14201b', surface: '#fbfaf6', chip: '#eef1ea', alt: '#7a837d', deep: '#14201b' }),
      pal('cobalt', 'Cobalt', 'Blue & teal', false, ['blue', 'cobalt', 'navy', 'white'], { heroFrom: '#f7f8fb', heroVia: '#f7f8fb', heroTo: '#f7f8fb', heroText: '#111a2e', accent: '#1f3a85', primary: '#1f3a85', heading: '#111a2e', surface: '#f7f8fb', chip: '#e9edf6', alt: '#7a8193', deep: '#111a2e' }),
      pal('saffron', 'Saffron', 'Orange & yellow', false, ['orange', 'saffron', 'kesari'], { heroFrom: '#fffaf2', heroVia: '#fffaf2', heroTo: '#fffaf2', heroText: '#2a1a10', accent: '#c4520f', primary: '#b2480c', heading: '#2a1a10', surface: '#fffaf2', chip: '#f7ebda', alt: '#8f7f70', deep: '#2a1a10' }),
      pal('blush', 'Rose Print', 'Pink', false, ['pink', 'blush', 'rose'], { heroFrom: '#fbeeee', heroVia: '#fbeeee', heroTo: '#fbeeee', heroText: '#1d1a18', accent: '#b0304a', primary: '#a32a43', heading: '#1d1a18', surface: '#fdf6f6', chip: '#f6e1e3', alt: '#8f7c7f', deep: '#1d1a18' }),
      pal('noir', 'Noir & Gold', 'Black & grey', true, ['black', 'gold', 'kala', 'luxury', 'noir'], { heroFrom: '#141414', heroVia: '#141414', heroTo: '#141414', heroText: '#f5efe6', accent: '#d4af37', primary: '#8a6d1a', heading: '#141414', surface: '#faf8f4', chip: 'rgba(255,255,255,.06)', alt: '#a69f94', deep: '#000000' }),
    ],
  },
  {
    id: 'mehfil', name: 'Mehfil', tagline: 'Art Deco evening, ticket passes',
    description: 'Great Gatsby meets Bombay Deco: a radiating sunburst, a stepped gold frame and theatrical lettering. Each function is an “entry pass” ticket. Made for sangeet nights, cocktails and receptions.',
    category: 'Traditional', nameStyle: 'serif', bestFor: 'Sangeet, cocktail and reception nights',
    words: ['art deco', 'deco', 'gatsby', 'mehfil', 'sangeet', 'cocktail', 'reception', 'ticket', 'glamour', 'luxury', 'sunburst'],
    cultures: '*',
    palettes: [
      pal('emerald', 'Emerald & Gold', 'Green', true, ['green', 'emerald', 'gold'], { heroFrom: '#0f2a25', heroVia: '#0f2a25', heroTo: '#0a1f1b', heroText: '#f3e2b3', accent: '#c9a44c', primary: '#0f2a25', heading: '#0f2a25', surface: '#f6f0e1', chip: 'rgba(201,164,76,.12)', alt: '#f3e2b3', deep: '#061512' }),
      pal('onyx', 'Black & Gold', 'Black & grey', true, ['black', 'gold', 'kala', 'onyx', 'luxury'], { heroFrom: '#121212', heroVia: '#121212', heroTo: '#050505', heroText: '#f2e3bd', accent: '#d4af37', primary: '#1c1c1c', heading: '#121212', surface: '#f7f3ea', chip: 'rgba(212,175,55,.12)', alt: '#f2e3bd', deep: '#000000' }),
      pal('navy', 'Navy & Gold', 'Blue & teal', true, ['navy', 'blue', 'gold'], { heroFrom: '#0c1a33', heroVia: '#0c1a33', heroTo: '#081225', heroText: '#efe0bb', accent: '#d6b46a', primary: '#0c1a33', heading: '#0c1a33', surface: '#f4f1e8', chip: 'rgba(214,180,106,.12)', alt: '#efe0bb', deep: '#040a17' }),
      pal('wine', 'Wine & Rose Gold', 'Red', true, ['wine', 'burgundy', 'rose gold', 'red'], { heroFrom: '#2a0a16', heroVia: '#2a0a16', heroTo: '#1c060e', heroText: '#f6dcc8', accent: '#e3b48f', primary: '#4a1226', heading: '#2a0a16', surface: '#faf2ee', chip: 'rgba(227,180,143,.12)', alt: '#f6dcc8', deep: '#12030a' }),
      pal('teal', 'Teal & Champagne', 'Blue & teal', true, ['teal', 'peacock', 'champagne'], { heroFrom: '#062f33', heroVia: '#062f33', heroTo: '#042125', heroText: '#efe2c4', accent: '#e7d3a1', primary: '#06474d', heading: '#062f33', surface: '#f2f5f2', chip: 'rgba(231,211,161,.12)', alt: '#efe2c4', deep: '#021316' }),
      pal('plum', 'Plum & Gold', 'Purple', true, ['plum', 'purple', 'gold', 'jamuni'], { heroFrom: '#24102e', heroVia: '#24102e', heroTo: '#170a1e', heroText: '#f3e0bd', accent: '#d9b25c', primary: '#3a1a4a', heading: '#24102e', surface: '#f7f2f6', chip: 'rgba(217,178,92,.12)', alt: '#f3e0bd', deep: '#0e0512' }),
    ],
  },
  {
    id: 'filmy', name: 'Filmy', tagline: 'Bollywood poster: our love story, now showing',
    description: 'A Bollywood film poster: sun-rays, marquee lights, a cheerful illustrated couple and chunky outlined lettering. Functions play out as frames on a film strip. Made for fun-loving couples, sangeet and haldi.',
    category: 'Pastel & modern', nameStyle: 'serif', bestFor: 'Fun weddings, sangeet and haldi',
    words: ['bollywood', 'filmy', 'film', 'movie', 'poster', 'fun', 'cartoon', 'caricature', 'illustrated', 'couple', 'quirky', 'colourful', 'colorful'],
    cultures: ['hindu', 'rajasthani', 'punjabi', 'gujarati', 'marathi', 'bengali', 'assamese', 'odia', 'tamil', 'telugu', 'kannada', 'malayali', 'southern', 'muslim', 'nikah', 'jain', 'modern'],
    palettes: [
      pal('pink', 'Hot Pink', 'Pink', true, ['pink', 'rani', 'fuchsia', 'turquoise'], { heroFrom: '#e2267b', heroVia: '#f04a92', heroTo: '#e2267b', heroText: '#ffffff', accent: '#ffe066', primary: '#c41c69', heading: '#7a0e3c', surface: '#fff4f8', chip: 'rgba(122,14,60,.35)', alt: '#13b5b1', deep: '#7a0e3c' }),
      pal('tangerine', 'Tangerine', 'Orange & yellow', true, ['orange', 'kesari', 'purple'], { heroFrom: '#f26b1d', heroVia: '#ff8a3d', heroTo: '#f26b1d', heroText: '#ffffff', accent: '#fff06a', primary: '#c24f0d', heading: '#5a2a8a', surface: '#fff7f0', chip: 'rgba(90,30,5,.3)', alt: '#6a3fb5', deep: '#7a2a05' }),
      pal('ruby', 'Ruby', 'Red', true, ['red', 'lal', 'yellow'], { heroFrom: '#d7263d', heroVia: '#ef3e55', heroTo: '#d7263d', heroText: '#ffffff', accent: '#fff3b0', primary: '#b51d32', heading: '#6b0d18', surface: '#fff6f6', chip: 'rgba(107,13,24,.35)', alt: '#f5b700', deep: '#6b0d18' }),
      pal('teal', 'Turquoise', 'Blue & teal', true, ['teal', 'turquoise', 'blue', 'pink'], { heroFrom: '#0e9c9c', heroVia: '#22bdbd', heroTo: '#0e9c9c', heroText: '#ffffff', accent: '#ffe066', primary: '#0b7d7d', heading: '#075c5c', surface: '#f2fbfb', chip: 'rgba(7,92,92,.35)', alt: '#e2267b', deep: '#075c5c' }),
      pal('violet', 'Violet', 'Purple', true, ['purple', 'violet', 'green', 'jamuni'], { heroFrom: '#7b2cbf', heroVia: '#9d4edd', heroTo: '#7b2cbf', heroText: '#ffffff', accent: '#ffe066', primary: '#6a1fae', heading: '#3c096c', surface: '#f8f3fd', chip: 'rgba(60,9,108,.35)', alt: '#2ec27e', deep: '#3c096c' }),
    ],
  },
  {
    id: 'lifafa', name: 'Lifafa', tagline: 'A sealed envelope each guest opens',
    description: 'The invite opens like a real one: a velvet envelope closed with a wax seal of your initials. Guests tap to break the seal and a letterpress card slides out. Send personal links and the envelope is addressed to each family.',
    category: 'Traditional', nameStyle: 'script', bestFor: 'Every wedding; the most personal way to invite',
    words: ['envelope', 'lifafa', 'wax seal', 'seal', 'letterpress', 'card', 'personal', 'classic', 'elegant', 'opening', 'animated'],
    cultures: '*',
    palettes: [
      pal('maroon', 'Maroon Velvet', 'Red', false, ['maroon', 'red', 'lal', 'velvet', 'gold'], { heroFrom: '#efe3dc', heroVia: '#e6d3c9', heroTo: '#d9c4b8', heroText: '#4a1621', accent: '#5b1a28', primary: '#5b1a28', heading: '#5b1a28', surface: '#f6eee9', chip: 'rgba(91,26,40,.06)', alt: '#c9a04c', deep: '#7a1e33' }),
      pal('emerald', 'Emerald Velvet', 'Green', false, ['green', 'emerald', 'gold'], { heroFrom: '#e6eee8', heroVia: '#d9e4dc', heroTo: '#c9d8cd', heroText: '#12352a', accent: '#145a45', primary: '#145a45', heading: '#145a45', surface: '#f1f5f1', chip: 'rgba(20,90,69,.06)', alt: '#d4b062', deep: '#145a45' }),
      pal('navy', 'Navy Velvet', 'Blue & teal', false, ['navy', 'blue', 'neela', 'gold'], { heroFrom: '#e5e9f1', heroVia: '#d6dde9', heroTo: '#c8d0de', heroText: '#17244a', accent: '#1f3466', primary: '#1f3466', heading: '#1f3466', surface: '#f1f3f8', chip: 'rgba(31,52,102,.06)', alt: '#d8b866', deep: '#1f3466' }),
      pal('blush', 'Blush & Pearl', 'Pink', false, ['pink', 'blush', 'pastel', 'gulabi'], { heroFrom: '#f8ecea', heroVia: '#f1dedb', heroTo: '#ecd2cf', heroText: '#5a2a33', accent: '#9a4456', primary: '#9a4456', heading: '#9a4456', surface: '#fcf5f4', chip: 'rgba(154,68,86,.06)', alt: '#caa25a', deep: '#cf7d8a' }),
      pal('saffron', 'Saffron & Red Wax', 'Orange & yellow', false, ['orange', 'saffron', 'kesari', 'red'], { heroFrom: '#f8ecda', heroVia: '#f2dfc2', heroTo: '#ecd3b0', heroText: '#4a2410', accent: '#8a3a10', primary: '#a8460f', heading: '#8a3a10', surface: '#fcf5ea', chip: 'rgba(138,58,16,.06)', alt: '#a3172b', deep: '#d2691e' }),
      pal('kraft', 'Kraft & Red Wax', 'Ivory & gold', false, ['kraft', 'brown', 'rustic', 'ivory', 'beige'], { heroFrom: '#f1ece2', heroVia: '#e7dece', heroTo: '#ddd2bf', heroText: '#3e3122', accent: '#5a4128', primary: '#7a5634', heading: '#5a4128', surface: '#f8f5ef', chip: 'rgba(90,65,40,.06)', alt: '#a3172b', deep: '#b39570' }),
    ],
  },
  {
    id: 'kovil', name: 'Kovil', tagline: 'Temple gopuram, kolam and kasavu',
    description: 'A golden temple gopuram and brass lamps inside a white rice-flour kolam border, with a kasavu saree band at the foot. Functions are a timeline of temple bells, the muhurtham highlighted.',
    category: 'Regional', nameStyle: 'serif', bestFor: 'Tamil, Telugu, Kannada and Kerala temple weddings',
    words: ['temple', 'kovil', 'gopuram', 'kolam', 'rangoli', 'kasavu', 'south indian', 'lamp', 'deepam', 'banana leaf', 'muhurtham', 'traditional'],
    cultures: ['tamil', 'telugu', 'kannada', 'malayali', 'southern'],
    palettes: [
      pal('leaf', 'Banana Leaf', 'Green', true, ['green', 'banana leaf', 'hara'], { heroFrom: '#24572f', heroVia: '#1f4d2b', heroTo: '#173d21', heroText: '#fbf3df', accent: '#f2c14e', primary: '#1f4d2b', heading: '#1f4d2b', surface: '#fbf3df', chip: 'rgba(0,0,0,.18)', alt: '#b3261e', deep: '#e0a52a' }),
      pal('kumkum', 'Kumkum Red', 'Red', true, ['red', 'kumkum', 'maroon', 'lal'], { heroFrom: '#7c1420', heroVia: '#6e0f1a', heroTo: '#520a13', heroText: '#fdf1dc', accent: '#f2c14e', primary: '#6e0f1a', heading: '#6e0f1a', surface: '#fcf3e3', chip: 'rgba(0,0,0,.2)', alt: '#1f6b3a', deep: '#e0a52a' }),
      pal('peacock', 'Peacock Blue', 'Blue & teal', true, ['blue', 'peacock', 'teal', 'mor'], { heroFrom: '#0e5a63', heroVia: '#0b4f57', heroTo: '#073a40', heroText: '#f3f8f2', accent: '#f2c14e', primary: '#0b4f57', heading: '#0b4f57', surface: '#f8f5e8', chip: 'rgba(0,0,0,.2)', alt: '#b3261e', deep: '#e0a52a' }),
      pal('granite', 'Temple Granite', 'Black & grey', true, ['black', 'granite', 'stone', 'gold'], { heroFrom: '#2a221d', heroVia: '#1f1915', heroTo: '#15110e', heroText: '#f8efdc', accent: '#e8b84a', primary: '#2a221d', heading: '#2a221d', surface: '#f8f2e6', chip: 'rgba(255,255,255,.06)', alt: '#b3261e', deep: '#d9a43a' }),
      pal('turmeric', 'Turmeric', 'Orange & yellow', true, ['yellow', 'turmeric', 'manjal', 'haldi', 'mustard'], { heroFrom: '#c1820f', heroVia: '#b0740c', heroTo: '#8f5c08', heroText: '#fffaf0', accent: '#fff1c1', primary: '#8f5c08', heading: '#7a4a05', surface: '#fff9ec', chip: 'rgba(0,0,0,.16)', alt: '#9a1b1b', deep: '#fde4a6' }),
    ],
  },
  {
    id: 'jaali', name: 'Jaali', tagline: 'Mughal arch and carved lattice',
    description: 'A tall Mughal arch filled with a carved jaali lattice frames your names, with a crescent and star above. Functions sit in arched niches, the nikah highlighted.',
    category: 'Regional', nameStyle: 'serif', bestFor: 'Nikah, walima and Mughal-inspired weddings',
    words: ['jaali', 'jali', 'lattice', 'mughal', 'arch', 'nikah', 'walima', 'islamic', 'crescent', 'moon', 'chand'],
    cultures: ['muslim', 'nikah'],
    palettes: [
      pal('emerald', 'Emerald Stone', 'Green', false, ['green', 'emerald', 'stone', 'gold'], { heroFrom: '#eef2ec', heroVia: '#eef2ec', heroTo: '#e4ebe2', heroText: '#12392f', accent: '#0f5b4a', primary: '#0f5b4a', heading: '#0f5b4a', surface: '#eef2ec', chip: 'rgba(15,91,74,.06)', alt: '#b8963e', deep: '#0f5b4a' }),
      pal('lapis', 'Lapis & Ivory', 'Blue & teal', false, ['blue', 'lapis', 'ivory', 'royal blue'], { heroFrom: '#f4f1e8', heroVia: '#f4f1e8', heroTo: '#ebe6d8', heroText: '#17244a', accent: '#1f3a85', primary: '#1f3a85', heading: '#1f3a85', surface: '#f4f1e8', chip: 'rgba(31,58,133,.06)', alt: '#b8963e', deep: '#1f3a85' }),
      pal('gulabi', 'Gulabi Pink', 'Pink', false, ['pink', 'gulabi', 'rose', 'hyderabadi'], { heroFrom: '#fbf0f1', heroVia: '#fbf0f1', heroTo: '#f5e2e5', heroText: '#4a1a2a', accent: '#9c2f55', primary: '#9c2f55', heading: '#9c2f55', surface: '#fbf0f1', chip: 'rgba(156,47,85,.06)', alt: '#b8963e', deep: '#9c2f55' }),
      pal('teal', 'Firozi Teal', 'Blue & teal', false, ['teal', 'firozi', 'turquoise'], { heroFrom: '#edf5f4', heroVia: '#edf5f4', heroTo: '#dfecea', heroText: '#0d3434', accent: '#0d6b6b', primary: '#0d6b6b', heading: '#0d6b6b', surface: '#edf5f4', chip: 'rgba(13,107,107,.06)', alt: '#b8963e', deep: '#0d6b6b' }),
      pal('maroon', 'Maroon & Sandstone', 'Red', false, ['maroon', 'red', 'sandstone'], { heroFrom: '#f8efe6', heroVia: '#f8efe6', heroTo: '#efe1d3', heroText: '#3e0f1c', accent: '#7a1730', primary: '#7a1730', heading: '#7a1730', surface: '#f8efe6', chip: 'rgba(122,23,48,.06)', alt: '#b8963e', deep: '#7a1730' }),
      pal('night', 'Emerald Night', 'Green', true, ['green', 'night', 'dark', 'gold'], { heroFrom: '#0b2a24', heroVia: '#0b2a24', heroTo: '#071d19', heroText: '#f4ecd8', accent: '#e6cd85', primary: '#0b4a3e', heading: '#0b3b32', surface: '#f2f0e8', chip: 'rgba(230,205,133,.1)', alt: '#d8bd72', deep: '#e6cd85' }),
    ],
  },
];

const STYLE_BY_ID = new Map(STYLES.map((s) => [s.id, s]));
export const getStyle = (id: string) => STYLE_BY_ID.get(id as StyleLayout);

export const LAYOUTS: { id: Layout; name: string }[] = [
  { id: 'classic', name: 'Classic crest' },
  ...STYLES.map((s) => ({ id: s.id as Layout, name: s.name })),
];

const culturesOf = (s: StyleInfo): Culture[] => (s.cultures === '*' ? CULTURES : CULTURES.filter((c) => (s.cultures as string[]).includes(c.id)));

// Placeholder crest/border for styled designs (they draw their own art; these
// only keep older code paths that read them working).
const PLACEHOLDER: Record<StyleLayout, { ornament: Ornament; frame: Frame }> = {
  rajwada: { ornament: 'mandala', frame: 'double' }, bagh: { ornament: 'leaves', frame: 'single' }, patrika: { ornament: 'monogram', frame: 'single' },
  mehfil: { ornament: 'sun', frame: 'double' }, filmy: { ornament: 'hearts', frame: 'single' }, lifafa: { ornament: 'monogram', frame: 'single' },
  kovil: { ornament: 'lamp', frame: 'kasavu' }, jaali: { ornament: 'arch', frame: 'arch' },
};

export const styledId = (style: string, culture: string, palette: string) => `s-${style}-${culture}-${palette}`;

/** Rebuild a styled design from its id, or null if it isn't a valid one. */
export function buildStyled(id: string): TemplateInfo | null {
  const m = /^s-([a-z]+)-([a-z]+)-([a-z]+)$/.exec(id);
  if (!m) return null;
  const style = getStyle(m[1]);
  const culture = getCulture(m[2]);
  const palette = style?.palettes.find((p) => p.id === m[3]);
  if (!style || !culture || !palette || !culturesOf(style).includes(culture)) return null;

  const h = hash(id);
  const lang = getLanguage(culture.lang);
  const [partner1, partner2] = culture.couples[h % culture.couples.length];
  const [city, venue] = culture.places[(h >>> 8) % culture.places.length];
  const languageNote = lang.code === 'en' ? 'in English' : `in ${lang.name} (${lang.native})`;
  return {
    id, layout: style.id, lang: culture.lang, culture: culture.id, family: palette.family, featured: false,
    name: `${style.name} ${palette.name} · ${culture.name}`,
    tagline: style.tagline,
    description: `${style.description} ${culture.id === 'modern' || culture.id === 'southern' || culture.id === 'nikah' || culture.id === 'christian' || culture.id === 'parsi' ? `This version is ${languageNote}, for ${culture.name.toLowerCase()} weddings.` : `This version opens ${languageNote}.`}`,
    category: style.category, bestFor: style.bestFor, nameStyle: style.nameStyle,
    ...PLACEHOLDER[style.id],
    dark: palette.dark, colors: palette.colors, events: culture.events,
    sample: { partner1, partner2, blessing: culture.blessings[(h >>> 16) % culture.blessings.length], city, venue },
    tags: [
      ...style.words, style.name.toLowerCase(), ...palette.words, palette.name.toLowerCase(), palette.family.toLowerCase(),
      palette.dark ? 'dark' : 'light pastel soft', ...culture.words, culture.name.toLowerCase(), ...lang.words, lang.name.toLowerCase(),
      'new', city.toLowerCase(),
    ],
  };
}

/** Every valid styled id. */
export function styledIds(): string[] {
  const ids: string[] = [];
  for (const s of STYLES) for (const c of culturesOf(s)) for (const p of s.palettes) ids.push(styledId(s.id, c.id, p.id));
  return ids;
}

/** One default colourway per look and tradition (used for "featured"-style showcases). */
export const showcaseId = (style: string, culture: string) => {
  const s = getStyle(style);
  return s ? styledId(s.id, culture, s.palettes[0].id) : null;
};
