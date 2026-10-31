import { Countdown } from '../Countdown';
import { colorsOf, EventActions, fit, NativeLine, nameTier, SaveAll, ScriptText, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Mehfil: Art Deco evening. A radiating sunburst inside a stepped gold
 * frame, theatrical capitals; every function is an entry-pass ticket.
 */

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WD = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const bits = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return { d: d || 1, m: m || 1, y, mon: MON[(m || 1) - 1], wd: WD[new Date(Date.UTC(y, (m || 1) - 1, d || 1)).getUTCDay()] };
};

/** Sunburst rising over a horizon line (320 × 170). */
function Sunburst({ gold, className = '' }: { gold: string; className?: string }) {
  const rays = Array.from({ length: 23 }, (_, i) => (Math.PI * (i + 1)) / 24);
  return (
    <svg viewBox="0 0 320 170" className={className} aria-hidden="true">
      <g stroke={gold} strokeWidth="1.4">
        {rays.map((a, i) => {
          const long = i % 2 === 0;
          const r1 = 88, r2 = long ? 158 : 128;
          return <line key={i} x1={Math.round(160 - Math.cos(a) * r1)} y1={Math.round(168 - Math.sin(a) * r1)} x2={Math.round(160 - Math.cos(a) * r2)} y2={Math.round(168 - Math.sin(a) * r2)} />;
        })}
      </g>
      <path d="M78 168A82 82 0 0 1 242 168" fill="none" stroke={gold} strokeWidth="2" />
      <path d="M102 168A58 58 0 0 1 218 168" fill="none" stroke={gold} strokeWidth="1.4" />
      <path d="M128 168A32 32 0 0 1 192 168Z" fill={gold} />
      <line x1="0" x2="320" y1="168.5" y2="168.5" stroke={gold} strokeWidth="1.4" />
    </svg>
  );
}

function Hero({ invite, design, framed, H1 }: StyleProps) {
  const c = colorsOf(design);
  const d = bits(invite.weddingDate);
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = (framed
    ? ['text-[50px]', 'text-[40px]', 'text-[32px]', 'text-[26px]']
    : ['text-[50px] sm:text-[78px]', 'text-[40px] sm:text-[64px]', 'text-[32px] sm:text-[52px]', 'text-[26px] sm:text-[42px]'])[tier];
  return (
    <header className={`relative flex flex-col items-center overflow-hidden bg-inv-hero-via text-center text-inv-hero-text ${framed ? 'min-h-[640px]' : 'min-h-dvh'}`}>
      {/* Stepped double frame */}
      <div className="pointer-events-none absolute inset-4 border-[1.5px] border-inv-accent sm:inset-6" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-[26px] border border-inv-accent/50 sm:inset-[34px]" aria-hidden="true" />
      <svg viewBox="0 0 220 34" className="absolute top-2 left-1/2 w-[180px] -translate-x-1/2 sm:top-4 sm:w-[220px]" aria-hidden="true">
        <rect x="6" y="6" width="208" height="28" fill={c.heroVia} />
        <path d="M0 10H40V2H180V10H220" fill="none" stroke={c.accent} strokeWidth="1.5" />
        <path d="M14 18H52V10H168V18H206" fill="none" stroke={c.accent} strokeOpacity=".5" strokeWidth="1" />
      </svg>
      <Sunburst gold={c.accent} className={`relative mt-14 w-[min(76%,340px)] ${framed ? '' : 'sm:mt-20'}`} />
      <div className={`relative z-10 flex w-full max-w-xl flex-1 flex-col items-center px-10 ${framed ? 'pt-8 pb-16' : 'pt-10 pb-20'}`}>
        {invite.blessing && <ScriptText text={invite.blessing} className="text-lg text-inv-accent" latinClass="font-poiret text-sm tracking-[0.35em] uppercase" />}
        {invite.message && <p className="mt-3 max-w-xs font-poiret text-[15px] leading-relaxed opacity-80">{invite.message}</p>}
        <H1 className={`mt-4 font-limelight leading-[1.05] text-inv-accent uppercase ${size}`}>
          <span className="block break-words">{invite.partner1}</span>
          <span className="my-1 block font-poiret text-[0.5em] normal-case">and</span>
          <span className="block break-words">{invite.partner2}</span>
        </H1>
        <p className="mt-5 font-poiret text-[22px] tracking-[0.3em] whitespace-nowrap">
          <time dateTime={invite.weddingDate}>{String(d.d).padStart(2, '0')} . {String(d.m).padStart(2, '0')} . {d.y}</time>
        </p>
        {(invite.venue || invite.city) && <p className="mt-1 font-poiret text-sm tracking-[0.18em] text-inv-accent uppercase">{invite.venue || invite.city}</p>}
        <Countdown date={invite.weddingDate} time={invite.weddingTime} compact={framed} className="mt-6 max-w-[280px]" />
        <a href="#celebrations" className="mt-8 px-9 py-3.5 font-poiret text-base font-bold tracking-[0.3em] text-inv-hero-via transition hover:brightness-110" style={{ background: c.accent, clipPath: 'polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)' }}>
          YOUR PASSES
        </a>
      </div>
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const c = colorsOf(design);
  return (
    <section id="celebrations" className="bg-inv-hero-via px-5 py-16 text-inv-hero-text sm:py-20">
      <div className="mx-auto max-w-xl">
        <H2 className="text-center font-limelight text-[44px] leading-none" style={{ color: c.alt }}>The Programme</H2>
        <p className="mt-3 text-center font-poiret text-sm tracking-[0.4em] text-inv-accent uppercase">Admit your family</p>
        <NativeLine design={design} kind="events" className="mt-2 text-center text-lg text-inv-accent" />
        <SaveAll invite={invite} link={link} framed={framed} className="mt-5 mb-8" />
        <ol className="space-y-4">
          {invite.events.map((ev) => {
            const d = bits(ev.date);
            return (
              <li key={ev.id} className="relative flex rounded-lg" style={{ background: c.alt, color: c.heroVia }}>
                <div className="min-w-0 flex-1 px-5 py-4">
                  <H3 className="font-limelight text-[24px] leading-tight">{ev.name}</H3>
                  {ev.venue && <p className="font-poiret text-[15px] font-bold">{ev.venue}</p>}
                  {ev.note && <p className="font-poiret text-[13px] font-bold opacity-75">{ev.note}</p>}
                  <EventActions ev={ev} invite={invite} link={link} framed={framed} className="mt-3" />
                </div>
                <div className="relative flex w-[104px] flex-none flex-col items-center justify-center border-l-2 border-dashed px-2 py-4 text-center" style={{ borderColor: `color-mix(in srgb, ${c.heroVia} 35%, transparent)` }}>
                  <span className="absolute -top-2.5 -left-[11px] h-5 w-5 rounded-full bg-inv-hero-via" aria-hidden="true" />
                  <span className="absolute -bottom-2.5 -left-[11px] h-5 w-5 rounded-full bg-inv-hero-via" aria-hidden="true" />
                  <span className="font-poiret text-sm font-bold">{d.wd}</span>
                  <time dateTime={ev.date} className="font-limelight text-[34px] leading-none">{d.d}</time>
                  <span className="mt-1 font-poiret text-[13px] font-bold whitespace-nowrap">{d.mon}{ev.time && <> · {ev.time.replace(':00', '')}</>}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Swatch({ design, names: [a, b], blessing, size }: SwatchProps) {
  const c = colorsOf(design);
  return (
    <SwatchSvg size={size} band={140}>
      <rect width="400" height="500" fill={c.heroVia} />
      <rect x="16" y="16" width="368" height="468" fill="none" stroke={c.accent} strokeWidth="2" />
      <rect x="28" y="28" width="344" height="444" fill="none" stroke={c.accent} strokeOpacity=".5" />
      <svg x="80" y="34" width="240" height="128" viewBox="0 0 320 170"><Sunburst gold={c.accent} /></svg>
      <SvgScript text={blessing} y={198} size={18} fill={c.accent} latinFont={SVG_FONT.poiret} lang={design.lang} width={260} />
      <g style={{ fontFamily: SVG_FONT.limelight }} fill={c.accent} textAnchor="middle">
        <text x="200" y="262" fontSize={fit(a, 50, 300, 0.82)}>{a.toUpperCase()}</text>
        <text x="200" y="296" fontSize="22" style={{ fontFamily: SVG_FONT.poiret }} fill={c.heroText}>and</text>
        <text x="200" y="346" fontSize={fit(b, 50, 300, 0.82)}>{b.toUpperCase()}</text>
      </g>
      <text x="200" y="410" textAnchor="middle" fill={c.heroText} style={{ fontFamily: SVG_FONT.poiret, letterSpacing: 8 }} fontSize="20">12 . 12 . 2026</text>
    </SwatchSvg>
  );
}

export const mehfil: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-5 py-16 sm:py-20', title: 'Reserve your seat', titleClass: 'font-limelight text-[36px] leading-tight text-inv-heading', subClass: 'font-poiret font-bold text-muted' },
};
