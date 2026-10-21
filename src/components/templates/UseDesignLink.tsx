'use client';

import Link from 'next/link';
import { useLoggedInHint } from '@/components/marketing/HeaderAuth';

/**
 * Logged in → straight to the create form with this design picked.
 * Logged out → sign up first, then the same place. (Server HTML always has
 * the sign-up link, so the page stays static and crawlable.)
 */
export function UseDesignLink({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  const loggedIn = useLoggedInHint();
  const target = `/dashboard?template=${id}`;
  return <Link href={loggedIn ? target : `/signup?next=${encodeURIComponent(target)}`} className={className}>{children}</Link>;
}
