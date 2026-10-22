'use client';

import { useEffect, useState } from 'react';
import { getTemplate } from '@/lib/themes';
import { PhonePreview } from './PhonePreview';

const SHOWCASE = ['royal', 'marigold', 'kasavu', 'midnight', 'mughal', 'blush', 'peacock', 'sunset'] as const;
const EVERY_MS = 3800;

/** The hero phone: floats gently and flips through designs every few seconds. */
export function HeroPhone({ total }: { total: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % SHOWCASE.length);
    }, EVERY_MS);
    return () => clearInterval(t);
  }, [paused]);

  const theme = SHOWCASE[i];
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="animate-float">
        {/* key → remount → crossfade into the next design */}
        <div key={theme} className="animate-crossfade">
          <PhonePreview theme={theme} />
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center gap-2">
        <p className="text-sm font-semibold text-maroon-900" aria-live="polite">
          {getTemplate(theme).name} <span className="font-normal text-muted">· one of {total}+ designs</span>
        </p>
        <div className="flex gap-1.5" role="tablist" aria-label="Preview designs">
          {SHOWCASE.map((t, k) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={getTemplate(t).name}
              onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-maroon' : 'w-2 bg-line hover:bg-gold'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
