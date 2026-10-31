import { error, json, parseBody, requireUser, sentKeysOnly, validId } from '@/lib/api-helpers';
import { PersonalInvite } from '@/lib/models/PersonalInvite';
import { personalUpdateSchema } from '@/lib/validation';
import { ownedInviteId, toPersonal } from '@/lib/personal';

type Ctx = RouteContext<'/api/invites/[id]/personal/[pid]'>;

async function load(ctx: Ctx, userId: string) {
  const { id, pid } = await ctx.params;
  const inviteId = await ownedInviteId(id, userId);
  if (!inviteId || !validId(pid)) return null;
  return PersonalInvite.findOne({ _id: pid, invite: inviteId });
}

// PATCH: rename, change phone, or mark as sent / not sent
export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const body = await parseBody(req, personalUpdateSchema);
  if ('response' in body) return body.response;
  const doc = await load(ctx, auth.userId);
  if (!doc) return error('Not found', 404);
  const { sent, ...rest } = sentKeysOnly(body.data, body.raw);
  doc.set(rest);
  if (sent !== undefined) doc.sentAt = sent ? (doc.sentAt ?? new Date()) : null;
  await doc.save();
  return json({ family: toPersonal(doc.toObject()) });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const doc = await load(ctx, auth.userId);
  if (!doc) return error('Not found', 404);
  await doc.deleteOne();
  return json({ ok: true });
}
