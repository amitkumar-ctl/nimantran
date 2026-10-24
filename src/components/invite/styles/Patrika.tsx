import { formatLongDate, formatTime } from '@/lib/format';
import { Countdown } from '../Countdown';
import { colorsOf, EventActions, fit, NativeLine, SaveAll, ScriptText, splitTime, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Patrika: a fashion-magazine cover. Towering Bodoni names, the city set
 * vertically, a huge date as the image; functions as an agenda by day.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function dateBits(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  const wd = new Date(Date.UTC(y, (m || 1) - 1, d || 1)).getUTCDay();
  return { dd: String(d || 1).padStart(2, '0'), mm: String(m || 1).padStart(2, '0'), month: MONTHS[(m || 1) - 1], year: y, weekday: DAYS[wd] };
}

function Hero({ invite, framed, H1 }: StyleProps) {
  const d = dateBits(invite.weddingDate);
  const words = [...invite.partner1.split(/\s+/), invite.partner2.split(/\s+/)].flat();
  const longest = Math.max(...words.map((w) => w.length));
  const size = (framed
    ? ['text-[76px]', 'text-[62px]', 'text-[50px]', 'text-[40px]']
    : ['text-[76px] sm:text-[120px]', 'text-[62px] sm:text-[100px]', 'text-[50px] sm:text-[84px]', 'text-[40px] sm:text-[68px]'])[longest > 9 ? 3 : longest > 7 ? 2 : longest > 5 ? 1 : 0];
  const city = invite.city || invite.venue;
  return (
    <header className={`relative flex flex-col overflow-hidden bg-inv-hero-via text-inv-hero-text ${framed ? 'min-h-[640px]' : 'min-h-dvh'}`}>
      <div className={`relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-7 pr-14 ${framed ? 'pt-12 pb-8' : 'pt-12 pb-8 sm:px-12 sm:pt-20 sm:pr-24'}`}>
        {invite.blessing && <ScriptText text={invite.blessing} className="text-base text-inv-accent" latinClass="font-josefin text-xs tracking-[0.25em] uppercase" />}
        <p className="mt-4 font-bodoni text-[19px] text-inv-accent italic">The wedding of</p>
        <H1 className={`mt-1 font-bodoni leading-[0.92] tracking-[-0.01em] ${size}`}>
          {invite.partner1.split(/\s+/).map((w, i) => <span key={`a${i}`} className="block break-words">{w}</span>)}
          <span className="my-1 block text-[0.5em] text-inv-accent italic">and</span>
          {invite.partner2.split(/\s+/).map((w, i) => <span key={`b${i}`} className="block break-words">{w}</span>)}
        </H1>
        {invite.message && <p className="mt-5 max-w-sm font-josefin text-sm leading-relaxed opacity-70">{invite.message}</p>}
        <div className="mt-auto pt-10">
          <div className="flex items-end justify-between gap-3">
            <p className="font-bodoni leading-[0.8] font-bold text-inv-accent text-[88px] sm:text-[120px]" aria-hidden="true">{d.dd}.{d.mm}</p>
            <p className="pb-1 text-right font-josefin text-[13px] leading-snug sm:text-[15px]">
              <time dateTime={invite.weddingDate}>{d.weekday}<br />{d.month} {d.year}</time>
              {invite.weddingTime && <><br />{formatTime(invite.weddingTime).toLowerCase()} onwards</>}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-current pt-3 font-josefin text-sm">
            <span className="truncate">{invite.venue || invite.city}</span>
            <Countdown date={invite.weddingDate} time={invite.weddingTime} variant="text" className="flex-none font-semibold text-inv-accent" />
          </div>
        </div>
      </div>
      {city && (
        <p className="absolute top-1/2 right-4 max-h-[60%] -translate-y-1/2 truncate font-josefin text-xs tracking-[0.4em] uppercase opacity-60 sm:right-8 sm:text-sm" style={{ writingMode: 'vertical-rl' }}>
          {city}
        </p>
      )}
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const days = new Map<string, typeof invite.events>();
  for (const ev of invite.events) days.set(ev.date, [...(days.get(ev.date) ?? []), ev]);
  return (
    <section id="celebrations" className="bg-inv-surface px-6 py-16 text-inv-heading sm:py-24">
      <div className="mx-auto max-w-2xl">
        <H2 className="font-bodoni text-[52px] leading-none">The <span className="text-inv-accent italic">programme</span></H2>
        <NativeLine design={design} kind="events" className="mt-2 text-lg text-inv-accent" />
        <SaveAll invite={invite} link={link} framed={framed} align="start" className="mt-4" />
        {[...days.entries()].map(([day, evs]) => (
          <div key={day} className="mt-8">
            <p className="border-b border-current pb-2 font-josefin text-xs font-semibold tracking-[0.2em] uppercase opacity-80"><time dateTime={day}>{formatLongDate(day)}</time></p>
            <ol>
              {evs.map((ev) => {
                const t = splitTime(ev.time);
                return (
                  <li key={ev.id} className="grid grid-cols-[84px_1fr] items-start gap-x-3 border-b border-black/10 py-4 sm:grid-cols-[104px_1fr_auto]">
                    <p className={`font-bodoni leading-none font-bold text-inv-accent ${t.big.length > 2 ? 'text-[30px]' : 'text-[40px]'}`}>{ev.time ? t.big : '—'}<span className="ml-0.5 font-josefin text-xs font-semibold">{t.small}</span></p>
                    <div className="min-w-0">
                      <H3 className="font-bodoni text-[26px] leading-tight italic">{ev.name}</H3>
                      {ev.venue && <p className="font-josefin text-[13px] opacity-70">{ev.venue}</p>}
                      {ev.note && <p className="font-josefin text-[13px] text-inv-accent">{ev.note}</p>}
                    </div>
                    <EventActions ev={ev} invite={invite} link={link} framed={framed} className="col-start-2 mt-2 sm:col-start-3 sm:mt-0" />
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

function Swatch({ design, names: [a, b], blessing, size, city }: SwatchProps) {
  const c = colorsOf(design);
  return (
    <SwatchSvg size={size}>
      <rect width="400" height="500" fill={c.heroVia} />
      <SvgScript anchor="start" text={blessing} x={36} y={92} size={16} fill={c.accent} latinFont={SVG_FONT.josefin} lang={design.lang} width={200} />
      <text x="36" y="132" fill={c.accent} style={{ fontFamily: SVG_FONT.bodoni, fontStyle: 'italic' }} fontSize="20">The wedding of</text>
      <g style={{ fontFamily: SVG_FONT.bodoni }} fill={c.heroText}>
        <text x="32" y="210" fontSize={fit(a, 82, 300, 0.56)}>{a}</text>
        <text x="36" y="250" fontSize="34" fill={c.accent} style={{ fontStyle: 'italic' }}>and</text>
        <text x="32" y="330" fontSize={fit(b, 82, 300, 0.56)}>{b}</text>
      </g>
      <text x="360" y="200" fill={c.heroText} opacity=".55" transform="rotate(90 360 200)" style={{ fontFamily: SVG_FONT.josefin, letterSpacing: 6 }} fontSize="14">{city.toUpperCase()}</text>
      <text x="32" y="450" fill={c.accent} style={{ fontFamily: SVG_FONT.bodoni, fontWeight: 700 }} fontSize="88">12.12</text>
      <line x1="32" x2="368" y1="470" y2="470" stroke={c.heroText} strokeWidth="1.5" />
    </SwatchSvg>
  );
}

export const patrika: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-6 py-16 sm:py-24 border-t border-black/10', title: 'Kindly reply', titleClass: 'font-bodoni text-[46px] leading-none text-inv-heading', subClass: 'font-josefin text-sm text-muted' },
};
