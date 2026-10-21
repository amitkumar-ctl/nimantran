import type { Colors, Frame, NameStyle, Ornament } from './types';

/*
 * Building blocks for generated templates. A template = palette × crest ×
 * border × lettering. Palettes are hand-picked for readable contrast
 * (light text on dark heroes, dark text on light ones).
 */

export type Palette = {
  id: string;
  name: string;
  dark: boolean;
  warm: boolean;
  colors: Colors;
  /** Colour words people search for, incl. Hindi (lal, hara, neela…). */
  words: string[];
  mood: string;
};

const dark = (id: string, name: string, from: string, via: string, to: string, accent: string, surface: string, words: string[], mood: string, warm = true): Palette => ({
  id, name, dark: true, warm, words, mood,
  colors: { heroFrom: from, heroVia: via, heroTo: to, heroText: '#fbf7ef', accent, primary: via, heading: to, surface, chip: 'rgba(0,0,0,.18)' },
});
const light = (id: string, name: string, from: string, via: string, to: string, text: string, accent: string, primary: string, surface: string, words: string[], mood: string, warm = true): Palette => ({
  id, name, dark: false, warm, words, mood,
  colors: { heroFrom: from, heroVia: via, heroTo: to, heroText: text, accent, primary, heading: text, surface, chip: 'rgba(255,255,255,.55)' },
});

export const PALETTES: Palette[] = [
  // Deep, festive (dark heroes)
  dark('maroon', 'Maroon', '#8a1726', '#6b0f1a', '#3d0710', '#e8cf8a', '#fbf5ea', ['maroon', 'red', 'lal', 'gold', 'sunehra', 'royal'], 'regal'),
  dark('ruby', 'Ruby', '#d62828', '#a4161a', '#660708', '#ffd166', '#fff8f3', ['red', 'lal', 'sindoor', 'bright', 'bengali'], 'bold'),
  dark('wine', 'Wine', '#7b2142', '#5a1530', '#2f0a19', '#f0c9a0', '#fcf5f6', ['wine', 'burgundy', 'red', 'deep'], 'romantic'),
  dark('magenta', 'Rani Pink', '#c2185b', '#a0134d', '#5e0b2d', '#ffe0a3', '#fff6f9', ['pink', 'rani', 'gulabi', 'magenta', 'fuchsia'], 'festive'),
  dark('saffron', 'Saffron', '#f7a531', '#e07b16', '#9c3e07', '#fff1c1', '#fff8ec', ['orange', 'saffron', 'kesari', 'yellow', 'peela', 'haldi'], 'sunny'),
  dark('turmeric', 'Turmeric', '#f2c230', '#d89b12', '#8a5a05', '#fffbe6', '#fffbf0', ['yellow', 'peela', 'haldi', 'turmeric', 'mustard'], 'joyful'),
  dark('terracotta', 'Terracotta', '#c96a43', '#a24d2c', '#5f2814', '#fde3c4', '#fdf6f1', ['terracotta', 'rust', 'earthy', 'brown', 'boho'], 'earthy'),
  dark('emerald', 'Emerald', '#0f7a4d', '#0b5d3b', '#03301e', '#e9c46a', '#f5faf6', ['green', 'hara', 'emerald', 'nikah', 'mughal'], 'regal', false),
  dark('forest', 'Mehndi Green', '#7aa36a', '#4f7a43', '#263f20', '#fbe7c6', '#f5f8f1', ['green', 'hara', 'mehndi', 'olive', 'sage'], 'fresh', false),
  dark('peacock', 'Peacock', '#11727a', '#0b4f57', '#052e36', '#e2c275', '#f4faf8', ['teal', 'peacock', 'mor', 'blue', 'green'], 'rich', false),
  dark('navy', 'Navy', '#1e2a5a', '#141c3f', '#0a0f24', '#d9c08a', '#f6f4ef', ['navy', 'blue', 'neela', 'midnight', 'night'], 'elegant', false),
  dark('royalblue', 'Royal Blue', '#2b50aa', '#1f3a85', '#0e1d4a', '#f6d38b', '#f4f6fc', ['blue', 'neela', 'royal blue', 'cobalt'], 'bold', false),
  dark('indigo', 'Indigo', '#4b3f9e', '#352b7a', '#1a1442', '#f2d7a0', '#f6f5fc', ['indigo', 'blue', 'purple', 'violet'], 'calm', false),
  dark('purple', 'Royal Purple', '#7b5ea7', '#553c85', '#2e1f4f', '#f3d9a4', '#f8f5fc', ['purple', 'baingani', 'lavender', 'violet', 'jamuni'], 'serene', false),
  dark('plum', 'Plum', '#8e3b6e', '#6a2852', '#37122a', '#f5cfa8', '#fbf4f8', ['plum', 'purple', 'mauve', 'wine'], 'romantic'),
  dark('onyx', 'Black & Gold', '#2b2b2b', '#1a1a1a', '#050505', '#d4af37', '#f7f5f0', ['black', 'kala', 'gold', 'sunehra', 'luxury', 'reception'], 'luxe', false),
  dark('charcoal', 'Charcoal Silver', '#4a4f57', '#33373d', '#17191c', '#e3e6ea', '#f5f6f7', ['grey', 'gray', 'silver', 'charcoal', 'minimal'], 'modern', false),
  dark('chocolate', 'Mocha', '#7a5136', '#583622', '#2b190e', '#f2d3a6', '#faf5ef', ['brown', 'mocha', 'chocolate', 'coffee', 'earthy'], 'warm'),
  dark('sunset', 'Sunset', '#ffb36b', '#e0607e', '#4b2a73', '#fff3d6', '#fff8f5', ['sunset', 'coral', 'orange', 'pink', 'purple', 'beach', 'goa'], 'carefree'),
  dark('ocean', 'Ocean', '#3aa6b9', '#1d6f8a', '#0c3448', '#fdf3d8', '#f2f9fb', ['blue', 'ocean', 'sea', 'aqua', 'beach', 'turquoise'], 'breezy', false),
  // Soft, pastel (light heroes)
  light('ivory', 'Ivory Gold', '#fffdf6', '#fbf3dc', '#f3e3b5', '#3b2f1e', '#b8892b', '#8c6414', '#fffcf3', ['ivory', 'cream', 'gold', 'sunehra', 'white', 'off white'], 'classic'),
  light('blush', 'Blush', '#fff6f4', '#fbe3e3', '#f3c9cf', '#6e2b3d', '#b76e79', '#a0485c', '#fffaf9', ['pink', 'blush', 'gulabi', 'pastel', 'rose gold'], 'romantic'),
  light('peach', 'Peach', '#fff6ef', '#fde2cf', '#f9c6a8', '#6b3420', '#c4744a', '#b0582d', '#fffaf6', ['peach', 'apricot', 'orange', 'pastel', 'coral'], 'warm'),
  light('mint', 'Mint', '#f4fbf6', '#dcf1e3', '#bfe3cb', '#1f4a33', '#4f9a6c', '#2f7a50', '#f8fcf9', ['mint', 'green', 'hara', 'pastel', 'sage'], 'fresh', false),
  light('sky', 'Powder Blue', '#f4f8fd', '#dde9f8', '#c2d6f0', '#1d3557', '#5a7fb5', '#2e5a94', '#f8fbfe', ['blue', 'sky', 'powder blue', 'neela', 'pastel'], 'calm', false),
  light('lilac', 'Lilac', '#faf6fd', '#ece0f7', '#d9c4ee', '#3f2560', '#8d6bb8', '#6a4a96', '#fcfaff', ['lilac', 'lavender', 'purple', 'pastel', 'jamuni'], 'dreamy', false),
  light('lemon', 'Lemon', '#fffef3', '#fdf6c9', '#f7e98e', '#4a3b07', '#b38f12', '#8a6b00', '#fffef8', ['yellow', 'peela', 'lemon', 'haldi', 'pastel'], 'sunny'),
  light('champagne', 'Champagne', '#fcfaf6', '#f3ebdd', '#e6d5b8', '#3a3024', '#a3845a', '#7a5f3a', '#fdfcf9', ['champagne', 'beige', 'nude', 'gold', 'minimal'], 'elegant'),
  light('pearl', 'Pearl White', '#ffffff', '#f4f5f7', '#e4e7ec', '#23272f', '#8b95a5', '#3d4654', '#ffffff', ['white', 'safed', 'pearl', 'silver', 'church', 'minimal'], 'pure', false),
  light('sage', 'Sage', '#f6f8f3', '#e3eadb', '#cdd9c1', '#2d3b26', '#6f8a5c', '#4d6a3c', '#fafbf8', ['sage', 'green', 'olive', 'botanical', 'pastel'], 'botanical', false),
];

export const ORNAMENTS: { id: Ornament; name: string; words: string[] }[] = [
  { id: 'mandala', name: 'Mandala', words: ['mandala', 'traditional', 'rangoli', 'classic'] },
  { id: 'marigold', name: 'Marigold', words: ['marigold', 'genda', 'phool', 'flower', 'haldi', 'floral'] },
  { id: 'lotus', name: 'Lotus', words: ['lotus', 'kamal', 'temple', 'spiritual', 'floral'] },
  { id: 'paisley', name: 'Peacock Feather', words: ['peacock', 'mor pankh', 'feather', 'krishna', 'rajasthani', 'gujarati'] },
  { id: 'leaves', name: 'Botanical Wreath', words: ['leaves', 'wreath', 'botanical', 'garden', 'mehndi', 'floral', 'green'] },
  { id: 'kalash', name: 'Kalash', words: ['kalash', 'auspicious', 'puja', 'traditional', 'griha pravesh', 'coconut'] },
  { id: 'lamp', name: 'Deepam', words: ['lamp', 'diya', 'deepam', 'south indian', 'kerala', 'tamil'] },
  { id: 'arch', name: 'Mughal Arch', words: ['arch', 'mughal', 'nikah', 'muslim', 'jharokha', 'palace'] },
  { id: 'moon', name: 'Moon & Stars', words: ['moon', 'chand', 'stars', 'night', 'sangeet', 'nikah', 'eid'] },
  { id: 'sun', name: 'Sunset Sea', words: ['sun', 'sunset', 'beach', 'sea', 'destination', 'goa'] },
  { id: 'rings', name: 'Rings', words: ['rings', 'engagement', 'roka', 'sagai', 'modern', 'christian', 'church'] },
  { id: 'hearts', name: 'Hearts', words: ['hearts', 'love', 'romantic', 'modern', 'cute', 'anniversary'] },
  { id: 'monogram', name: 'Monogram', words: ['monogram', 'initials', 'minimal', 'modern', 'elegant'] },
];

export const FRAMES: { id: Frame; name: string; words: string[] }[] = [
  { id: 'double', name: 'Double border', words: ['border', 'classic', 'royal'] },
  { id: 'corners', name: 'Corner flourishes', words: ['corners', 'ornate', 'decorative'] },
  { id: 'arch', name: 'Arch frame', words: ['arch', 'jharokha', 'palace', 'mughal'] },
  { id: 'toran', name: 'Toran garland', words: ['toran', 'garland', 'marigold', 'festive', 'mala'] },
  { id: 'kasavu', name: 'Kasavu bands', words: ['kasavu', 'saree border', 'south indian', 'kerala', 'stripes'] },
  { id: 'single', name: 'Fine line', words: ['minimal', 'simple', 'clean', 'modern'] },
];

export const NAME_STYLES: { id: NameStyle; name: string; words: string[] }[] = [
  { id: 'script', name: 'Script', words: ['script', 'calligraphy', 'cursive', 'romantic'] },
  { id: 'serif', name: 'Engraved', words: ['serif', 'engraved', 'capitals', 'formal', 'modern'] },
];

export const SAMPLE_COUPLES: [string, string][] = [
  ['Aarav', 'Meera'], ['Rohan', 'Isha'], ['Kabir', 'Naina'], ['Dev', 'Tara'], ['Aditya', 'Sana'], ['Neil', 'Ritika'],
  ['Yash', 'Khushi'], ['Varun', 'Ananya'], ['Arjun', 'Lakshmi'], ['Arman', 'Zoya'], ['Rahul', 'Tanya'], ['Vihaan', 'Kiara'],
  ['Ishaan', 'Riya'], ['Karan', 'Pooja'], ['Siddharth', 'Avni'], ['Rehan', 'Aisha'], ['Pranav', 'Divya'], ['Samuel', 'Grace'],
];
