import { isValidObjectId } from 'mongoose';
import { Shagun } from '@/lib/models/Shagun';
import { error, json, parseBody, requireUser, sentKeysOnly } from '@/lib/api-helpers';
import { findOwnedInvite, ownRsvpId, toShagunData } from '@/lib/shagun';
import { shagunUpdateSchema } from '@/lib/validation';

type Ctx = RouteContext<'/api/invites/[id]/shagun/[entryId]'>;

async function load(ctx: Ctx, userId: string) {
  const { id, entryId } = await ctx.params;
  const invite = await findOwnedInvite(id, userId);
  if (!invite || !isValidObjectId(entryId)) return null;
  const entry = await Shagun.findOne({ _id: entryId, invite: invite._id });
  return entry ? { invite, entry } : null;
}

// PATCH: confirm a guest's report, or correct name/amount/method/note.
export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const found = await load(ctx, auth.userId);
  if (!found) return error('Entry not found', 404);
  const body = await parseBody(req, shagunUpdateSchema);
  if ('response' in body) return body.response;

  const { rsvpId, ...rest } = sentKeysOnly(body.data, body.raw) as typeof body.data;
  const changes: Record<string, unknown> = { ...rest };
  if ('rsvpId' in body.raw) {
    const rsvp = await ownRsvpId(found.invite._id, rsvpId);
    if (rsvp === undefined) return error('That guest is not on this invite', 422, { rsvpId: 'Pick a guest from your list' });
    changes.rsvp = rsvp;
  }
  found.entry.set(changes);
  await found.entry.save();
  return json({ entry: toShagunData(found.entry.toObject()) });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const found = await load(ctx, auth.userId);
  if (!found) return error('Entry not found', 404);
  await found.entry.deleteOne();
  return json({ ok: true });
}
