import { getPublicInvite } from '@/lib/invites';
import { buildIcs } from '@/lib/calendar';
import { absoluteUrl } from '@/config/site';

// GET /i/<slug>/calendar           → every function as one .ics file
// GET /i/<slug>/calendar?event=<id> → just that function
// Opens in Apple Calendar / Outlook / most Android calendars.
export async function GET(req: Request, ctx: RouteContext<'/i/[slug]/calendar'>) {
  const { slug } = await ctx.params;
  const invite = await getPublicInvite(slug);
  if (!invite) return new Response('This invitation is no longer available', { status: 404 });

  const only = new URL(req.url).searchParams.get('event');
  const events = only ? invite.events.filter((e) => e.id === only) : invite.events;
  if (!events.length) return new Response('Function not found', { status: 404 });

  const name = `${invite.partner1}-${invite.partner2}${only ? `-${events[0].name}` : '-wedding'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return new Response(buildIcs(invite, events, absoluteUrl(`/i/${slug}`)), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}.ics"`,
      'Cache-Control': 'private, max-age=300',
      'X-Robots-Tag': 'noindex',
    },
  });
}
