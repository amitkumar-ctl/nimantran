import 'server-only';
import { validId } from './api-helpers';
import { Invite } from './models/Invite';
import type { PersonalInviteData } from './types';

export const toPersonal = (d: { _id: { toString(): string }; name: string; phone?: string | null; sentAt?: Date | null; createdAt?: Date }): PersonalInviteData => ({
  id: d._id.toString(), name: d.name, phone: d.phone ?? '', sent: !!d.sentAt, createdAt: (d.createdAt ?? new Date(0)).toISOString(),
});

/** The invite's _id if this user owns it, else null. */
export async function ownedInviteId(id: string, userId: string) {
  if (!validId(id)) return null;
  return (await Invite.findOne({ _id: id, owner: userId }, { _id: 1 }).lean())?._id ?? null;
}
