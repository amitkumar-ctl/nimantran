import 'server-only';
import { randomBytes } from 'node:crypto';
import { cacheLife, cacheTag } from 'next/cache';
import { connectDB } from './db';
import { Invite } from './models/Invite';
import type { InviteData } from './types';
import { canShare } from './payments/config';

export const inviteTag = (slug: string) => `invite:${slug}`;

type InviteLike = Record<string, unknown> & { _id: { toString(): string }; updatedAt?: Date; createdAt?: Date };

/** Mongoose document/lean object → plain serialisable InviteData. */
export function toInviteData(doc: InviteLike): InviteData {
  const d = doc as unknown as InviteData & { _id: { toString(): string }; updatedAt?: Date };
  return {
    id: doc._id.toString(),
    slug: d.slug,
    published: Boolean(d.published),
    theme: d.theme,
    partner1: d.partner1,
    partner2: d.partner2,
    blessing: d.blessing ?? '',
    message: d.message ?? '',
    weddingDate: d.weddingDate,
    weddingTime: d.weddingTime ?? '18:00',
    city: d.city ?? '',
    venue: d.venue ?? '',
    events: (d.events ?? []).map((e) => ({
      id: e.id, name: e.name, emoji: e.emoji ?? '✨', date: e.date, time: e.time ?? '',
      venue: e.venue ?? '', mapUrl: e.mapUrl ?? '', note: e.note ?? '',
    })),
    rsvpDeadline: d.rsvpDeadline ?? '',
    upiId: d.upiId ?? '',
    upiName: d.upiName ?? '',
    rsvpEnabled: d.rsvpEnabled !== false,
    premium: d.premium === true,
    customSlug: d.customSlug ?? '',
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    createdAt: (doc.createdAt ?? new Date(0)).toISOString(),
  };
}

/**
 * Published invite for the public page. Cached and tagged, so guests get a
 * fast response; edits call revalidateTag(inviteTag(slug)) to refresh it.
 */
export async function getPublicInvite(slug: string): Promise<InviteData | null> {
  const invite = await loadPublishedInvite(slug);
  // Checked per request (not cached): unpaid invites can't be opened while payments are on.
  return invite && canShare(invite) ? invite : null;
}

async function loadPublishedInvite(slug: string): Promise<InviteData | null> {
  'use cache';
  cacheTag(inviteTag(slug));
  cacheLife('hours');

  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  await connectDB();
  // Either the permanent link or the Premium short name.
  const doc = await Invite.findOne({ $or: [{ slug }, { customSlug: slug }], published: true }).lean();
  if (!doc) return null;
  // Tagged with both names, so an edit (which revalidates the permanent slug) refreshes this copy too.
  cacheTag(inviteTag(doc.slug));
  if (doc.customSlug) cacheTag(inviteTag(doc.customSlug));
  return toInviteData(doc as unknown as InviteLike);
}

const slugify = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);

/** "aarav-weds-meera-k3x9q2": readable, but the random tail keeps it unguessable. */
export function makeSlug(p1: string, p2: string) {
  const base = [slugify(p1), slugify(p2)].filter(Boolean).join('-weds-') || 'wedding';
  const tail = randomBytes(6).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6).padEnd(6, '0');
  return `${base}-${tail}`;
}
