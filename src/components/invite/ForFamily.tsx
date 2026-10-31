'use client';

import { useGuestName } from './styles/GuestName';

/**
 * "Specially for The Sharma Parivar": shown at the top of the invite when it
 * is opened from a family's personal link (?to=…). The page itself stays the
 * same cached page for everyone; the name is read in the browser.
 */
export function ForFamily() {
  const name = useGuestName();
  if (!name) return null;
  return (
    <div className="relative z-20 flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5 border-b border-inv-accent/30 bg-inv-surface px-4 py-2.5 text-center">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">Specially for</span>
      <span className="font-script text-[26px] leading-tight text-inv-primary">{name}</span>
    </div>
  );
}
