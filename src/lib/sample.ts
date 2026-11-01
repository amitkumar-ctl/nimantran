import type { InviteData } from './types';
import type { InviteEvent } from './validation';
import { getTemplate, type EventSet, type Theme } from './themes';

// Demo content for template previews and for pre-filling a new invite.

export const EVENT_PRESETS: Pick<InviteEvent, 'name' | 'emoji'>[] = [
  { name: 'Haldi', emoji: '🌼' },
  { name: 'Mehndi', emoji: '🌿' },
  { name: 'Sangeet', emoji: '🎶' },
  { name: 'Wedding', emoji: '🔥' },
  { name: 'Reception', emoji: '✨' },
  { name: 'Engagement', emoji: '💍' },
  { name: 'Cocktail', emoji: '🥂' },
];

type SampleEvent = InviteData['events'][number];

/** Typical ceremonies per wedding tradition (dates relative to 12 Dec 2026). */
export const EVENT_SETS: Record<EventSet, SampleEvent[]> = {
  north: [
    { id: 'e1', name: 'Haldi', emoji: '🌼', date: '2026-12-10', time: '10:00 AM', venue: 'Poolside Lawn', mapUrl: '', note: 'Dress code: yellow' },
    { id: 'e2', name: 'Mehndi', emoji: '🌿', date: '2026-12-10', time: '4:00 PM', venue: 'Courtyard Garden', mapUrl: '', note: '' },
    { id: 'e3', name: 'Sangeet', emoji: '🎶', date: '2026-12-11', time: '7:30 PM', venue: 'Grand Ballroom', mapUrl: '', note: 'Dress code: Indo-western' },
    { id: 'e4', name: 'Wedding', emoji: '🔥', date: '2026-12-12', time: '6:00 PM', venue: 'Palace Lawns', mapUrl: '', note: 'Pheras at 9 PM' },
    { id: 'e5', name: 'Reception', emoji: '✨', date: '2026-12-13', time: '8:00 PM', venue: 'Crystal Hall', mapUrl: '', note: '' },
  ],
  nikah: [
    { id: 'e1', name: 'Mehndi', emoji: '🌿', date: '2026-12-10', time: '5:00 PM', venue: 'Courtyard Garden', mapUrl: '', note: '' },
    { id: 'e2', name: 'Nikah', emoji: '🌙', date: '2026-12-12', time: '7:00 PM', venue: 'Palace Lawns', mapUrl: '', note: '' },
    { id: 'e3', name: 'Walima', emoji: '✨', date: '2026-12-13', time: '8:00 PM', venue: 'Crystal Hall', mapUrl: '', note: 'Dinner will be served' },
  ],
  south: [
    { id: 'e1', name: 'Engagement', emoji: '💍', date: '2026-12-11', time: '6:00 PM', venue: 'Banquet Hall', mapUrl: '', note: '' },
    { id: 'e2', name: 'Muhurtham', emoji: '🪔', date: '2026-12-12', time: '9:15 AM', venue: 'Temple Hall', mapUrl: '', note: 'Traditional attire' },
    { id: 'e3', name: 'Reception', emoji: '✨', date: '2026-12-12', time: '7:00 PM', venue: 'Lawn', mapUrl: '', note: '' },
  ],
  sikh: [
    { id: 'e1', name: 'Chunni Ceremony', emoji: '🧣', date: '2026-12-10', time: '11:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e2', name: 'Mehndi', emoji: '🌿', date: '2026-12-10', time: '5:00 PM', venue: 'Courtyard Garden', mapUrl: '', note: '' },
    { id: 'e3', name: 'Jaggo', emoji: '🪔', date: '2026-12-11', time: '8:00 PM', venue: 'Family Home', mapUrl: '', note: 'Bhangra till late' },
    { id: 'e4', name: 'Anand Karaj', emoji: '🙏', date: '2026-12-12', time: '10:00 AM', venue: 'Gurdwara Sahib', mapUrl: '', note: 'Please cover your head' },
    { id: 'e5', name: 'Reception', emoji: '✨', date: '2026-12-12', time: '7:30 PM', venue: 'Crystal Hall', mapUrl: '', note: '' },
  ],
  bengali: [
    { id: 'e1', name: 'Aiburobhat', emoji: '🍛', date: '2026-12-10', time: '1:00 PM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e2', name: 'Gaye Holud', emoji: '🌼', date: '2026-12-12', time: '9:00 AM', venue: 'Family Home', mapUrl: '', note: 'Wear yellow' },
    { id: 'e3', name: 'Biye', emoji: '🔥', date: '2026-12-12', time: '7:00 PM', venue: 'Banquet Hall', mapUrl: '', note: 'Lagna at 9:30 PM' },
    { id: 'e4', name: 'Bou Bhaat', emoji: '✨', date: '2026-12-14', time: '8:00 PM', venue: 'Crystal Hall', mapUrl: '', note: '' },
  ],
  gujarati: [
    { id: 'e1', name: 'Mandvo Mahurat', emoji: '🌿', date: '2026-12-10', time: '10:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e2', name: 'Pithi', emoji: '🌼', date: '2026-12-10', time: '4:00 PM', venue: 'Courtyard', mapUrl: '', note: 'Dress code: yellow' },
    { id: 'e3', name: 'Garba Night', emoji: '💃', date: '2026-12-11', time: '8:00 PM', venue: 'Party Plot', mapUrl: '', note: 'Bring your dandiyas' },
    { id: 'e4', name: 'Lagna', emoji: '🔥', date: '2026-12-12', time: '6:00 PM', venue: 'Palace Lawns', mapUrl: '', note: 'Hast melap at 7:15 PM' },
    { id: 'e5', name: 'Reception', emoji: '✨', date: '2026-12-13', time: '8:00 PM', venue: 'Crystal Hall', mapUrl: '', note: '' },
  ],
  marathi: [
    { id: 'e1', name: 'Sakharpuda', emoji: '💍', date: '2026-12-10', time: '6:00 PM', venue: 'Banquet Hall', mapUrl: '', note: '' },
    { id: 'e2', name: 'Haldi', emoji: '🌼', date: '2026-12-11', time: '10:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e3', name: 'Mehendi', emoji: '🌿', date: '2026-12-11', time: '5:00 PM', venue: 'Courtyard', mapUrl: '', note: '' },
    { id: 'e4', name: 'Lagna', emoji: '🔥', date: '2026-12-12', time: '12:35 PM', venue: 'Mangal Karyalay', mapUrl: '', note: 'Shubh muhurta' },
    { id: 'e5', name: 'Reception', emoji: '✨', date: '2026-12-12', time: '7:30 PM', venue: 'Lawns', mapUrl: '', note: '' },
  ],
  telugu: [
    { id: 'e1', name: 'Pellikuthuru', emoji: '🌼', date: '2026-12-10', time: '10:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e2', name: 'Mehndi & Sangeet', emoji: '🎶', date: '2026-12-11', time: '6:00 PM', venue: 'Banquet Hall', mapUrl: '', note: '' },
    { id: 'e3', name: 'Pelli', emoji: '🪔', date: '2026-12-12', time: '9:30 PM', venue: 'Kalyana Mandapam', mapUrl: '', note: 'Jeelakarra bellam at the muhurtham' },
    { id: 'e4', name: 'Reception', emoji: '✨', date: '2026-12-13', time: '7:00 PM', venue: 'Convention Hall', mapUrl: '', note: '' },
  ],
  assamese: [
    { id: 'e1', name: 'Juroon', emoji: '🎁', date: '2026-12-10', time: '11:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e2', name: 'Pani Tola', emoji: '💧', date: '2026-12-12', time: '7:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e3', name: 'Biya', emoji: '🔥', date: '2026-12-12', time: '7:00 PM', venue: 'Banquet Hall', mapUrl: '', note: '' },
    { id: 'e4', name: 'Reception', emoji: '✨', date: '2026-12-14', time: '7:30 PM', venue: 'Crystal Hall', mapUrl: '', note: '' },
  ],
  christian: [
    { id: 'e1', name: 'Engagement', emoji: '💍', date: '2026-12-10', time: '6:00 PM', venue: 'Parish Hall', mapUrl: '', note: '' },
    { id: 'e2', name: 'Holy Matrimony', emoji: '⛪', date: '2026-12-12', time: '11:00 AM', venue: 'The Church', mapUrl: '', note: '' },
    { id: 'e3', name: 'Reception', emoji: '✨', date: '2026-12-12', time: '7:00 PM', venue: 'Garden Lawns', mapUrl: '', note: 'Dinner and dancing' },
  ],
  parsi: [
    { id: 'e1', name: 'Madhavsaro', emoji: '🌱', date: '2026-12-10', time: '10:00 AM', venue: 'Family Home', mapUrl: '', note: '' },
    { id: 'e2', name: 'Lagan', emoji: '🔥', date: '2026-12-12', time: '6:30 PM', venue: 'Baug Hall', mapUrl: '', note: '' },
    { id: 'e3', name: 'Dinner', emoji: '✨', date: '2026-12-12', time: '8:00 PM', venue: 'Baug Lawns', mapUrl: '', note: 'Patra ni machhi on the menu' },
  ],
  destination: [
    { id: 'e1', name: 'Welcome Party', emoji: '🍹', date: '2026-12-10', time: '7:00 PM', venue: 'Pool Deck', mapUrl: '', note: 'Beach casuals' },
    { id: 'e2', name: 'Haldi & Mehndi', emoji: '🌼', date: '2026-12-11', time: '11:00 AM', venue: 'Garden', mapUrl: '', note: '' },
    { id: 'e3', name: 'Sangeet', emoji: '🎶', date: '2026-12-11', time: '8:00 PM', venue: 'Beach Lawn', mapUrl: '', note: '' },
    { id: 'e4', name: 'Beach Wedding', emoji: '🌅', date: '2026-12-12', time: '4:30 PM', venue: 'The Beach', mapUrl: '', note: 'Ceremony at sunset' },
  ],
};

export function sampleInvite(theme: Theme = 'royal'): InviteData {
  const t = getTemplate(theme);
  const s = t.sample;
  return {
    id: 'sample',
    slug: `${s.partner1}-weds-${s.partner2}`.toLowerCase(),
    published: true,
    premium: false,
    customSlug: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    theme: t.id,
    partner1: s.partner1,
    partner2: s.partner2,
    blessing: s.blessing,
    message: 'With the blessings of our families, we invite you to celebrate the wedding of',
    weddingDate: '2026-12-12',
    weddingTime: '18:00',
    city: s.city,
    venue: s.venue,
    events: EVENT_SETS[t.events].map((e) => ({ ...e })),
    rsvpDeadline: '2026-11-25',
    upiId: '',
    upiName: '',
    rsvpEnabled: true,
    updatedAt: '2026-10-20T00:00:00.000Z',
  };
}
