import { formatLongDate, formatShortDate } from '@/lib/format';
import { Countdown } from '../Countdown';
import { colorsOf, EventActions, fit, NativeLine, nameTier, r2, SaveAll, ScriptText, seeded, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Rajwada: an illustrated palace under a dusk sky, fireworks overhead,
 * carved capitals for the names; functions on parchment scrolls.
 */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const romanDate = (ymd: string) => {
  const [y, m, d] = ymd.split('-');
  return y ? `${d} · ${ROMAN[Number(m) - 1] ?? m} · ${y}` : '';
};

function Stars({ n = 60, w = 400, h = 420, seed = 7 }: { n?: number; w?: number; h?: number; seed?: number }) {
  const r = seeded(seed);
  return (
    <g fill="#fff">
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={r2(r() * w)} cy={r2(r() * h)} r={r2(0.6 + r() * 0.9)} opacity={r2(0.3 + r() * 0.7)} />)}
    </g>
  );
}

function Firework({ cx, cy, R, c }: { cx: number; cy: number; R: number; c: string }) {
  return (
    <g stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity=".9">
      {Array.from({ length: 18 }, (_, k) => {
        const a = (k / 18) * Math.PI * 2;
        return (
          <g key={k}>
            <line x1={r2(cx + Math.cos(a) * R * 0.35)} y1={r2(cy + Math.sin(a) * R * 0.35)} x2={r2(cx + Math.cos(a) * R)} y2={r2(cy + Math.sin(a) * R)} />
            <circle cx={r2(cx + Math.cos(a) * R * 1.12)} cy={r2(cy + Math.sin(a) * R * 1.12)} r="1.4" fill={c} stroke="none" />
          </g>
        );
      })}
    </g>
  );
}

const arch = (x: number, y: number, w: number, h: number) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
const ELEPHANT = 'M30 420V392C30 372 48 360 70 362C86 363 96 372 100 384C104 380 110 380 112 386L114 404C114 410 108 412 106 406L104 396C102 404 98 410 96 420H84V404H52V420Z';

/** The palace silhouette, 390 × 270 (sits on the bottom edge of the hero). */
function Palace({ deep, glow, className = '' }: { deep: string; glow: string; className?: string }) {
  return (
    <svg viewBox="0 150 390 270" className={className} aria-hidden="true">
      <path d="M0 260C60 230 110 250 160 235S260 215 300 232 370 225 390 238V420H0Z" fill={deep} opacity=".55" />
      <g fill={deep}>
        <rect x="40" y="250" width="310" height="170" />
        <rect x="20" y="300" width="350" height="120" />
        <path d="M150 250C150 205 175 182 195 170C215 182 240 205 240 250Z" />
        <rect x="192" y="150" width="6" height="22" /><circle cx="195" cy="148" r="5" />
        <path d="M60 250C60 230 72 220 82 214C92 220 104 230 104 250Z" /><rect x="80" y="202" width="4" height="12" />
        <path d="M286 250C286 230 298 220 308 214C318 220 330 230 330 250Z" /><rect x="306" y="202" width="4" height="12" />
        <path d="M118 262C118 246 128 238 136 233C144 238 154 246 154 262Z" />
        <path d="M236 262C236 246 246 238 254 233C262 238 272 246 272 262Z" />
        <rect x="22" y="240" width="26" height="80" /><path d="M18 242L35 222L52 242Z" />
        <rect x="342" y="240" width="26" height="80" /><path d="M338 242L355 222L372 242Z" />
      </g>
      <g fill={glow}>
        {Array.from({ length: 9 }, (_, i) => <path key={`a${i}`} d={arch(52 + i * 32, 272, 12, 20)} />)}
        {Array.from({ length: 10 }, (_, i) => (i === 4 || i === 5 ? null : <path key={`b${i}`} d={arch(36 + i * 33, 322, 14, 24)} />))}
        <path d={arch(182, 214, 26, 30)} />
      </g>
      <path d="M175 420V360C175 342 185 334 195 330C205 334 215 342 215 360V420Z" fill={glow} opacity=".85" />
      <g fill={deep} style={{ filter: 'brightness(.7)' }}>
        <path d={ELEPHANT} /><path transform="translate(390 0) scale(-1 1)" d={ELEPHANT} />
      </g>
      <g fill="#c9283e" opacity=".9"><path d="M50 372h30v14H50z" /><path transform="translate(390 0) scale(-1 1)" d="M50 372h30v14H50z" /></g>
    </svg>
  );
}

function Hero({ invite, design, framed, H1 }: StyleProps) {
  const c = colorsOf(design);
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = (framed
    ? ['text-[44px]', 'text-[36px]', 'text-[30px]', 'text-[25px]']
    : ['text-[44px] sm:text-[72px]', 'text-[36px] sm:text-[60px]', 'text-[30px] sm:text-[50px]', 'text-[25px] sm:text-[42px]'])[tier];
  return (
    <header className={`relative flex flex-col overflow-hidden text-center text-inv-hero-text ${framed ? 'min-h-[640px]' : 'min-h-dvh'}`}
      style={{ background: 'linear-gradient(180deg, var(--color-inv-hero-from) 0%, var(--color-inv-hero-via) 52%, var(--color-inv-hero-to) 100%)' }}>
      <svg viewBox="0 0 400 420" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-[70%] w-full" aria-hidden="true">
        <Stars />
      </svg>
      <div className={`relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-8 ${framed ? 'pt-14' : 'pt-14 sm:pt-20'}`}>
        {invite.blessing && <ScriptText text={invite.blessing} className="text-xl text-inv-accent sm:text-2xl" latinClass="font-cinzel tracking-[0.22em] uppercase text-base sm:text-lg" />}
        {invite.message && <p className={`mt-3 max-w-sm font-display text-base italic opacity-85 ${framed ? '' : 'sm:text-lg'}`}>{invite.message}</p>}
        <H1 className={`mt-4 font-cinzel leading-[1.04] font-semibold text-inv-accent uppercase [text-shadow:0_0_24px_rgba(243,201,105,.35)] ${size}`}>
          <span className="block break-words">{invite.partner1}</span>
          <span className="block font-display text-[0.6em] font-medium normal-case italic">&amp;</span>
          <span className="block break-words">{invite.partner2}</span>
        </H1>
        <p className={`mt-4 font-cinzel tracking-[0.3em] whitespace-nowrap ${framed ? 'text-sm' : 'text-sm sm:text-base'}`}><time dateTime={invite.weddingDate}>{romanDate(invite.weddingDate)}</time></p>
        {(invite.venue || invite.city) && <p className="mt-1 font-display text-lg italic opacity-90">{invite.venue || invite.city}</p>}
        <Countdown date={invite.weddingDate} time={invite.weddingTime} compact={framed} className="mt-5 max-w-[280px]" />
        <a href="#celebrations" className="mt-6 rounded-full px-6 py-3.5 font-cinzel text-xs tracking-[0.2em] text-[#2a1206] shadow-[0_8px_24px_rgba(242,184,75,.35)] transition hover:brightness-105" style={{ background: 'linear-gradient(#f9d98a, #e3a73c)' }}>
          ENTER THE CELEBRATION
        </a>
      </div>
      {/* Night scene: fireworks above the palace roofline, palace on the bottom edge */}
      <div className="relative mx-auto mt-6 w-full max-w-[560px]" aria-hidden="true">
        <svg viewBox="0 0 390 120" className="absolute inset-x-0 -top-[18%] w-full">
          <Firework cx={56} cy={50} R={30} c="#f2b84b" />
          <Firework cx={330} cy={40} R={26} c="#f39ab2" />
          <Firework cx={300} cy={104} R={14} c="#9fe3d0" />
          <Firework cx={92} cy={110} R={13} c={c.accent} />
        </svg>
        <Palace deep={c.deep} glow={c.accent} className="relative block w-full" />
      </div>
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const native = design.lang !== 'en';
  return (
    <section id="celebrations" className="px-5 py-16 sm:py-20" style={{ background: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,.55), transparent 40%), radial-gradient(circle at 80% 90%, rgba(150,90,30,.15), transparent 45%), var(--color-inv-surface)' }}>
      <div className="mx-auto max-w-xl">
        {native
          ? <NativeLine design={design} kind="events" className="text-center text-[34px] text-inv-heading" />
          : <H2 className="text-center font-cinzel text-[32px] font-semibold text-inv-heading">The Celebrations</H2>}
        {native && <H2 className="mt-1 text-center font-cinzel text-sm tracking-[0.3em] text-inv-primary uppercase">The Celebrations</H2>}
        <p className="mt-2 text-center font-display text-lg text-muted italic">
          {formatLongDate(invite.events[0].date)}{invite.events.length > 1 && <> – {formatLongDate(invite.events[invite.events.length - 1].date)}</>}
        </p>
        <SaveAll invite={invite} link={link} framed={framed} className="mt-4 mb-8" />
        <ol className="space-y-5">
          {invite.events.map((ev) => (
            <li key={ev.id} className="rj-scroll flex items-center gap-3 px-6 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-cinzel text-[11px] tracking-[0.2em] text-inv-primary uppercase">
                  <time dateTime={ev.date}>{formatShortDate(ev.date)}</time>{ev.time && <> · {ev.time}</>}
                </p>
                <H3 className="mt-1 font-cinzel text-[22px] leading-tight font-semibold text-inv-heading">{ev.name}</H3>
                {ev.venue && <p className="font-display text-[15px] text-ink/75 italic">{ev.venue}</p>}
                {ev.note && <p className="mt-0.5 font-display text-sm text-inv-primary italic">{ev.note}</p>}
              </div>
              <EventActions ev={ev} invite={invite} link={link} framed={framed} vertical />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Swatch({ design, names: [a, b], blessing, size }: SwatchProps) {
  const c = colorsOf(design);
  const id = `rj-${design.id}`;
  return (
    <SwatchSvg size={size} band={100}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.heroFrom} /><stop offset=".55" stopColor={c.heroVia} /><stop offset="1" stopColor={c.heroTo} /></linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id})`} />
      <Stars n={40} w={400} h={300} seed={3} />
      <Firework cx={60} cy={70} R={22} c="#f2b84b" />
      <Firework cx={345} cy={60} R={18} c="#f39ab2" />
      <SvgScript text={blessing} y={128} size={26} fill={c.accent} latinFont={SVG_FONT.cinzel} lang={design.lang} />
      <g style={{ fontFamily: SVG_FONT.cinzel, fontWeight: 600 }} fill={c.accent} textAnchor="middle">
        <text x="200" y="210" fontSize={fit(a.toUpperCase(), 52, 330, 0.78)}>{a.toUpperCase()}</text>
        <text x="200" y="250" fontSize="28" style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}>&amp;</text>
        <text x="200" y="300" fontSize={fit(b.toUpperCase(), 52, 330, 0.78)}>{b.toUpperCase()}</text>
      </g>
      {size === 'lg' && <svg x="0" y="320" width="400" height="180" viewBox="0 150 390 270" preserveAspectRatio="xMidYMax meet">
        <path d="M0 260C60 230 110 250 160 235S260 215 300 232 370 225 390 238V420H0Z" fill={c.deep} opacity=".55" />
        <g fill={c.deep}>
          <rect x="40" y="250" width="310" height="170" /><rect x="20" y="300" width="350" height="120" />
          <path d="M150 250C150 205 175 182 195 170C215 182 240 205 240 250Z" />
          <path d="M60 250C60 230 72 220 82 214C92 220 104 230 104 250Z" /><path d="M286 250C286 230 298 220 308 214C318 220 330 230 330 250Z" />
          <rect x="22" y="240" width="26" height="80" /><rect x="342" y="240" width="26" height="80" />
        </g>
        <g fill={c.accent}>{Array.from({ length: 9 }, (_, i) => <path key={i} d={arch(52 + i * 32, 272, 12, 20)} />)}</g>
        <path d="M175 420V360C175 342 185 334 195 330C205 334 215 342 215 360V420Z" fill={c.accent} opacity=".85" />
      </svg>}
    </SwatchSvg>
  );
}

export const rajwada: StyleView = {
  Hero, Events, Swatch,
  rsvp: {
    section: 'px-5 py-16 sm:py-20', style: { background: 'linear-gradient(180deg, var(--color-inv-surface), #fff8ec)' },
    title: 'Will you join us?', titleClass: 'font-cinzel text-[30px] font-semibold text-inv-heading', subClass: 'font-display text-lg italic text-muted',
  },
};
