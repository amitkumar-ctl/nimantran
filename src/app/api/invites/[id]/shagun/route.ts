import { Shagun } from '@/lib/models/Shagun';
import { error, json, parseBody, requireUser } from '@/lib/api-helpers';
import { csvResponse, findOwnedInvite, ownRsvpId, toShagunData } from '@/lib/shagun';
import { shagunEntrySchema } from '@/lib/validation';

type Ctx = RouteContext<'/api/invites/[id]/shagun'>;

const METHOD = { upi: 'UPI', cash: 'Cash', gift: 'Gift', other: 'Other' } as const;

// GET /api/invites/:id/shagun            → the shagun register (JSON)
// GET /api/invites/:id/shagun?format=csv → downloadable register
export async function GET(req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const invite = await findOwnedInvite((await ctx.params).id, auth.userId);
  if (!invite) return error('Invite not found', 404);

  const entries = (await Shagun.find({ invite: invite._id }).sort({ createdAt: -1 }).lean()).map(toShagunData);
  if (new URL(req.url).searchParams.get('format') === 'csv') {
    const total = (ok: boolean) => entries.filter((e) => e.confirmed === ok).reduce((n, e) => n + e.amount, 0);
    return csvResponse(
      [
        ['Name', 'Amount (₹)', 'How', 'Status', 'Added by', 'Note', 'Date'],
        ...entries.map((e) => [e.name, e.amount, METHOD[e.method], e.confirmed ? 'Received' : 'Reported by guest, not checked', e.source === 'guest' ? 'Guest' : 'You', e.note, e.createdAt.slice(0, 10)]),
        [],
        ['Total received', total(true)],
        ['Reported, not checked yet', total(false)],
      ],
      `shagun-${invite.slug}.csv`,
    );
  }
  return json({ entries });
}

// POST: the couple records a shagun (e.g. a cash envelope at the wedding).
export async function POST(req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const invite = await findOwnedInvite((await ctx.params).id, auth.userId);
  if (!invite) return error('Invite not found', 404);
  const body = await parseBody(req, shagunEntrySchema);
  if ('response' in body) return body.response;

  const rsvp = await ownRsvpId(invite._id, body.data.rsvpId);
  if (rsvp === undefined) return error('That guest is not on this invite', 422, { rsvpId: 'Pick a guest from your list' });
  const doc = await Shagun.create({
    invite: invite._id, name: body.data.name, amount: body.data.amount, method: body.data.method, note: body.data.note,
    source: 'host', confirmed: body.data.confirmed ?? true, rsvp,
  });
  return json({ entry: toShagunData(doc.toObject()) }, 201);
}
