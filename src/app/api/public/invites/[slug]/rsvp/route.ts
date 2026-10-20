import { connectDB } from '@/lib/db';
import { Invite } from '@/lib/models/Invite';
import { Rsvp } from '@/lib/models/Rsvp';
import { error, json, parseBody } from '@/lib/api-helpers';
import { rsvpSchema } from '@/lib/validation';

// Simple per-instance limiter: max 10 RSVPs per IP per 10 minutes.
// (Use a shared store such as Upstash Redis when running many instances.)
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 10;
}

// POST /api/public/invites/:slug/rsvp: guests respond (no login needed)
export async function POST(req: Request, ctx: RouteContext<'/api/public/invites/[slug]/rsvp'>) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return error('Too many responses — please try again in a few minutes', 429);

  const body = await parseBody(req, rsvpSchema);
  if ('response' in body) return body.response;
  const { website, ...rsvp } = body.data;
  if (website) return json({ ok: true }); // bot filled the honeypot: pretend success

  await connectDB();
  const { slug } = await ctx.params;
  const invite = await Invite.findOne({ slug, published: true }, { _id: 1, events: 1, rsvpDeadline: 1 }).lean();
  if (!invite) return error('This invitation is no longer available', 404);

  const validEvents = new Set((invite.events ?? []).map((e) => e.name));
  await Rsvp.create({
    ...rsvp,
    invite: invite._id,
    guests: rsvp.attending ? rsvp.guests : 0,
    events: rsvp.attending ? rsvp.events.filter((e) => validEvents.has(e)) : [],
  });
  return json({ ok: true }, 201);
}
