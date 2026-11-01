import { createHash, randomBytes } from 'node:crypto';
import { canShare } from '@/lib/payments/config';
import type { Types } from 'mongoose';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { Invite } from '@/lib/models/Invite';
import { Rsvp } from '@/lib/models/Rsvp';
import { Shagun } from '@/lib/models/Shagun';
import { hashKey, readKey, shagunCookie } from '@/lib/guest-keys';
import { getSession } from '@/lib/auth/session';
import { error, json, parseBody } from '@/lib/api-helpers';
import { rsvpSchema, type RsvpInput } from '@/lib/validation';

type Ctx = RouteContext<'/api/public/invites/[slug]/rsvp'>;

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

// Each guest's browser gets a private random "edit key" for this invite. The
// cookie is httpOnly and only sent to this endpoint; the DB stores its hash.
const cookieName = (slug: string) => `nm_rsvp_${slug}`.slice(0, 120);
const cookiePath = (slug: string) => `/api/public/invites/${slug}/rsvp`;
const hash = (t: string) => createHash('sha256').update(t).digest('hex');

async function loadInvite(slug: string) {
  await connectDB();
  const invite = await Invite.findOne({ slug, published: true }, { _id: 1, owner: 1, events: 1, rsvpEnabled: 1, premium: 1, createdAt: 1 }).lean();
  return invite && canShare(invite) ? invite : null; // unpaid invites aren't open to guests
}

async function isOwner(ownerId: unknown) {
  const session = await getSession();
  return !!session && String(ownerId) === session.userId;
}

async function findMyRsvp(slug: string, inviteId: Types.ObjectId) {
  const token = (await cookies()).get(cookieName(slug))?.value;
  if (!token || token.length < 20) return null;
  return Rsvp.findOne({ invite: inviteId, editTokenHash: hash(token) });
}

const toInput = (r: { name: string; phone?: string; attending: boolean; guests?: number; events?: string[]; dietary?: string; message?: string }): Omit<RsvpInput, 'website'> => ({
  name: r.name, phone: r.phone ?? '', attending: r.attending, guests: Math.max(1, r.guests ?? 1),
  events: r.events ?? [], dietary: r.dietary ?? '', message: r.message ?? '',
});

// GET: what should this visitor see? { isOwner, rsvp }
export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const invite = await loadInvite(slug);
  if (!invite) return error('This invitation is no longer available', 404);

  const owner = await isOwner(invite.owner);
  const mine = owner ? null : await findMyRsvp(slug, invite._id);
  // This browser's own "I've sent shagun" report, so the form can show/edit it.
  const sKey = owner ? null : await readKey(shagunCookie(slug));
  const myShagun = sKey ? await Shagun.findOne({ invite: invite._id, source: 'guest', editTokenHash: hashKey(sKey) }).lean() : null;
  return json(
    {
      isOwner: owner,
      inviteId: owner ? String(invite._id) : undefined,
      rsvp: mine ? { ...toInput(mine), updatedAt: (mine.updatedAt as Date).toISOString() } : null,
      shagun: myShagun ? { name: myShagun.name, amount: myShagun.amount, message: myShagun.note ?? '', confirmed: !!myShagun.confirmed } : null,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}

// POST: create the guest's RSVP, or update it if this browser already responded.
export async function POST(req: Request, ctx: Ctx) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return error('Too many responses — please try again in a few minutes', 429);

  const body = await parseBody(req, rsvpSchema);
  if ('response' in body) return body.response;
  const { website, ...rsvp } = body.data;
  if (website) return json({ ok: true }); // bot filled the honeypot: pretend success

  const { slug } = await ctx.params;
  const invite = await loadInvite(slug);
  if (!invite) return error('This invitation is no longer available', 404);
  if (invite.rsvpEnabled === false) return error('This invitation isn’t taking replies online.', 403);
  if (await isOwner(invite.owner)) {
    return error('This is your own invitation. Guests reply here; you can see their replies in your guest list.', 403);
  }

  const validEvents = new Set((invite.events ?? []).map((e) => e.name));
  const data = {
    ...rsvp,
    guests: rsvp.attending ? rsvp.guests : 0,
    events: rsvp.attending ? rsvp.events.filter((e) => validEvents.has(e)) : [],
  };

  const existing = await findMyRsvp(slug, invite._id);
  if (existing) {
    existing.set(data);
    await existing.save();
    return json({ ok: true, updated: true });
  }

  const token = randomBytes(32).toString('base64url');
  await Rsvp.create({ ...data, invite: invite._id, editTokenHash: hash(token) });
  (await cookies()).set(cookieName(slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: cookiePath(slug),
    maxAge: 60 * 60 * 24 * 365,
  });
  return json({ ok: true, updated: false }, 201);
}
