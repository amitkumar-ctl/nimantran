import { connectDB } from '@/lib/db';
import { canShare } from '@/lib/payments/config';
import { Invite } from '@/lib/models/Invite';
import { Rsvp } from '@/lib/models/Rsvp';
import { Shagun } from '@/lib/models/Shagun';
import { getSession } from '@/lib/auth/session';
import { error, json, parseBody } from '@/lib/api-helpers';
import { hashKey, makeLimiter, newKey, readKey, rsvpCookie, shagunCookie, writeKey } from '@/lib/guest-keys';
import { shagunReportSchema } from '@/lib/validation';

// Lives under …/rsvp so the guest's RSVP cookie (path-scoped) is sent here too,
// which links the report to their RSVP.
type Ctx = RouteContext<'/api/public/invites/[slug]/rsvp/shagun'>;

const limited = makeLimiter(10, 10 * 60_000);

// POST: a guest says "I've sent shagun". Creates their report, or updates it
// if this browser already reported (so they can correct the amount).
export async function POST(req: Request, ctx: Ctx) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return error('Too many requests — please try again in a few minutes', 429);

  const body = await parseBody(req, shagunReportSchema);
  if ('response' in body) return body.response;
  const { website, name, amount, message } = body.data;
  if (website) return json({ ok: true }); // bot

  const { slug } = await ctx.params;
  await connectDB();
  const found = await Invite.findOne({ slug, published: true }, { _id: 1, owner: 1, premium: 1, createdAt: 1 }).lean();
  const invite = found && canShare(found) ? found : null; // unpaid invites aren't open to guests
  if (!invite) return error('This invitation is no longer available', 404);
  const session = await getSession();
  if (session && String(invite.owner) === session.userId) {
    return error('This is your own invitation. Record shagun you received in your guest list.', 403);
  }

  const key = await readKey(shagunCookie(slug));
  const existing = key ? await Shagun.findOne({ invite: invite._id, source: 'guest', editTokenHash: hashKey(key) }) : null;
  if (existing) {
    const changed = existing.amount !== amount;
    existing.set({ name, amount, note: message, ...(changed ? { confirmed: false } : {}) });
    await existing.save();
    return json({ ok: true, updated: true, shagun: { name, amount, message, confirmed: existing.confirmed } });
  }

  const rsvpKey = await readKey(rsvpCookie(slug));
  const rsvp = rsvpKey ? await Rsvp.findOne({ invite: invite._id, editTokenHash: hashKey(rsvpKey) }, { _id: 1 }).lean() : null;
  const token = newKey();
  await Shagun.create({
    invite: invite._id, name, amount, note: message, method: 'upi', source: 'guest', confirmed: false,
    rsvp: rsvp?._id ?? null, editTokenHash: hashKey(token),
  });
  await writeKey(shagunCookie(slug), slug, token);
  return json({ ok: true, updated: false, shagun: { name, amount, message, confirmed: false } }, 201);
}
