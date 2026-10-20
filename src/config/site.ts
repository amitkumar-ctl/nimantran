// Single place for brand details. Rename the product by editing this file.
export const site = {
  name: 'Nimantran',
  tagline: 'Beautiful wedding invitation websites with RSVP',
  description:
    'Create a beautiful digital wedding invitation website in minutes. Share one link on WhatsApp with every function, venue map, live countdown, RSVP and UPI shagun.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'en_IN',
  keywords: [
    'digital wedding invitation',
    'wedding invitation website',
    'online wedding invite with RSVP',
    'e-invite for wedding',
    'WhatsApp wedding invitation',
    'Indian wedding website',
  ],
} as const;

export const absoluteUrl = (path = '/') => new URL(path, site.url).toString();
