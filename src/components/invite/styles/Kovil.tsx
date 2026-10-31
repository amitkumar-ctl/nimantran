import { formatLongDate, formatShortDate, formatTime } from '@/lib/format';
import { Countdown } from '../Countdown';
import { colorsOf, EventActions, fit, mainEventId, NativeLine, nameTier, SaveAll, ScriptText, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Kovil: South Indian temple wedding. A rice-flour kolam border, a golden
 * gopuram with brass lamps and a kasavu band; functions as a bell timeline.
 */

/** Dots + loops kolam along every edge, drawn as a repeating mask so it tiles at any size in any colour. */
const KOLAM_H = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='36' height='28'><circle cx='0' cy='14' r='2'/><circle cx='18' cy='14' r='2'/><circle cx='36' cy='14' r='2'/><path d='M9 14C9 2 27 2 27 14S9 26 9 14' fill='none' stroke='black' stroke-width='1.6'/></svg>")}")`;
const KOLAM_V = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='36'><circle cx='14' cy='0' r='2'/><circle cx='14' cy='18' r='2'/><circle cx='14' cy='36' r='2'/><path d='M14 9C2 9 2 27 14 27S26 9 14 9' fill='none' stroke='black' stroke-width='1.6'/></svg>")}")`;
const strip = (img: string, repeat: 'repeat-x' | 'repeat-y', color: string) =>
  ({ background: color, maskImage: img, WebkitMaskImage: img, maskRepeat: repeat, WebkitMaskRepeat: repeat, maskPosition: 'center', WebkitMaskPosition: 'center' });

function KolamBorder({ color }: { color: string }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-x-2 top-2 h-7" style={strip(KOLAM_H, 'repeat-x', color)} />
      <div className="absolute inset-x-2 bottom-2 h-7" style={strip(KOLAM_H, 'repeat-x', color)} />
      <div className="absolute inset-y-9 left-2 w-7" style={strip(KOLAM_V, 'repeat-y', color)} />
      <div className="absolute inset-y-9 right-2 w-7" style={strip(KOLAM_V, 'repeat-y', color)} />
    </div>
  );
}

export function Gopuram({ gold, ground, className = '' }: { gold: string; ground: string; className?: string }) {
  return (
    <svg viewBox="-80 28 160 194" className={className} aria-hidden="true">
      <GopuramArt gold={gold} ground={ground} />
    </svg>
  );
}

/** The gopuram drawn around x = 0 (160 wide, y 28–222). */
function GopuramArt({ gold, ground }: { gold: string; ground: string }) {
  return (
    <>
      <g fill={gold}>
        <rect x="-70" y="200" width="140" height="18" rx="2" />
        <path d="M-62 200L-56 168H56L62 200Z" /><path d="M-52 168L-46 138H46L52 168Z" /><path d="M-42 138L-37 110H37L42 138Z" /><path d="M-32 110L-28 84H28L32 110Z" /><path d="M-22 84L-18 62H18L22 84Z" />
        <path d="M-22 62C-22 40 22 40 22 62Z" />
      </g>
      <g fill={ground}><rect x="-8" y="176" width="16" height="24" rx="8" /><rect x="-30" y="146" width="8" height="16" rx="4" /><rect x="22" y="146" width="8" height="16" rx="4" /><rect x="-5" y="118" width="10" height="16" rx="5" /></g>
      <g fill="#fff" opacity=".6"><circle cx="-14" cy="42" r="3" /><circle cx="0" cy="34" r="4" /><circle cx="14" cy="42" r="3" /></g>
    </>
  );
}

function Lamp({ gold, className = '' }: { gold: string; className?: string }) {
  return (
    <svg viewBox="-20 -44 40 88" className={className} aria-hidden="true">
      <path className="origin-bottom animate-flicker" d="M0-40c6 8 6 14 0 18-6-4-6-10 0-18z" fill="#ffb347" />
      <path d="M-16-20h32c-2 8-8 12-16 12s-14-4-16-12z" fill={gold} /><rect x="-3" y="-8" width="6" height="40" fill={gold} /><path d="M-14 32h28l4 8h-36z" fill={gold} />
    </svg>
  );
}

function Hero({ invite, design, framed, H1 }: StyleProps) {
  const c = colorsOf(design);
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = (framed ? ['text-[44px]', 'text-[38px]', 'text-[32px]', 'text-[26px]'] : ['text-[44px] sm:text-[64px]', 'text-[38px] sm:text-[54px]', 'text-[32px] sm:text-[46px]', 'text-[26px] sm:text-[38px]'])[tier];
  return (
    <header className={`relative flex flex-col overflow-hidden bg-inv-hero-via text-center text-inv-hero-text ${framed ? 'min-h-[640px]' : 'min-h-dvh'}`}>
      <div className="absolute inset-x-0 top-0 bottom-16"><KolamBorder color={c.heroText} /></div>
      <div className={`relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-12 ${framed ? 'pt-12 pb-24' : 'pt-14 pb-28 sm:pt-16'}`}>
        <div className="flex items-end justify-center gap-4">
          <Lamp gold={c.deep} className="h-[70px] w-8" />
          <Gopuram gold={c.deep} ground={c.heroVia} className="w-[130px] sm:w-[150px]" />
          <Lamp gold={c.deep} className="h-[70px] w-8" />
        </div>
        {invite.blessing && <ScriptText text={invite.blessing} className="mt-6 text-[22px] text-inv-accent" latinClass="font-marcellus tracking-[0.12em]" />}
        {invite.message && <p className="mt-3 max-w-xs font-marcellus text-[15px] leading-relaxed opacity-85">{invite.message}</p>}
        <H1 className={`mt-4 font-marcellus leading-[1.05] tracking-[0.02em] ${size}`}>
          <span className="block break-words">{invite.partner1}</span>
          <span className="my-2 block text-xl text-inv-accent">weds</span>
          <span className="block break-words">{invite.partner2}</span>
        </H1>
        <p className="mt-5 font-marcellus text-[17px] leading-relaxed">
          <time dateTime={invite.weddingDate} className="text-inv-accent">{formatLongDate(invite.weddingDate)}</time>
          {invite.weddingTime && <><br />Muhurtham {formatTime(invite.weddingTime)}</>}
        </p>
        <Countdown date={invite.weddingDate} time={invite.weddingTime} compact={framed} className="mt-5 max-w-[280px]" />
      </div>
      {/* Kasavu saree band with the venue */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-inv-surface" aria-hidden={!(invite.venue || invite.city)}>
        <div className="absolute inset-x-0 top-2.5 h-3.5" style={{ background: `repeating-linear-gradient(90deg, ${c.deep} 0 18px, ${c.alt} 18px 22px)` }} />
        <p className="absolute inset-x-4 bottom-3 truncate font-marcellus text-sm text-inv-heading">{invite.venue || invite.city}</p>
      </div>
    </header>
  );
}

function Bell({ gold }: { gold: string }) {
  return (
    <svg viewBox="0 0 32 36" className="h-9 w-8" aria-hidden="true">
      <path d="M16 2v4" stroke={gold} strokeWidth="2" />
      <path d="M6 26C6 14 9 7 16 7S26 14 26 26Z" fill={gold} />
      <rect x="3" y="25" width="26" height="4" rx="2" fill={gold} style={{ filter: 'brightness(.85)' }} />
      <circle cx="16" cy="32" r="3" fill={gold} style={{ filter: 'brightness(.85)' }} />
    </svg>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const c = colorsOf(design);
  const main = mainEventId(invite.events);
  const bell = design.id.includes('-turmeric') ? '#b8860b' : c.deep;
  return (
    <section id="celebrations" className="relative overflow-hidden bg-inv-surface px-6 py-16 sm:py-20">
      <svg viewBox="0 0 140 140" className="absolute top-0 right-0 w-[120px]" aria-hidden="true">
        <g fill={c.heroVia}>{Array.from({ length: 6 }, (_, i) => Array.from({ length: i + 1 }, (_, j) => <circle key={`${i}-${j}`} cx={132 - j * 20} cy={8 + (i - j) * 20} r="2.5" />))}</g>
      </svg>
      <div className="relative mx-auto max-w-xl">
        <H2 className="font-marcellus text-[34px] leading-tight text-inv-heading">Wedding<br />celebrations</H2>
        <NativeLine design={design} kind="events" className="mt-1 text-lg" />
        <SaveAll invite={invite} link={link} framed={framed} align="start" className="mt-4" />
        <ol className="relative mt-8 pl-11">
          <span className="absolute top-2 bottom-2 left-[15px] w-0.5" style={{ background: `repeating-linear-gradient(${bell} 0 6px, transparent 6px 12px)` }} aria-hidden="true" />
          {invite.events.map((ev) => {
            const on = ev.id === main;
            return (
              <li key={ev.id} className={`relative mb-6 flex flex-wrap items-center gap-3 ${on ? '-ml-3 rounded-xl bg-inv-hero-via py-3.5 pr-3.5 pl-3 text-inv-hero-text' : ''}`}>
                <span className={`absolute top-0 ${on ? '-left-8' : '-left-11'}`}><Bell gold={bell} /></span>
                <div className="min-w-0 flex-1">
                  <p className={`font-marcellus text-[13px] tracking-[0.06em] uppercase ${on ? 'text-inv-accent' : ''}`} style={on ? undefined : { color: c.alt }}>
                    <time dateTime={ev.date}>{formatShortDate(ev.date)}</time>{ev.time && <> · {ev.time}</>}
                  </p>
                  <H3 className={`mt-1 font-marcellus leading-tight ${on ? 'text-[30px]' : 'text-[24px] text-inv-heading'}`}>{ev.name}</H3>
                  {ev.venue && <p className={`font-marcellus text-sm ${on ? 'opacity-85' : 'text-ink/65'}`}>{ev.venue}</p>}
                  {ev.note && <p className={`font-marcellus text-xs ${on ? 'text-inv-accent' : 'text-inv-primary'}`}>{ev.note}</p>}
                </div>
                <EventActions ev={ev} invite={invite} link={link} framed={framed} vertical />
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
    <SwatchSvg size={size} band={178}>
      <rect width="400" height="500" fill={c.heroVia} />
      <g fill={c.heroText}>
        {Array.from({ length: 21 }, (_, i) => <g key={i}><circle cx={20 + i * 18} cy="20" r="2.2" /><circle cx={20 + i * 18} cy="440" r="2.2" /></g>)}
        {Array.from({ length: 23 }, (_, i) => <g key={i}><circle cx="20" cy={38 + i * 18} r="2.2" /><circle cx="380" cy={38 + i * 18} r="2.2" /></g>)}
      </g>
      <g transform="translate(200 15) scale(.75)"><GopuramArt gold={c.deep} ground={c.heroVia} /></g>
      <SvgScript text={blessing} y={214} size={22} fill={c.accent} latinFont={SVG_FONT.marcellus} lang={design.lang} />
      <g style={{ fontFamily: SVG_FONT.marcellus }} fill={c.heroText} textAnchor="middle">
        <text x="200" y="268" fontSize={fit(a, 42, 300, 0.62)}>{a}</text>
        <text x="200" y="300" fontSize="18" fill={c.accent}>weds</text>
        <text x="200" y="344" fontSize={fit(b, 42, 300, 0.62)}>{b}</text>
      </g>
      <rect y="452" width="400" height="48" fill={c.surface} />
      <rect y="460" width="400" height="12" fill={c.deep} />
      {Array.from({ length: 18 }, (_, i) => <rect key={i} x={18 + i * 22} y="460" width="4" height="12" fill={c.alt} />)}
    </SwatchSvg>
  );
}

export const kovil: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-6 py-16 sm:py-20 border-t-[14px]', style: { borderImage: 'repeating-linear-gradient(90deg, var(--color-inv-deep) 0 18px, var(--color-inv-alt) 18px 22px) 14' }, title: 'Will you join us?', titleClass: 'font-marcellus text-[32px] text-inv-heading', subClass: 'font-marcellus text-muted' },
};
