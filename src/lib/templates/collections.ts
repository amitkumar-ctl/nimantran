import type { TemplateFilters } from '../themes';

/*
 * SEO landing pages: /templates/c/[slug]. Each is a search over the catalogue
 * with its own heading and intro, targeting what people actually search for
 * ("red wedding invitation", "nikah card", "south indian wedding invite"…).
 */
export type Collection = { slug: string; title: string; h1: string; intro: string; query?: string; filters?: TemplateFilters };

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

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
