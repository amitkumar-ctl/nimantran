import { revalidateTag } from 'next/cache';
import { Invite } from '@/lib/models/Invite';
import { Rsvp } from '@/lib/models/Rsvp';
import { error, json, parseBody, requireUser, sentKeysOnly, validId } from '@/lib/api-helpers';
import { inviteTag, toInviteData } from '@/lib/invites';
import { updateInviteSchema } from '@/lib/validation';

type Ctx = RouteContext<'/api/invites/[id]'>;

async function findOwned(id: string, userId: string) {
  if (!validId(id)) return null;
  return Invite.findOne({ _id: id, owner: userId });
}

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const invite = await findOwned((await ctx.params).id, auth.userId);
  if (!invite) return error('Invite not found', 404);
  return json({ invite: toInviteData(invite.toObject()) });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const body = await parseBody(req, updateInviteSchema);
  if ('response' in body) return body.response;

  const invite = await findOwned((await ctx.params).id, auth.userId);
  if (!invite) return error('Invite not found', 404);

  invite.set(sentKeysOnly(body.data, body.raw));
  await invite.save();
  // Guests see the change on their next visit (no stale copy).
  revalidateTag(inviteTag(invite.slug), { expire: 0 });
  return json({ invite: toInviteData(invite.toObject()) });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const invite = await findOwned((await ctx.params).id, auth.userId);
  if (!invite) return error('Invite not found', 404);

  await Rsvp.deleteMany({ invite: invite._id });
  await invite.deleteOne();
  revalidateTag(inviteTag(invite.slug), { expire: 0 });
  return json({ ok: true });
}
