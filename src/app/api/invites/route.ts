import { Types } from 'mongoose';
import { Invite } from '@/lib/models/Invite';
import { Rsvp } from '@/lib/models/Rsvp';
import { json, parseBody, requireUser } from '@/lib/api-helpers';
import { makeSlug, toInviteData } from '@/lib/invites';
import { createInviteSchema } from '@/lib/validation';
import { sampleInvite } from '@/lib/sample';
import type { InviteSummary } from '@/lib/types';

// GET /api/invites: the logged-in couple's invites with RSVP counts
export async function GET() {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const invites = await Invite.find({ owner: auth.userId }).sort({ updatedAt: -1 }).lean();
  const ids = invites.map((i) => i._id);
  const counts = new Map<string, number>();
  for (const r of await Rsvp.find({ invite: { $in: ids } }, { invite: 1 }).lean()) {
    const k = r.invite.toString();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  const data: InviteSummary[] = invites.map((i) => ({
    id: i._id.toString(), slug: i.slug, published: i.published, partner1: i.partner1, partner2: i.partner2,
    weddingDate: i.weddingDate, theme: i.theme as InviteSummary['theme'], updatedAt: (i.updatedAt as Date).toISOString(),
    rsvpCount: counts.get(i._id.toString()) ?? 0,
  }));
  return json({ invites: data });
}

// POST /api/invites: create a draft pre-filled with sample functions
export async function POST(req: Request) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const body = await parseBody(req, createInviteSchema);
  if ('response' in body) return body.response;

  const { partner1, partner2, weddingDate, theme } = body.data;
  const sample = sampleInvite(theme);
  // Shift the sample functions so they lead up to the chosen wedding date.
  const base = Date.parse(`${sample.weddingDate}T00:00:00Z`);
  const target = Date.parse(`${weddingDate}T00:00:00Z`);
  const shift = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) - base + target).toISOString().slice(0, 10);

  const invite = await Invite.create({
    owner: new Types.ObjectId(auth.userId),
    slug: makeSlug(partner1, partner2),
    theme, partner1, partner2, weddingDate,
    blessing: sample.blessing, // design-appropriate default (e.g. "Nikah Mubarak")
    message: sample.message,
    // Ceremonies typical for the design's tradition (Nikah/Walima, Muhurtham…)
    events: sample.events.map((e) => ({ ...e, date: shift(e.date), venue: '', note: '' })),
  });
  return json({ invite: toInviteData(invite.toObject()) }, 201);
}
