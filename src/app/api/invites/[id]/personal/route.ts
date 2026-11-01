import { error, json, parseBody, requireUser } from '@/lib/api-helpers';
import { ownedInviteId, toPersonal } from '@/lib/personal';
import { PersonalInvite } from '@/lib/models/PersonalInvite';
import { personalAddSchema } from '@/lib/validation';
import { Invite } from '@/lib/models/Invite';
import { hasPerks } from '@/lib/payments/config';
import { FREE_FAMILY_CARDS } from '@/lib/payments/plan';

type Ctx = RouteContext<'/api/invites/[id]/personal'>;
const MAX = 1000;

// GET: every family invited personally
export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const inviteId = await ownedInviteId((await ctx.params).id, auth.userId);
  if (!inviteId) return error('Invite not found', 404);
  const docs = await PersonalInvite.find({ invite: inviteId }).sort({ createdAt: 1 }).lean();
  return json({ families: docs.map(toPersonal) });
}

// POST: add one or many families (names already on the list are skipped)
export async function POST(req: Request, ctx: Ctx) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const body = await parseBody(req, personalAddSchema);
  if ('response' in body) return body.response;
  const inviteId = await ownedInviteId((await ctx.params).id, auth.userId);
  if (!inviteId) return error('Invite not found', 404);

  const existing = await PersonalInvite.find({ invite: inviteId }, { name: 1 }).lean();
  if (existing.length + body.data.entries.length > MAX) return error(`You can invite up to ${MAX} families personally.`, 422);
  const seen = new Set(existing.map((e) => e.name.toLowerCase()));
  const fresh = body.data.entries.filter((e) => !seen.has(e.name.toLowerCase()) && seen.add(e.name.toLowerCase()));
  // Free invites get a few family cards; Premium is unlimited.
  if (fresh.length && existing.length + fresh.length > FREE_FAMILY_CARDS && !hasPerks((await Invite.findById(inviteId, { premium: 1, createdAt: 1 }).lean()) ?? {})) {
    const left = Math.max(0, FREE_FAMILY_CARDS - existing.length);
    return error(
      left ? `Free invites include ${FREE_FAMILY_CARDS} family cards, so you can add ${left} more. Upgrade to Premium for unlimited cards.` : `You've used all ${FREE_FAMILY_CARDS} free family cards. Upgrade to Premium for unlimited cards.`,
      402,
    );
  }
  const docs = fresh.length ? await PersonalInvite.insertMany(fresh.map((e) => ({ ...e, invite: inviteId }))) : [];
  return json({ added: docs.map((d) => toPersonal(d.toObject())), skipped: body.data.entries.length - fresh.length }, 201);
}
