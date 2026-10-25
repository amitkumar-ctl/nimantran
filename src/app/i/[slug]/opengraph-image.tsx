import { getPublicInvite } from '@/lib/invites';
import { inviteCardImage, ogSize } from '@/lib/og';
import { formatHeroDate } from '@/lib/format';
import { site } from '@/config/site';

// The card shown when the invite link is shared on WhatsApp.
export const alt = 'Wedding invitation';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invite = await getPublicInvite(slug);
  if (!invite) {
    return inviteCardImage({ kicker: site.name, title: 'Invitation', line1: 'Wedding invitations guests can reply to' });
  }
  return inviteCardImage({
    theme: invite.theme,
    kicker: "You're invited",
    title: `${invite.partner1} & ${invite.partner2}`,
    line1: formatHeroDate(invite.weddingDate),
    line2: invite.venue || invite.city || undefined,
  });
}
