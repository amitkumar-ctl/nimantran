import type { TemplateFilters } from '../themes';

/*
 * SEO landing pages: /templates/c/[slug]. Each is a search over the catalogue
 * with its own heading and intro, targeting what people actually search for
 * ("red wedding invitation", "nikah card", "south indian wedding invite"…).
 */
export type Collection = { slug: string; title: string; h1: string; intro: string; query?: string; filters?: TemplateFilters; kind?: 'colour' | 'tradition' | 'language' | 'look' | 'motif' };

export const COLLECTIONS: Collection[] = [
  { slug: 'red', title: 'Red Wedding Invitation Templates', h1: 'Red wedding invitations', query: 'red', intro: 'Maroon, ruby, wine and sindoor red: the colour of Indian weddings. Classic, auspicious and always festive.' },
  { slug: 'maroon-gold', title: 'Maroon & Gold Wedding Invitation Templates', h1: 'Maroon & gold wedding invitations', query: 'maroon', intro: 'Deep maroon with antique gold, the timeless royal look for palace weddings and grand receptions.' },
  { slug: 'pink', title: 'Pink Wedding Invitation Templates', h1: 'Pink wedding invitations', filters: { family: 'Pink' }, intro: 'Rani pink, blush and sunset rose. From bold and festive to soft and romantic.' },
  { slug: 'pastel', title: 'Pastel Wedding Invitation Templates', h1: 'Pastel wedding invitations', filters: { tone: 'light' }, intro: 'Soft blush, mint, lilac, peach and powder-blue designs for modern couples, day functions and intimate weddings.' },
  { slug: 'green', title: 'Green Wedding Invitation Templates', h1: 'Green wedding invitations', filters: { family: 'Green' }, intro: 'Emerald, mehndi green, sage and mint: fresh, botanical and perfect for mehndi and nikah.' },
  { slug: 'royal-blue', title: 'Royal Blue & Navy Wedding Invitation Templates', h1: 'Blue wedding invitations', filters: { family: 'Blue & teal' }, intro: 'Royal blue, navy, peacock teal and ocean: elegant evening designs with gold accents.' },
  { slug: 'purple', title: 'Purple & Lavender Wedding Invitation Templates', h1: 'Purple wedding invitations', filters: { family: 'Purple' }, intro: 'Royal purple, plum, indigo and lilac designs that feel serene, regal and a little dreamy.' },
  { slug: 'yellow-haldi', title: 'Yellow Haldi Invitation Templates', h1: 'Yellow & haldi invitations', filters: { family: 'Orange & yellow' }, intro: 'Turmeric, saffron, marigold and lemon designs for haldi mornings and sunny day functions.' },
  { slug: 'black-gold', title: 'Black & Gold Wedding Invitation Templates', h1: 'Black & gold wedding invitations', query: 'black gold', intro: 'Luxurious black and gold designs, ideal for cocktail nights, sangeet and grand receptions.' },
  { slug: 'ivory-gold', title: 'Ivory & Gold Wedding Invitation Templates', h1: 'Ivory & gold wedding invitations', filters: { family: 'Ivory & gold' }, intro: 'Cream, champagne and ivory backgrounds with gold detailing: elegant, light and timeless.' },
  { slug: 'white-minimal', title: 'Minimal White Wedding Invitation Templates', h1: 'Minimal wedding invitations', query: 'minimal', intro: 'Clean, modern designs with fine lines and monograms for couples who like it simple.' },
  { slug: 'traditional', title: 'Traditional Indian Wedding Invitation Templates', h1: 'Traditional wedding invitations', filters: { category: 'Traditional' }, intro: 'Rich colours with mandalas, marigolds, lotus and kalash motifs for traditional Hindu weddings.' },
  { slug: 'nikah', title: 'Nikah & Muslim Wedding Invitation Templates', h1: 'Nikah invitations', query: 'nikah', intro: 'Mughal arches, crescent moons and emerald palettes for nikah, walima and Muslim wedding celebrations.' },
  { slug: 'south-indian', title: 'South Indian Wedding Invitation Templates', h1: 'South Indian wedding invitations', query: 'south indian', intro: 'Kasavu bands, brass deepam lamps and temple motifs for Tamil, Telugu, Kannada and Kerala weddings.' },
  { slug: 'kerala', title: 'Kerala Kasavu Wedding Invitation Templates', h1: 'Kerala wedding invitations', query: 'kasavu', intro: 'Ivory-and-gold kasavu saree borders and nilavilakku lamps, inspired by Kerala weddings.' },
  { slug: 'mehndi', title: 'Mehndi Invitation Templates', h1: 'Mehndi invitations', query: 'mehndi', intro: 'Green, botanical and floral designs for mehndi ceremonies and garden functions.' },
  { slug: 'haldi', title: 'Haldi Ceremony Invitation Templates', h1: 'Haldi invitations', query: 'haldi', intro: 'Bright marigold and turmeric designs for a joyful haldi ceremony.' },
  { slug: 'engagement', title: 'Engagement & Roka Invitation Templates', h1: 'Engagement invitations', query: 'engagement', intro: 'Ring motifs and modern palettes for engagements, roka and sagai ceremonies.' },
  { slug: 'destination-beach', title: 'Beach & Destination Wedding Invitation Templates', h1: 'Destination wedding invitations', query: 'beach', intro: 'Sunsets, ocean blues and breezy colours for Goa, Kerala and abroad destination weddings.' },
  { slug: 'lotus', title: 'Lotus Wedding Invitation Templates', h1: 'Lotus wedding invitations', filters: { ornament: 'lotus' }, intro: 'The kamal: a symbol of purity and new beginnings, in every colour from maroon to pastel lilac.' },
  { slug: 'peacock', title: 'Peacock Wedding Invitation Templates', h1: 'Peacock wedding invitations', filters: { ornament: 'paisley' }, intro: 'Mor-pankh feather designs, loved for Rajasthani, Gujarati and Krishna-themed weddings.' },
  { slug: 'ganesh-kalash', title: 'Kalash & Ganesh Wedding Invitation Templates', h1: 'Kalash wedding invitations', filters: { ornament: 'kalash' }, intro: 'The auspicious kalash with mango leaves and coconut, for traditional ceremonies that begin with blessings.' },
  { slug: 'floral-marigold', title: 'Marigold Floral Wedding Invitation Templates', h1: 'Marigold & floral invitations', filters: { ornament: 'marigold' }, intro: 'Genda-phool crests and garlands in every colour, festive and full of life.' },
  { slug: 'toran', title: 'Toran Garland Wedding Invitation Templates', h1: 'Toran garland invitations', filters: { frame: 'toran' }, intro: 'Doorway toran garlands of marigolds and mango leaves frame your names, just like a wedding home.' },
  { slug: 'modern-engraved', title: 'Modern Engraved Wedding Invitation Templates', h1: 'Modern engraved invitations', filters: { nameStyle: 'serif' }, intro: 'Your names in engraved serif capitals: formal, modern and beautifully clean.' },
];

const lang = (slug: string, code: TemplateFilters['lang'], name: string, native: string, intro: string): Collection => ({
  slug, kind: 'language', filters: { lang: code },
  title: `${name} Wedding Invitation Templates (${native})`, h1: `${name} wedding invitations`, intro,
});
const look = (slug: string, layout: TemplateFilters['layout'], title: string, h1: string, intro: string): Collection => ({ slug, kind: 'look', filters: { layout }, title, h1, intro });
const tradition = (slug: string, culture: string, title: string, h1: string, intro: string): Collection => ({ slug, kind: 'tradition', filters: { culture }, title, h1, intro });

// Every language, every look and the traditions not covered above.
COLLECTIONS.push(
  lang('hindi', 'hi', 'Hindi', 'हिन्दी', 'Designs that open with “॥ शुभ विवाह ॥” or “॥ श्री गणेशाय नमः ॥” in Devanagari, with headings in Hindi and English.'),
  lang('marathi', 'mr', 'Marathi', 'मराठी', 'Marathi invitations that open with “॥ शुभमंगल सावधान ॥”, with Sakharpuda, Haldi and Lagna ready to fill in.'),
  lang('gujarati', 'gu', 'Gujarati', 'ગુજરાતી', 'Gujarati invitations with “શુભ લગ્ન”, and Mandvo, Pithi, Garba night and Lagna already listed.'),
  lang('punjabi', 'pa', 'Punjabi', 'ਪੰਜਾਬੀ', 'Gurmukhi invitations opening with “ੴ ਸਤਿ ਨਾਮੁ” or “ਅਨੰਦ ਕਾਰਜ”, with Chunni, Jaggo and Anand Karaj included.'),
  lang('bengali', 'bn', 'Bengali', 'বাংলা', 'Bengali invitations with “শুভ বিবাহ”, and Aiburobhat, Gaye Holud, Biye and Bou Bhaat ready to go.'),
  lang('assamese', 'as', 'Assamese', 'অসমীয়া', 'Assamese invitations with “শুভ বিবাহ” and a warm “সাদৰ নিমন্ত্ৰণ”, with Juroon, Pani Tola and Biya included.'),
  lang('odia', 'or', 'Odia', 'ଓଡ଼ିଆ', 'Odia invitations opening with “ଶୁଭ ବିବାହ” and headings in Odia and English.'),
  lang('tamil', 'ta', 'Tamil', 'தமிழ்', 'Tamil invitations with “சுப முகூர்த்தம்”, temple kolam designs and the muhurtham highlighted.'),
  lang('telugu', 'te', 'Telugu', 'తెలుగు', 'Telugu invitations opening with “శ్రీరస్తు శుభమస్తు” or “శుభ వివాహం”, with Pellikuthuru and Pelli ready to fill in.'),
  lang('kannada', 'kn', 'Kannada', 'ಕನ್ನಡ', 'Kannada invitations with “ಶುಭ ವಿವಾಹ”, from temple gopurams to modern editorial designs.'),
  lang('malayalam', 'ml', 'Malayalam', 'മലയാളം', 'Malayalam invitations with “ശുഭവിവാഹം”, kasavu bands and temple lamps.'),
  lang('urdu', 'ur', 'Urdu', 'اردو', 'Urdu invitations in Nastaliq, opening with Bismillah, with Mehndi, Nikah and Walima included.'),
  lang('english', 'en', 'English', 'English', 'Invitations written fully in English, for modern, Christian, Parsi, destination and mixed-language weddings.'),
  look('envelope', 'lifafa', 'Envelope Opening Wedding Invitation Templates', 'Envelope invitations', 'A sealed velvet envelope with a wax seal of your initials. Guests tap to open it, and personal links address it to each family by name.'),
  look('bollywood', 'filmy', 'Bollywood Poster Wedding Invitation Templates', 'Bollywood poster invitations', 'Your love story as a film poster: marquee lights, an illustrated couple and functions as scenes on a film strip.'),
  look('palace', 'rajwada', 'Royal Palace Wedding Invitation Templates', 'Palace invitations', 'An illustrated palace at night with fireworks and elephants, and functions written on parchment scrolls.'),
  look('watercolour', 'bagh', 'Watercolour Floral Wedding Invitation Templates', 'Watercolour invitations', 'Hand-painted flowers, flowing script names and functions pinned up like little cards.'),
  look('modern-editorial', 'patrika', 'Modern Editorial Wedding Invitation Templates', 'Modern editorial invitations', 'Magazine-cover typography with a huge date, for couples who want something clean and not traditional.'),
  look('art-deco', 'mehfil', 'Art Deco Wedding Invitation Templates', 'Art Deco invitations', 'Gold sunbursts, stepped frames and ticket passes for every function. Made for sangeet and reception nights.'),
  look('temple', 'kovil', 'South Indian Temple Wedding Invitation Templates', 'Temple wedding invitations', 'A golden gopuram, kolam border and kasavu band, with the muhurtham highlighted on a bell timeline.'),
  look('mughal-jaali', 'jaali', 'Mughal Jaali Nikah Invitation Templates', 'Mughal jaali invitations', 'A carved lattice arch with crescent and star, and each function in its own arched niche.'),
  tradition('sikh-anand-karaj', 'punjabi', 'Sikh Anand Karaj Invitation Templates', 'Anand Karaj invitations', 'Punjabi invitations with the Anand Karaj at the gurdwara, plus Chunni, Mehndi, Jaggo and reception.'),
  tradition('christian', 'christian', 'Christian Wedding Invitation Templates', 'Christian wedding invitations', 'Holy Matrimony invitations for church weddings, with the engagement and reception included.'),
  tradition('parsi', 'parsi', 'Parsi Wedding Invitation Templates', 'Parsi wedding invitations', '“Ushta Te”: Parsi invitations with Madhavsaro, Lagan and dinner ready to fill in.'),
  tradition('jain', 'jain', 'Jain Wedding Invitation Templates', 'Jain wedding invitations', 'Invitations that open with “॥ जय जिनेन्द्र ॥” or the Navkar Mantra.'),
  tradition('buddhist', 'buddhist', 'Buddhist Wedding Invitation Templates', 'Buddhist wedding invitations', 'Marathi invitations that open with “॥ नमो बुद्धाय ॥”.'),
  tradition('rajasthani', 'rajasthani', 'Rajasthani Wedding Invitation Templates', 'Rajasthani wedding invitations', '“पधारो म्हारे देस”: royal Rajasthani and Marwari invitations for palace weddings in Jaipur, Udaipur and Jodhpur.'),
);

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

/** Collections of the same kind first (other languages for a language page…), then a mix. */
export function relatedCollections(c: Collection, n = 16) {
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug);
  const same = others.filter((x) => x.kind === c.kind);
  return [...same, ...others.filter((x) => x.kind !== c.kind)].slice(0, n);
}
