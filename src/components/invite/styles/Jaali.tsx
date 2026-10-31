import { formatLongDate, formatShortDate } from '@/lib/format';
import { Countdown } from '../Countdown';
import { colorsOf, type FullColors, EventActions, fit, mainEventId, NativeLine, nameTier, SaveAll, ScriptText, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Jaali: a tall Mughal arch filled with a carved lattice frames the names,
 * a crescent and star above; functions sit in arched niches.
 *
 * The hero is a fixed-shape box (the arch's proportions) whose type is sized
 * in container units, so the names always sit inside the arch.
 */

const OUTER = 'M30 820V300C30 200 120 140 195 96C270 140 360 200 360 300V820';
const INNER = 'M58 800V310C58 228 132 176 195 140C258 176 332 228 332 310V800Z';
const STAR = 'M11 1L13.5 8.5L21 11L13.5 13.5L11 21L8.5 13.5L1 11L8.5 8.5Z';

function Lattice({ id, line }: { id: string; line: string }) {
  return (
    <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M18 2L22 14L34 18L22 22L18 34L14 22L2 18L14 14Z" fill="none" stroke={line} strokeWidth="1.6" />
      <circle cx="18" cy="18" r="3" fill={line} />
      <path d="M0 0L6 6M36 0L30 6M0 36L6 30M36 36L30 30" stroke={line} strokeWidth="1.6" />
    </pattern>
  );
}

function Arch({ c, id }: { c: FullColors; id: string }) {
  return (
    <svg viewBox="0 0 390 844" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <Lattice id={`${id}-p`} line={c.deep} />
        <clipPath id={`${id}-c`}><path d={`${OUTER}Z`} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-c)`}><rect width="390" height="844" fill={`url(#${id}-p)`} opacity=".5" /></g>
      <path d={OUTER} fill="none" stroke={c.alt} strokeWidth="2.5" />
      <path d={INNER} fill={c.heroVia} stroke={c.deep} strokeWidth="1.5" />
      <path d="M66 792V314C66 236 136 186 195 152C254 186 324 236 324 314V792" fill="none" stroke={c.alt} strokeWidth="1" />
      <g transform="translate(190 58)" fill={c.alt}>
        <circle r="18" /><circle cx="7" cy="-3" r="15" fill={c.heroVia} />
        <path d="M14-4l2.4 5 5.4.6-4 3.6 1.2 5.4-5-2.8-5 2.8 1.2-5.4-4-3.6 5.4-.6z" />
      </g>
      <rect x="18" y="818" width="354" height="10" fill={c.deep} />
    </svg>
  );
}

function Hero({ invite, design, framed, H1 }: StyleProps) {
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = ['text-[12.5cqw]', 'text-[10.5cqw]', 'text-[8.6cqw]', 'text-[7cqw]'][tier];
  return (
    <header className={`relative flex items-center justify-center overflow-hidden bg-inv-hero-via text-inv-hero-text ${framed ? '' : 'min-h-dvh py-6'}`}>
      <div className={`@container relative aspect-[390/844] w-full ${framed ? '' : 'max-w-[min(460px,calc((100dvh-48px)*0.462))] min-w-[300px]'}`}>
        <Arch c={colorsOf(design)} id={`ja-${framed ? 'p' : 'm'}`} />
        <div className="absolute inset-x-[17%] top-[25%] bottom-[16%] flex flex-col items-center justify-center text-center">
          {invite.blessing && <ScriptText text={invite.blessing} className="text-[6.2cqw] text-inv-accent" latinClass="font-amiri" />}
          {invite.message && <p className="mt-[3cqw] line-clamp-3 font-amiri text-[4.1cqw] leading-snug italic opacity-75">{invite.message}</p>}
          <H1 className={`mt-[2cqw] font-amiri leading-[1.08] font-bold text-inv-accent ${size}`}>
            <span className="block break-words">{invite.partner1}</span>
            <span className="block text-[0.5em] font-normal" style={{ color: colorsOf(design).alt }}>&amp;</span>
            <span className="block break-words">{invite.partner2}</span>
          </H1>
          <p className="mt-[3.5cqw] font-amiri text-[4.6cqw] leading-snug">
            <time dateTime={invite.weddingDate}>{formatLongDate(invite.weddingDate)}</time>
          </p>
          <Countdown date={invite.weddingDate} time={invite.weddingTime} compact className="mt-[4cqw] max-w-[62cqw] gap-1" />
        </div>
        {(invite.venue || invite.city) && <p className="absolute inset-x-[18%] bottom-[9%] truncate text-center font-amiri text-[4.1cqw] opacity-75">{invite.venue || invite.city}</p>}
      </div>
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const c = colorsOf(design);
  const main = mainEventId(invite.events);
  return (
    <section id="celebrations" className="bg-inv-surface px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-md">
        <H2 className="text-center font-amiri text-[36px] leading-tight font-bold text-inv-heading">The celebrations</H2>
        <NativeLine design={design} kind="events" className="mt-1 text-center text-xl" />
        <SaveAll invite={invite} link={link} framed={framed} className="mt-4" />
        <ol className="mt-6 space-y-5">
          {invite.events.map((ev) => {
            const on = ev.id === main;
            return (
              <li key={ev.id} className={`relative px-5 pt-12 pb-5 text-center ${on ? 'text-white' : 'bg-white text-ink'}`}
                style={{ borderRadius: '160px 160px 14px 14px / 70px 70px 14px 14px', background: on ? c.primary : undefined, boxShadow: `inset 0 0 0 1.5px ${c.alt}, inset 0 0 0 6px ${on ? c.primary : '#fff'}, inset 0 0 0 7px color-mix(in srgb, ${on ? '#fff' : c.primary} 25%, transparent)` }}>
                <svg viewBox="0 0 22 22" className="absolute top-3 left-1/2 h-[22px] w-[22px] -translate-x-1/2" aria-hidden="true"><path d={STAR} fill={c.alt} /></svg>
                <H3 className={`font-amiri text-[28px] leading-tight font-bold ${on ? '' : 'text-inv-heading'}`}>{ev.name}</H3>
                <p className="font-amiri text-[15px]"><time dateTime={ev.date}>{formatShortDate(ev.date)}</time>{ev.time && <> · {ev.time}</>}</p>
                {ev.venue && <p className="font-amiri text-[15px] italic opacity-75">{ev.venue}</p>}
                {ev.note && <p className="font-amiri text-sm italic opacity-90">{ev.note}</p>}
                <EventActions ev={ev} invite={invite} link={link} framed={framed} className="mt-3 justify-center" />
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
  const id = `ja-s-${design.id}`;
  return (
    <SwatchSvg size={size} band={130}>
      <defs>
        <Lattice id={`${id}-p`} line={c.deep} />
        <clipPath id={`${id}-c`}><path d="M40 500V170C40 110 130 60 200 30C270 60 360 110 360 170V500Z" /></clipPath>
      </defs>
      <rect width="400" height="500" fill={c.heroVia} />
      <g clipPath={`url(#${id}-c)`}><rect width="400" height="500" fill={`url(#${id}-p)`} opacity=".5" /></g>
      <path d="M70 500V184C70 132 140 92 200 66C260 92 330 132 330 184V500Z" fill={c.heroVia} stroke={c.alt} strokeWidth="2" />
      <SvgScript text={blessing} y={160} size={22} fill={c.accent} latinFont={SVG_FONT.amiri} lang={design.lang} width={230} />
      <g style={{ fontFamily: SVG_FONT.amiri, fontWeight: 700 }} fill={c.accent} textAnchor="middle">
        <text x="200" y="240" fontSize={fit(a, 50, 230, 0.55)}>{a}</text>
        <text x="200" y="280" fontSize="26" fill={c.alt} style={{ fontWeight: 400 }}>&amp;</text>
        <text x="200" y="330" fontSize={fit(b, 50, 230, 0.55)}>{b}</text>
      </g>
    </SwatchSvg>
  );
}

export const jaali: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-6 py-16 sm:py-20', title: 'Will you join us?', titleClass: 'font-amiri text-[34px] font-bold text-inv-heading', subClass: 'font-amiri italic text-muted' },
};
