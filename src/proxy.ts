import { NextResponse, type NextRequest } from 'next/server';
import { LOGGED_IN_COOKIE, SESSION_COOKIE, verifySessionToken } from '@/lib/auth/token';
import { shortLinkTarget } from '@/lib/short-link';

// Runs before /dashboard, /login and /signup render.
// - Logged out (or expired session) on /dashboard → send to /login.
// - Logged in on /login or /signup → send to /dashboard (or the ?next page).
// The session is verified here, so an expired cookie can never cause a
// redirect loop; every API route still checks the session itself.
// Also: getnimantran.com/<name> (a Premium short link) → /i/<name>, keeping
// ?to=Family. A temporary redirect, so renaming the link is never stuck in caches.
export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (!pathname.startsWith('/dashboard') && pathname !== '/login' && pathname !== '/signup') {
    const target = await shortLinkTarget(pathname.slice(1)).catch(() => null);
    if (!target) return NextResponse.next(); // a normal page, or the 404 page
    const url = new URL(target, req.url);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url, 307);
  }
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const userId = await verifySessionToken(raw);
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (userId && isAuthPage) {
    const next = searchParams.get('next');
    const safe = next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/dashboard';
    return NextResponse.redirect(new URL(safe, req.url));
  }

  if (!userId && pathname.startsWith('/dashboard')) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname + req.nextUrl.search); // keep e.g. ?template=
    const res = NextResponse.redirect(url);
    if (raw) clearSession(res); // expired or tampered: clean up
    return res;
  }

  const res = NextResponse.next();
  if (!userId && (raw || req.cookies.has(LOGGED_IN_COOKIE))) clearSession(res);
  return res;
}

function clearSession(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(LOGGED_IN_COOKIE);
}

// '/:short' matches one path segment only (never '/', '/i/…' or files deeper down).
export const config = { matcher: ['/dashboard/:path*', '/login', '/signup', '/:short'] };
