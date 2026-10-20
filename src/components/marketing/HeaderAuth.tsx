'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';

// Reads the non-secret "nm_li" hint cookie (set at login), so logged-out
// visitors never trigger an API call. Server HTML always renders the
// logged-out buttons; marketing pages stay fully static for SEO.
const noSubscribe = () => () => {};
const useLoggedInHint = () =>
  useSyncExternalStore(noSubscribe, () => document.cookie.split('; ').includes('nm_li=1'), () => false);

function useCurrentUser() {
  const hint = useLoggedInHint();
  const { data } = useQuery({ queryKey: queryKeys.me, queryFn: api.me, enabled: hint, retry: false, staleTime: 5 * 60_000 });
  return hint ? data ?? null : null;
}

/** Right side of the marketing header. */
export function HeaderAuth() {
  const user = useCurrentUser();
  if (user) {
    return (
      <Link href="/dashboard" className="btn btn-primary btn-sm">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" width={20} height={20} referrerPolicy="no-referrer" className="h-5 w-5 rounded-full" />
        ) : (
          <LayoutDashboard className="h-4 w-4" />
        )}
        My invites
      </Link>
    );
  }
  return (
    <>
      <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">Log in</Link>
      <Link href="/signup" className="btn btn-primary btn-sm">Create free invite</Link>
    </>
  );
}

/** "Log in" chip in the mobile nav row: hidden once logged in. */
export function MobileLoginChip() {
  const user = useCurrentUser();
  if (user) return null;
  return <Link href="/login" className="chip shrink-0 bg-white text-xs sm:hidden">Log in</Link>;
}

