'use client';

import { useSyncExternalStore } from 'react';
import { weddingTimestamp } from '@/lib/format';

const UNITS = [
  ['Days', 86_400_000],
  ['Hrs', 3_600_000],
  ['Min', 60_000],
  ['Sec', 1000],
] as const;

// A once-per-second clock shared by every Countdown on the page.
function subscribe(onTick: () => void) {
  const t = setInterval(onTick, 1000);
  return () => clearInterval(t);
}
const getNow = () => Math.floor(Date.now() / 1000) * 1000;
const getServerNow = () => null; // server HTML and hydration show "–" placeholders

export function Countdown({ date, time }: { date: string; time: string }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const target = weddingTimestamp(date, time);
  const left = now === null ? 0 : Math.max(0, target - now);

  if (now !== null && left === 0) {
    return <p className="mt-8 font-display text-2xl italic text-inv-accent">Just married ♥</p>;
  }

  return (
    <div className="mt-6 flex gap-2.5 sm:mt-8 sm:gap-3" role="timer" aria-label="Time until the wedding">
      {UNITS.map(([label, ms], i) => {
        const bigger = i === 0 ? Infinity : UNITS[i - 1][1];
        const value = Math.floor((left % bigger) / ms);
        return (
          <div key={label} className="w-16 rounded-xl border border-inv-accent/50 bg-inv-chip py-2.5 text-center sm:w-20">
            <b className="block font-display text-[28px] font-semibold leading-tight text-inv-accent tabular-nums sm:text-3xl">
              {now === null ? '–' : String(value).padStart(2, '0')}
            </b>
            <span className="text-[10px] uppercase tracking-[0.14em] opacity-80">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
