import type { CSSProperties } from 'react';

/*
 * Festive decorations for the marketing pages. Pure markup + CSS animations
 * (see "Festive motion" in globals.css): no JavaScript, nothing for crawlers
 * to trip over, and all of it is hidden for people who prefer reduced motion.
 */

// Fixed "random" values so server and browser render the same petals.
const PETALS = [
  [4, 14, 13, 0, 46, ''], [11, 11, 16, 3.5, -30, 'petal-rose'], [19, 16, 11, 7, 38, ''], [27, 10, 15, 1.5, -44, 'petal-leaf'],
  [34, 13, 12, 9, 30, ''], [42, 12, 17, 5, -36, 'petal-rose'], [50, 15, 14, 2.5, 52, ''], [58, 10, 12, 8, -28, ''],
  [65, 14, 16, 4, 34, 'petal-rose'], [72, 11, 13, 10, -48, 'petal-leaf'], [79, 16, 15, 6, 40, ''], [86, 12, 11, 1, -32, 'petal-rose'],
  [93, 13, 14, 7.5, 44, ''], [8, 9, 18, 11, 26, ''], [46, 9, 19, 12, -40, 'petal-leaf'], [83, 10, 18, 13, 30, ''],
] as const;

/** Marigold and rose petals drifting down behind a section (parent needs `relative overflow-hidden`). */
export function Petals({ count = PETALS.length, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {PETALS.slice(0, count).map(([x, s, dur, delay, sway, kind], i) => (
        <span
          key={i}
          className={`petal ${kind} ${i % 2 ? 'max-sm:hidden' : ''}`}
          // Negative delay = already mid-fall when the page opens (no line of petals at the top).
          style={{ '--x': `${x}%`, '--s': `${s}px`, '--dur': `${dur}s`, '--delay': `-${(delay * 1.7 + i * 0.9) % dur}s`, '--sway': `${sway}px` } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** A toran: marigold garland swags with mango leaves, gently swaying. */
export function Garland({ swags = 7, className = '' }: { swags?: number; className?: string }) {
  const w = swags * 60;
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 origin-top animate-sway ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${w} 64`} preserveAspectRatio="none" className="h-12 w-full sm:h-16">
        <path d={`M0 3 H${w}`} stroke="#8a5a05" strokeWidth="2" />
        {Array.from({ length: swags }, (_, i) => {
          const x = i * 60;
          return (
            <g key={i}>
              {/* marigold beads along the swag */}
              {Array.from({ length: 9 }, (_, k) => {
                const t = (k + 0.5) / 9;
                const bx = x + t * 60;
                const by = 4 + Math.round(Math.sin(t * Math.PI) * 26 * 100) / 100;
                return <circle key={k} cx={bx} cy={by} r={4.2} fill={k % 2 ? '#f4a024' : '#ffc23d'} stroke="#c56a0c" strokeWidth=".6" />;
              })}
              {/* hanging mango leaf + bead */}
              <path d={`M${x + 30} 30 q -6 13 0 30 q 6 -17 0 -30Z`} fill="#4f7a43" />
              <circle cx={x + 30} cy={30} r={3.4} fill="#e0607e" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** A small brass diya with a flickering flame. */
export function Diya({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g className="origin-[12px_12px] animate-flicker">
        <path d="M12 2.5c2.2 2.6 2.6 5 .9 7.1-.4.5-1.4.5-1.8 0C9.4 7.5 9.8 5.1 12 2.5Z" fill="#f4a024" />
        <path d="M12 5.2c1 1.3 1.1 2.5.4 3.4-.2.2-.6.2-.8 0-.7-.9-.6-2.1.4-3.4Z" fill="#ffe08a" />
      </g>
      <path d="M3.5 13h17c-.8 3.6-4.2 6-8.5 6s-7.7-2.4-8.5-6Z" fill="#c9a24b" />
      <path d="M8 19.5h8" stroke="#8a5a05" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
