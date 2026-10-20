import { Invite } from '@/lib/models/Invite';
import { Rsvp } from '@/lib/models/Rsvp';
import { error, json, requireUser, validId } from '@/lib/api-helpers';
import type { RsvpData } from '@/lib/types';

// Spreadsheet apps execute cells starting with = + - @ as formulas, so
// prefix them (CSV injection protection).
const csvCell = (v: unknown) => {
  let s = String(v ?? '');
  // (A phone number like "+91 98…" is safe and left as-is.)
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s-]+$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

// GET /api/invites/:id/rsvps        → JSON list
// GET /api/invites/:id/rsvps?format=csv → downloadable guest list
export async function GET(req: Request, ctx: RouteContext<'/api/invites/[id]/rsvps'>) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const { id } = await ctx.params;
  if (!validId(id)) return error('Invite not found', 404);

  const invite = await Invite.findOne({ _id: id, owner: auth.userId }, { slug: 1, partner1: 1, partner2: 1 }).lean();
  if (!invite) return error('Invite not found', 404);

  const rows = await Rsvp.find({ invite: invite._id }).sort({ createdAt: -1 }).lean();
  const rsvps: RsvpData[] = rows.map((r) => ({
    id: r._id.toString(), name: r.name, phone: r.phone ?? '', attending: r.attending, guests: r.guests ?? 1,
    events: r.events ?? [], dietary: r.dietary ?? '', message: r.message ?? '', createdAt: (r.createdAt as Date).toISOString(),
  }));

  if (new URL(req.url).searchParams.get('format') === 'csv') {
    const header = ['Name', 'Phone', 'Attending', 'Guests', 'Functions', 'Dietary needs', 'Message', 'Responded at'];
    const lines = rsvps.map((r) =>
      [r.name, r.phone, r.attending ? 'Yes' : 'No', r.attending ? r.guests : 0, r.events.join(', '), r.dietary, r.message, r.createdAt].map(csvCell).join(','),
    );
    const csv = '﻿' + [header.map(csvCell).join(','), ...lines].join('\r\n'); // BOM so Excel reads Hindi names
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="guest-list-${invite.slug}.csv"`,
      },
    });
  }
  return json({ rsvps });
}
