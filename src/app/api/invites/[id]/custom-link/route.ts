import { revalidateTag } from 'next/cache';
import { error, json, parseBody, requireUser, validId } from '@/lib/api-helpers';
import { Invite } from '@/lib/models/Invite';
import { inviteTag, toInviteData } from '@/lib/invites';
import { customLinkSchema } from '@/lib/validation';
import { customSlugProblem } from '@/lib/links';

// PUT /api/invites/:id/custom-link { customSlug } → Premium short link (getnimantran.com/<name>).
// The old link keeps working; changing the name later frees the previous one.
export async function PUT(req: Request, ctx: RouteContext<'/api/invites/[id]/custom-link'>) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const body = await parseBody(req, customLinkSchema);
  if ('response' in body) return body.response;
  const { id } = await ctx.params;
  if (!validId(id)) return error('Invite not found', 404);
  const invite = await Invite.findOne({ _id: id, owner: auth.userId });
  if (!invite) return error('Invite not found', 404);
  if (!invite.premium) return error('Your own link comes with Premium.', 402);

  const name = body.data.customSlug;
  const problem = customSlugProblem(name);
  if (problem) return error(problem, 422, { customSlug: problem });
  if (name === invite.customSlug) return json({ invite: toInviteData(invite.toObject()) });
  const taken = await Invite.exists({ _id: { $ne: invite._id }, $or: [{ slug: name }, { customSlug: name }] });
  if (taken) return error('Someone already has that link. Try adding a year or a place, like amit-nikita-2026.', 409, { customSlug: 'That link is taken' });

  const previous = invite.customSlug;
  invite.customSlug = name;
  try {
    await invite.save();
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return error('Someone just took that link. Please try another.', 409, { customSlug: 'That link is taken' });
    throw e;
  }
  for (const s of [invite.slug, name, previous]) if (s) revalidateTag(inviteTag(s), { expire: 0 });
  return json({ invite: toInviteData(invite.toObject()) });
}
