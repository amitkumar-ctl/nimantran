import 'server-only';
import { isValidObjectId, Types } from 'mongoose';
import { Invite } from './models/Invite';
import { Rsvp } from './models/Rsvp';
import type { ShagunDoc } from './models/Shagun';
import type { ShagunData } from './types';

/** The invite, if it belongs to this user. */
export function findOwnedInvite(id: string, userId: string) {
  if (!isValidObjectId(id)) return null;
  return Invite.findOne({ _id: id, owner: userId }, { _id: 1, slug: 1, partner1: 1, partner2: 1 }).lean();
}

/** An RSVP id from the client is only accepted if it belongs to this invite. */
export async function ownRsvpId(inviteId: Types.ObjectId, rsvpId: string | null | undefined) {
  if (!rsvpId) return null;
  if (!isValidObjectId(rsvpId)) return undefined;
  const r = await Rsvp.findOne({ _id: rsvpId, invite: inviteId }, { _id: 1 }).lean();
  return r ? r._id : undefined; // undefined = invalid
}

export const toShagunData = (s: ShagunDoc & { _id: Types.ObjectId; createdAt?: Date }): ShagunData => ({
  id: s._id.toString(),
  name: s.name,
  amount: s.amount,
  method: (s.method ?? 'upi') as ShagunData['method'],
  note: s.note ?? '',
  source: s.source as ShagunData['source'],
  confirmed: !!s.confirmed,
  rsvpId: s.rsvp ? s.rsvp.toString() : null,
  createdAt: (s.createdAt ?? new Date()).toISOString(),
});

// Spreadsheet apps run cells starting with = + - @ as formulas: prefix them.
export const csvCell = (v: unknown) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s-]+$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};
export const csvResponse = (rows: unknown[][], filename: string) =>
  new Response('﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` },
  });
