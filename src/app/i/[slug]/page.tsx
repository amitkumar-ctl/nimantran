import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicInvite } from '@/lib/invites';
import { formatLongDate } from '@/lib/format';
import { InviteView } from '@/components/invite/InviteView';
import { RsvpForm } from '@/components/invite/RsvpForm';
import { Shagun } from '@/components/invite/Shagun';
import { MadeWith } from '@/components/invite/MadeWith';

type Props = PageProps<'/i/[slug]'>;

// Render each invite on the server per request (from the cached lookup) instead
// of streaming into a static shell, so missing invites get a real 404 status
// and WhatsApp/Google always receive the finished HTML in one response.
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invite = await getPublicInvite(slug);
  if (!invite) notFound(); // real 404 status for crawlers and link previews

  const couple = `${invite.partner1} & ${invite.partner2}`;
  const when = formatLongDate(invite.weddingDate);
  const description = `You're invited to the wedding of ${couple} on ${when}${invite.city ? ` in ${invite.city}` : ''}. View all functions and venues, and let them know if you’re coming.`;
  return {
    title: { absolute: `${couple} — Wedding Invitation` },
    description,
    // Personal invitations stay out of search results. Link previews
    // (WhatsApp etc.) still work because they read the Open Graph tags.
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: `/i/${slug}` },
    openGraph: { title: `${couple} are getting married 💍`, description, url: `/i/${slug}`, type: 'website' },
    twitter: { title: `${couple} are getting married 💍`, description },
  };
}

export default async function InvitePage({ params }: Props) {
  // Checked before anything streams, so a missing or unpublished invite
  // returns a real 404 status. getPublicInvite is cached, so this is fast.
  const { slug } = await params;
  const invite = await getPublicInvite(slug);
  if (!invite) notFound();
  const couple = `${invite.partner1} & ${invite.partner2}`;

  return (
    <>
      <InviteView
        invite={invite}
        rsvpSlot={<RsvpForm slug={invite.slug} events={invite.events.map((e) => e.name)} />}
        shagunSlot={<Shagun upiId={invite.upiId} upiName={invite.upiName} couple={couple} slug={invite.slug} />}
      />
      <MadeWith />
    </>
  );
}
