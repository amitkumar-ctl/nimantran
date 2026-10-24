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
  /** Public support address (shown on Help & contact, Privacy and Terms). */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@getnimantran.com',
  /**
   * Who runs the service, for the Privacy Policy and Terms. Fill these in
   * before launch (Indian law expects a named grievance officer and a city
   * for jurisdiction).
   */
  legal: {
    operator: process.env.NEXT_PUBLIC_LEGAL_OPERATOR ?? 'Nimantran',
    grievanceOfficer: process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER ?? 'The Nimantran support team',
    jurisdiction: process.env.NEXT_PUBLIC_LEGAL_CITY ?? 'New Delhi, India',
    updated: '24 October 2026',
  },
} as const;

export const absoluteUrl = (path = '/') => new URL(path, site.url).toString();
