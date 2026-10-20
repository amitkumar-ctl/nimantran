import 'server-only';
import { cookies } from 'next/headers';
import { LOGGED_IN_COOKIE, SESSION_COOKIE, SESSION_MAX_AGE, signSessionToken, verifySessionToken } from './token';

export { SESSION_COOKIE };
export type Session = { userId: string };

export async function createSession(userId: string) {
  const token = await signSessionToken(userId);
  const jar = await cookies();
  const base = { secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: SESSION_MAX_AGE };

  jar.set(SESSION_COOKIE, token, {
    ...base,
    httpOnly: true, // the real session: not readable from JavaScript (XSS-safe)
  });
  // Just a hint for the UI ("show My invites"); grants no access by itself.
  jar.set(LOGGED_IN_COOKIE, '1', { ...base, httpOnly: false });
}

export async function getSession(): Promise<Session | null> {
  const userId = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  return userId ? { userId } : null;
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(LOGGED_IN_COOKIE);
}
