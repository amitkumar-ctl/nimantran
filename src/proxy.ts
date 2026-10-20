import { NextResponse, type NextRequest } from 'next/server';

// Optimistic check only: no cookie → send to login. Every API route still
// verifies the session itself, so a forged cookie gets nothing.
export function proxy(req: NextRequest) {
  if (!req.cookies.has('nm_session')) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
