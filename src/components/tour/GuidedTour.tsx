'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

/*
 * A small guided tour: a spotlight around one element at a time plus a card
 * explaining it. Steps point at elements by their `data-tour="…"` attribute,
 * so pages only need to tag what the tour talks about.
 *
 * - Runs once automatically (remembered per browser in localStorage).
 * - <TourButton id="…" /> replays it anytime.
 * - Steps whose element isn't on the page are skipped; `tab` switches the
 *   editor's mobile Edit/Preview tabs first (clicks [data-tour-tab="…"]).
 */

export type TourStep = {
  title: string;
  body: React.ReactNode;
  /** data-tour value of the element to highlight; omit for a centred card. */
  target?: string;
  /** On phones the editor shows one tab at a time; open this one first. */
  tab?: 'edit' | 'preview';
};

// Bump the version when tours gain steps, so returning users see them once.
const TOUR_VERSION = 2;
const doneKey = (id: string) => `nm_tour_${id}_v${TOUR_VERSION}`;
const REPLAY_EVENT = 'nm:tour';

// "Has this tour been seen?" as an external store (localStorage), so reading it
// doesn't need state-in-effect and the server always renders "seen" (no tour).
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const notify = () => listeners.forEach((cb) => cb());
function isDone(id: string) {
  try { return localStorage.getItem(doneKey(id)) === '1'; } catch { return true; }
}
function markDone(id: string) {
  try { localStorage.setItem(doneKey(id), '1'); } catch { /* private mode: tour may show again */ }
  notify();
}

/** Replay a tour from anywhere (e.g. a help button). */
export const startTour = (id: string) => window.dispatchEvent(new CustomEvent(REPLAY_EVENT, { detail: id }));

const findTarget = (name?: string) => {
  if (!name) return null;
  const all = document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`);
  return [...all].find((el) => el.getClientRects().length > 0) ?? null;
};
const openTab = (tab?: string) => {
  if (!tab) return;
  const btn = document.querySelector<HTMLElement>(`[data-tour-tab="${tab}"]`);
  if (btn && btn.getClientRects().length > 0 && btn.getAttribute('aria-selected') !== 'true') btn.click();
};

// Spotlight position: read from the DOM on scroll/resize as an external store.
function subscribeLayout(cb: () => void) {
  let raf = 0;
  const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(cb); };
  addEventListener('resize', on);
  addEventListener('scroll', on, true);
  const t = setInterval(on, 400); // content above may still be loading
  return () => { removeEventListener('resize', on); removeEventListener('scroll', on, true); clearInterval(t); cancelAnimationFrame(raf); };
}

export function GuidedTour({ id, steps, autoStart = true }: { id: string; steps: TourStep[]; autoStart?: boolean }) {
  const done = useSyncExternalStore(subscribe, () => isDone(id), () => true);
  const [replaying, setReplaying] = useState(false);
  const [closed, setClosed] = useState(false);
  const [index, setIndex] = useState(0);
  const open = replaying || (autoStart && !done && !closed);

  // Replay requests from <TourButton>.
  useEffect(() => {
    const on = (e: Event) => {
      if ((e as CustomEvent).detail !== id) return;
      setIndex(0);
      setReplaying(true);
    };
    addEventListener(REPLAY_EVENT, on);
    return () => removeEventListener(REPLAY_EVENT, on);
  }, [id]);

  // A step is shown if its element is on the page. Steps with a `tab` count
  // as present: their element appears once that tab opens (on phones).
  const usable = useCallback(
    (i: number) => {
      const s = steps[i];
      if (!s?.target) return true;
      if (s.tab && document.querySelector(`[data-tour="${s.target}"]`)) return true;
      return !!findTarget(s.target);
    },
    [steps],
  );
  const go = useCallback(
    (from: number, dir: 1 | -1) => {
      let i = from + dir;
      while (i >= 0 && i < steps.length && !usable(i)) i += dir;
      return i;
    },
    [steps.length, usable],
  );

  const finish = useCallback(() => {
    markDone(id);
    setReplaying(false);
    setClosed(true);
    setIndex(0);
  }, [id]);
  const next = useCallback(() => {
    const i = go(index, 1);
    if (i >= steps.length) finish(); else setIndex(i);
  }, [go, index, steps.length, finish]);
  const back = useCallback(() => {
    const i = go(index, -1);
    if (i >= 0) setIndex(i);
  }, [go, index]);

  const step = open ? steps[index] : undefined;

  // Bring the highlighted element into view (DOM only, no state).
  useEffect(() => {
    if (!step) return;
    openTab(step.tab);
    const el = findTarget(step.target);
    if (!el) return;
    // Tall sections (e.g. the design picker) scroll to their top, so the part
    // the step talks about is on screen; small ones are centred.
    const tall = el.getBoundingClientRect().height > innerHeight * 0.55;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: tall ? 'start' : 'center' });
  }, [step]);

  // Keyboard: → / Enter next, ← back, Esc close.
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
    };
    addEventListener('keydown', on);
    return () => removeEventListener('keydown', on);
  }, [open, next, back, finish]);

  if (!step) return null;
  return <TourCard steps={steps} index={index} usable={usable} go={go} onNext={next} onBack={back} onClose={finish} />;
}

/**
 * Numbers only the steps that will actually show (e.g. "Share" appears after
 * publishing). Read from the page after it renders, and kept up to date.
 */
function TourCard({ steps, index, usable, go, onNext, onBack, onClose }: {
  steps: TourStep[]; index: number; usable: (i: number) => boolean; go: (from: number, dir: 1 | -1) => number;
  onNext: () => void; onBack: () => void; onClose: () => void;
}) {
  const presence = useSyncExternalStore(
    subscribeLayout,
    () => steps.map((_, i) => (usable(i) ? '1' : '0')).join(''),
    () => '',
  );
  const shown = steps.map((_, i) => i).filter((i) => i === index || presence[i] === '1');
  const step = steps[index];
  return (
    <TourOverlay
      step={step}
      index={shown.indexOf(index)}
      total={shown.length}
      onNext={onNext}
      onBack={presence && go(index, -1) >= 0 ? onBack : undefined}
      onClose={onClose}
    />
  );
}

function TourOverlay({ step, index, total, onNext, onBack, onClose }: {
  step: TourStep; index: number; total: number; onNext: () => void; onBack?: () => void; onClose: () => void;
}) {
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  // "top,left,width,height" of the target (or "" when centred).
  const rectKey = useSyncExternalStore(
    subscribeLayout,
    () => {
      const el = findTarget(step.target);
      if (!el) return '';
      const r = el.getBoundingClientRect();
      return [r.top, r.left, r.width, r.height].map(Math.round).join(',');
    },
    () => '',
  );
  const vw = typeof window === 'undefined' ? 1024 : innerWidth;
  const vh = typeof window === 'undefined' ? 768 : innerHeight;
  const PAD = 8;
  const rect = rectKey ? rectKey.split(',').map(Number) : null;

  // Card placement: in whichever gap (below or above the highlighted element)
  // is bigger, anchored to that edge and never taller than the gap, so the
  // buttons are always on screen. Small gaps (tall elements): pin the card to
  // the bottom or top of the screen, away from the element's centre.
  const cardW = Math.min(360, vw - 24);
  const MARGIN = 12;
  const MIN_GAP = 220;
  let cardStyle: React.CSSProperties;
  if (!rect) {
    const t = Math.max(MARGIN, vh / 2 - 170);
    cardStyle = { left: (vw - cardW) / 2, top: t, maxHeight: vh - t - MARGIN };
  } else {
    const [top, left, w, h] = rect;
    const x = Math.min(Math.max(MARGIN, left + w / 2 - cardW / 2), vw - cardW - MARGIN);
    const belowTop = top + h + PAD + 12;
    const spaceBelow = vh - belowTop - MARGIN;
    const spaceAbove = top - PAD - 12 - MARGIN;
    const offScreen = top > vh || top + h < 0; // still scrolling to it
    if (offScreen) cardStyle = { left: x, bottom: MARGIN, maxHeight: vh * 0.6 };
    else if (spaceBelow >= MIN_GAP && spaceBelow >= spaceAbove) cardStyle = { left: x, top: belowTop, maxHeight: spaceBelow };
    else if (spaceAbove >= MIN_GAP) cardStyle = { left: x, bottom: vh - (top - PAD - 12), maxHeight: spaceAbove };
    else if (top + h / 2 < vh / 2) cardStyle = { left: x, bottom: MARGIN, maxHeight: vh * 0.6 };
    else cardStyle = { left: x, top: MARGIN, maxHeight: vh * 0.6 };
  }

  useEffect(() => { cardRef.current?.focus({ preventScroll: true }); }, [index]);

  const last = index === total - 1;
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      {/* Click-blocker (the spotlight's shadow darkens the page) */}
      <div className={`absolute inset-0 ${rect ? '' : 'bg-[rgba(30,10,6,0.62)]'}`} onClick={(e) => e.stopPropagation()} />
      {rect && (
        <div
          className="tour-spotlight"
          style={{ top: rect[0] - PAD, left: rect[1] - PAD, width: rect[2] + PAD * 2, height: rect[3] + PAD * 2 }}
          aria-hidden="true"
        />
      )}
      <div
        key={index}
        ref={cardRef}
        tabIndex={-1}
        style={{ ...cardStyle, width: cardW }}
        className="fixed z-[62] animate-pop overflow-y-auto overscroll-contain rounded-2xl border border-gold/40 bg-white p-5 shadow-2xl outline-none"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wide text-muted uppercase">Step {index + 1} of {total}</span>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm -mr-2 px-2" aria-label="Close tour"><X className="h-4 w-4" /></button>
        </div>
        <h2 id={titleId} className="font-display text-2xl leading-tight font-semibold text-maroon-900">{step.title}</h2>
        <div className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{step.body}</div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-cream-2" aria-hidden="true">
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-maroon transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
        {/* Stays visible even if the card has to scroll on a small screen. */}
        <div className="sticky -bottom-5 -mx-5 -mb-5 mt-4 flex items-center justify-between gap-2 bg-white px-5 pt-1 pb-5">
          <button type="button" onClick={onClose} className="text-sm text-muted underline-offset-2 hover:underline">{last ? '' : 'Skip tour'}</button>
          <div className="flex gap-2">
            {onBack && <button type="button" onClick={onBack} className="btn btn-outline btn-sm"><ArrowLeft className="h-4 w-4" /> Back</button>}
            <button type="button" onClick={onNext} className="btn btn-primary btn-sm">
              {last ? 'Let’s go! 🎉' : <>Next <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Take the tour" button; replays the given tour. */
export function TourButton({ id, className = 'btn btn-ghost btn-sm', children }: { id: string; className?: string; children: React.ReactNode }) {
  // aria-label: on phones the button may show only its icon.
  return <button type="button" data-tour="tour-replay" aria-label="Tour: replay the guided tour" title="Replay the guided tour" className={className} onClick={() => startTour(id)}>{children}</button>;
}
