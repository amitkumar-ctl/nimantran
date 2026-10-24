import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';

/*
 * Each guest's browser gets a private random key per invite, stored in an
 * httpOnly cookie that is only sent to /api/public/invites/<slug>/rsvp…
 * The database keeps only its sha256, so a guest can edit their own RSVP or
 * shagun report and nobody else can.
 */
export const hashKey = (t: string) => createHash('sha256').update(t).digest('hex');
export const newKey = () => randomBytes(32).toString('base64url');
export const guestCookiePath = (slug: string) => `/api/public/invites/${slug}/rsvp`;

export const rsvpCookie = (slug: string) => `nm_rsvp_${slug}`.slice(0, 120);
export const shagunCookie = (slug: string) => `nm_shg_${slug}`.slice(0, 120);

export async function readKey(name: string) {
  const v = (await cookies()).get(name)?.value;
  return v && v.length >= 20 ? v : null;
}

export async function writeKey(name: string, slug: string, value: string) {
  (await cookies()).set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: guestCookiePath(slug),
    maxAge: 60 * 60 * 24 * 365,
  });
}

/** Simple per-instance limiter (use a shared store like Upstash with many instances). */
export function makeLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string) => {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}
