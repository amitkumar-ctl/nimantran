import 'server-only';
import { randomBytes } from 'node:crypto';
import { cacheLife, cacheTag } from 'next/cache';
import { connectDB } from './db';
import { Invite } from './models/Invite';
import type { InviteData } from './types';

export const inviteTag = (slug: string) => `invite:${slug}`;

type InviteLike = Record<string, unknown> & { _id: { toString(): string }; updatedAt?: Date };

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
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

/**
 * Published invite for the public page. Cached and tagged, so guests get a
 * fast response; edits call revalidateTag(inviteTag(slug)) to refresh it.
 */
export async function getPublicInvite(slug: string): Promise<InviteData | null> {
  'use cache';
  cacheTag(inviteTag(slug));
  cacheLife('hours');

  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  await connectDB();
  const doc = await Invite.findOne({ slug, published: true }).lean();
  return doc ? toInviteData(doc as unknown as InviteLike) : null;
}

const slugify = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);

/** "aarav-weds-meera-k3x9q2": readable, but the random tail keeps it unguessable. */
export function makeSlug(p1: string, p2: string) {
  const base = [slugify(p1), slugify(p2)].filter(Boolean).join('-weds-') || 'wedding';
  const tail = randomBytes(6).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6).padEnd(6, '0');
  return `${base}-${tail}`;
}
