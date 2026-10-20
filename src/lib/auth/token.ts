import { SignJWT, jwtVerify } from 'jose';

// Session token helpers with no Next.js imports, so both route handlers
// (via session.ts) and src/proxy.ts can use them.

export const SESSION_COOKIE = 'nm_session';
/** Non-secret flag (readable by JS) so the marketing header knows to show "My invites". */
export const LOGGED_IN_COOKIE = 'nm_li';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error('AUTH_SECRET must be set (32+ characters)');
  return new TextEncoder().encode(s);
}

export function signSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

/** userId if the token is genuine and not expired, otherwise null. */
export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
