'use client';

import { useEffect } from 'react';

/**
 * Fades elements marked `data-reveal` up into view as they scroll in.
 * Render once per page. The HTML stays fully visible without JavaScript
 * (and for crawlers); only the browser "arms" the effect. Optional
 * `data-reveal-delay="120"` staggers items in a grid.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    for (const el of els) {
      // Already on screen at load: leave it alone (no flash).
      if (el.getBoundingClientRect().top < innerHeight * 0.9) continue;
      const d = el.dataset.revealDelay;
      if (d) el.style.setProperty('--reveal-delay', `${d}ms`);
      el.classList.add('reveal-armed');
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
