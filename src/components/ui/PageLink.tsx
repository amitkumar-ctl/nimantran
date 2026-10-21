import type { AnchorHTMLAttributes } from 'react';

/**
 * A plain <a> for private per-invite pages (/dashboard/invites/<id>…).
 * Those ids aren't prebuilt, and on Vercel the client-side (soft) navigation
 * into them fetches route data that comes back 404, showing the 404 page.
 * A normal page load always works, and these pages fetch their own data
 * anyway, so nothing is lost.
 */
export function PageLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} />;
}

/** Same idea for code: go to a per-invite page with a normal page load. */
export const goToPage = (href: string) => window.location.assign(href);
