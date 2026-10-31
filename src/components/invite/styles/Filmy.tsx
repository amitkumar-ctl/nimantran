import { formatLongDate, formatShortDate } from '@/lib/format';
import { Countdown } from '../Countdown';
import { colorsOf, EventActions, fit, mainEventId, NativeLine, nameTier, SaveAll, ScriptText, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Filmy: a Bollywood poster. Sun-rays, marquee bulbs, a cheerful illustrated
 * couple and chunky outlined names; functions as frames on a film strip.
 */

/** The illustrated couple (groom in a safa, bride in a red dupatta), 330 × 400. */
export function Couple({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 330 400" className={className} aria-hidden="true">
      <ellipse cx="165" cy="392" rx="140" ry="12" fill="#000" opacity=".18" />
      <g transform="translate(70 0)">
        <path d="M20 400C18 300 30 250 70 236 110 250 122 300 120 400Z" fill="#fff4dc" />
        <path d="M70 236V400" stroke="#e8c98a" strokeWidth="3" />
        <g fill="#d9a441"><circle cx="70" cy="270" r="3.5" /><circle cx="70" cy="294" r="3.5" /><circle cx="70" cy="318" r="3.5" /></g>
        <path d="M38 252C28 290 30 330 34 360" stroke="#e8c98a" strokeWidth="10" strokeLinecap="round" fill="none" />
        <rect x="58" y="214" width="24" height="26" rx="8" fill="#d9946a" />
        <circle cx="70" cy="178" r="48" fill="#e2a679" />
        <path d="M20 168C20 118 120 112 122 166 108 150 34 150 20 168Z" fill="#ff8a1f" />
        <path d="M24 150C50 128 96 126 118 146" stroke="#e2267b" strokeWidth="6" fill="none" />
        <path d="M86 116C96 92 108 86 112 74 104 92 100 104 92 120Z" fill="#ffe066" />
        <circle cx="88" cy="122" r="7" fill="#e2267b" />
        <circle cx="52" cy="182" r="5" fill="#2b1a12" /><circle cx="88" cy="182" r="5" fill="#2b1a12" />
        <path d="M52 204C60 198 66 200 70 204 74 200 80 198 88 204" stroke="#2b1a12" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M58 212C66 222 76 222 84 212" stroke="#9a3f2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="198" r="7" fill="#f08a8a" opacity=".5" /><circle cx="100" cy="198" r="7" fill="#f08a8a" opacity=".5" />
      </g>
      <g transform="translate(166 10)">
        <path d="M0 390C10 300 30 260 70 246 110 260 132 300 142 390Z" fill="#c8102e" />
        <path d="M12 360C50 350 92 350 132 360" stroke="#ffd166" strokeWidth="5" fill="none" />
        <path d="M20 330C52 322 90 322 124 330" stroke="#ffd166" strokeWidth="3" fill="none" opacity=".8" />
        <rect x="60" y="222" width="22" height="28" rx="8" fill="#c98a62" />
        <path d="M14 196C10 120 132 112 130 196 140 240 134 300 120 330 112 280 116 230 112 200 100 160 44 160 32 200 28 230 32 280 24 330 10 300 6 240 14 196Z" fill="#e2183c" />
        <path d="M18 182C30 130 116 124 126 182" stroke="#ffd166" strokeWidth="5" fill="none" />
        <circle cx="71" cy="186" r="44" fill="#d89a70" />
        <path d="M30 172C40 140 104 138 112 172 96 160 46 160 30 172Z" fill="#2b1a12" />
        <circle cx="71" cy="160" r="4" fill="#e2183c" /><circle cx="71" cy="152" r="3" fill="#ffd166" />
        <circle cx="55" cy="188" r="5" fill="#2b1a12" /><circle cx="87" cy="188" r="5" fill="#2b1a12" />
        <path d="M58 208C66 218 76 218 84 208" stroke="#b0303a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="93" cy="196" r="5" fill="none" stroke="#ffd166" strokeWidth="2.5" />
        <circle cx="42" cy="202" r="7" fill="#f08a8a" opacity=".5" /><circle cx="100" cy="202" r="7" fill="#f08a8a" opacity=".5" />
      </g>
      <path d="M160 64c-8-10-24-2-16 10l16 16 16-16c8-12-8-20-16-10z" fill="#ffe066" />
    </svg>
  );
}

function Hero({ invite, framed, H1 }: StyleProps) {
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = (framed
    ? ['text-[52px]', 'text-[42px]', 'text-[34px]', 'text-[28px]']
    : ['text-[52px] sm:text-[84px]', 'text-[42px] sm:text-[68px]', 'text-[34px] sm:text-[56px]', 'text-[28px] sm:text-[46px]'])[tier];
  return (
    <header className={`fm-rays relative flex flex-col items-center overflow-hidden text-center text-inv-hero-text ${framed ? 'min-h-[640px]' : 'min-h-dvh'}`}>
      <div className="fm-bulbs pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className={`relative z-10 flex w-full max-w-xl flex-1 flex-col items-center px-9 ${framed ? 'pt-12 pb-12' : 'pt-12 pb-16 sm:pt-16'}`}>
        {invite.blessing && (
          <ScriptText text={invite.blessing} className="text-[22px] text-inv-accent [text-shadow:2px_2px_0_var(--color-inv-deep)]" latinClass="font-baloo font-extrabold tracking-wide" />
        )}
        <Couple className="mt-4 w-[min(78%,300px)]" />
        <H1 className={`-mt-2 font-baloo leading-[0.92] font-extrabold tracking-[-0.01em] -rotate-3 ${size}`}>
          <span className="block font-baloo text-[0.42em] text-inv-accent [text-shadow:3px_3px_0_var(--color-inv-deep)]">presenting</span>
          <span className="fm-title block break-words">{invite.partner1}</span>
          <span className="fm-title block text-[0.6em]">&amp;</span>
          <span className="fm-title block break-words">{invite.partner2}</span>
        </H1>
        <p className="mt-6 rotate-2 rounded-2xl border-[3px] border-white bg-inv-alt px-5 py-2.5 font-baloo text-lg font-extrabold whitespace-nowrap text-white shadow-[4px_4px_0_var(--color-inv-deep)]">
          Releasing <time dateTime={invite.weddingDate}>{formatLongDate(invite.weddingDate).replace(/^\w+, /, '')}</time>
        </p>
        {(invite.venue || invite.city) && <p className="mt-4 font-baloo text-base font-medium opacity-90">Grand premiere at {invite.venue || invite.city}</p>}
        {invite.message && <p className="mt-2 max-w-xs font-baloo text-sm opacity-80">{invite.message}</p>}
        <Countdown date={invite.weddingDate} time={invite.weddingTime} compact={framed} className="mt-5 max-w-[280px]" />
        <a href="#celebrations" className="mt-6 rounded-full bg-inv-accent px-6 py-3 font-baloo text-base font-extrabold text-inv-deep shadow-[3px_3px_0_var(--color-inv-deep)] transition hover:-translate-y-0.5">
          See the show timings
        </a>
      </div>
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const main = mainEventId(invite.events);
  const tints = ['#ffe066', '#c9f0d6', '#ffd3e6', '#ffe8c4', '#d6e4ff', '#e7d6ff'];
  return (
    <section id="celebrations" className="bg-inv-alt px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <H2 className="-rotate-2 text-center font-baloo text-[44px] leading-none font-extrabold text-white [text-shadow:4px_4px_0_rgba(0,0,0,.25)]">Now Showing</H2>
        <NativeLine design={design} kind="events" className="mt-2 text-center text-lg text-inv-accent [text-shadow:1px_1px_0_rgba(0,0,0,.3)]" />
        <SaveAll invite={invite} link={link} framed={framed} className="mt-4 mb-6" />
        <ol className="fm-strip relative rounded-xl bg-[#1d1a18] px-8 py-4">
          {invite.events.map((ev, i) => (
            <li key={ev.id} className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-white p-3 last:mb-0">
              <span className="grid h-14 w-14 flex-none place-items-center rounded-xl text-[26px]" style={{ background: tints[i % tints.length] }} aria-hidden="true">{ev.emoji}</span>
              <div className="min-w-0 flex-1">
                <span className="mb-0.5 inline-block rounded-md bg-[#ffe2ef] px-2 py-0.5 font-baloo text-[11px] font-extrabold text-[#e2267b]">{ev.id === main ? 'THE BIG DAY' : `SCENE ${i + 1}`}</span>
                <H3 className="font-baloo text-[22px] leading-tight font-extrabold text-[#1d1a18]">{ev.name}</H3>
                <p className="font-baloo text-sm text-[#6b6058]"><time dateTime={ev.date} className="whitespace-nowrap">{formatShortDate(ev.date)}</time>{ev.time && <> · <span className="whitespace-nowrap">{ev.time}</span></>}</p>
                {ev.venue && <p className="truncate font-baloo text-sm text-[#6b6058]">{ev.venue}</p>}
                {ev.note && <p className="font-baloo text-xs font-medium text-[#c41c69]">{ev.note}</p>}
              </div>
              <EventActions ev={ev} invite={invite} link={link} framed={framed} className="w-full pl-[68px]" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Swatch({ design, names: [a, b], blessing, size }: SwatchProps) {
  const c = colorsOf(design);
  const rays = Array.from({ length: 20 }, (_, i) => i);
  return (
    <SwatchSvg size={size} band={175}>
      <rect width="400" height="500" fill={c.heroFrom} />
      <g fill={c.heroVia}>
        {rays.map((i) => {
          const a1 = (i / 20) * Math.PI * 2, a2 = a1 + Math.PI / 20;
          return <path key={i} d={`M200 230L${Math.round(200 + Math.cos(a1) * 600)} ${Math.round(230 + Math.sin(a1) * 600)}L${Math.round(200 + Math.cos(a2) * 600)} ${Math.round(230 + Math.sin(a2) * 600)}Z`} />;
        })}
      </g>
      <g fill="#ffe58a">{Array.from({ length: 15 }, (_, i) => <g key={i}><circle cx={14 + i * 26.6} cy="12" r="4" /><circle cx={14 + i * 26.6} cy="488" r="4" /></g>)}</g>
      <SvgScript text={blessing} y={54} size={24} fill={c.accent} latinFont={SVG_FONT.baloo} lang={design.lang} />
      <svg x="110" y="62" width="180" height="218" viewBox="0 0 330 400"><Couple /></svg>
      <g transform="rotate(-3 200 330)" style={{ fontFamily: SVG_FONT.baloo, fontWeight: 800 }} textAnchor="middle" fill="#fff" stroke={c.alt} strokeWidth="5" paintOrder="stroke">
        <text x="200" y="320" fontSize={fit(a, 50, 330, 0.6)}>{a}</text>
        <text x="200" y="352" fontSize="28">&amp;</text>
        <text x="200" y="400" fontSize={fit(b, 50, 330, 0.6)}>{b}</text>
      </g>
      <rect x="110" y="425" width="180" height="34" rx="10" fill={c.alt} stroke="#fff" strokeWidth="3" transform="rotate(2 200 442)" />
      <text x="200" y="448" textAnchor="middle" fill="#fff" style={{ fontFamily: SVG_FONT.baloo, fontWeight: 800 }} fontSize="16" transform="rotate(2 200 442)">Releasing soon</text>
    </SwatchSvg>
  );
}

export const filmy: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-5 py-16 sm:py-20', title: 'Book your seats!', titleClass: 'font-baloo text-[40px] leading-tight font-extrabold text-inv-heading', subClass: 'font-baloo text-muted' },
};
