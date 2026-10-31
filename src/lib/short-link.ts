import 'server-only';
import { connectDB } from './db';
import { Invite } from './models/Invite';
import { customSlugProblem } from './links';

/**
 * getnimantran.com/<name> → "/i/<name>" if it's a Premium short link of a
 * published invite, else null. Called from the proxy, so the guest (and
 * WhatsApp's link preview) gets a real redirect before any page renders.
 * Names of the site's own pages are reserved, so they never reach the database.
 */
export async function shortLinkTarget(segment: string): Promise<string | null> {
  let name: string;
  try {
    name = decodeURIComponent(segment).toLowerCase();
  } catch {
    return null;
  }
  if (customSlugProblem(name)) return null;
  await connectDB();
  const hit = await Invite.exists({ customSlug: name, published: true });
  return hit ? `/i/${name}` : null;
}
