'use client';

import { useSyncExternalStore } from 'react';

/*
 * The family an invite link is addressed to: /i/aarav-weds-meera?to=Sharma%20Parivar
 * Read in the browser (the page itself stays cached and identical for everyone).
 */
const subscribe = () => () => {};
const read = () => {
  const to = new URLSearchParams(window.location.search).get('to')?.trim().slice(0, 40);
  return to || null;
};
const server = () => null;

export function GuestName({ fallback, className = '' }: { fallback: string; className?: string }) {
  const to = useSyncExternalStore(subscribe, read, server);
  return <span className={className}>{to ?? fallback}</span>;
}

/** Whether the link names a family (so the "With love, for" line can show). */
export function useGuestName() {
  return useSyncExternalStore(subscribe, read, server);
}
