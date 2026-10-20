import { inviteCardImage, ogSize } from '@/lib/og';
import { site } from '@/config/site';

// Default share image for marketing pages.
export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return inviteCardImage({ kicker: site.name, title: 'Shubh Vivah', line1: 'Wedding invitations with RSVP', line2: 'Share one link on WhatsApp' });
}
