import { formatLongDate, formatShortDate, mapsSearchUrl } from '@/lib/format';
import { Countdown } from '../Countdown';
import { initialsOf } from '../Ornaments';
import { GuestName } from './GuestName';
import { colorsOf, EventActions, fit, NativeLine, nameTier, SaveAll, ScriptText, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Lifafa: the invite arrives as a sealed velvet envelope addressed to the
 * guest's family (?to=Sharma%20Parivar). Tapping breaks the wax seal and a
 * letterpress card slides out.
 *
 * Opening is pure CSS (a checkbox + label), so it works before any
 * JavaScript loads and the card's text is always in the HTML. Previews
 * (`framed`) open by themselves after a moment.
 */

function Seal({ initials, color, className = '' }: { initials: string; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 84 84" className={className} aria-hidden="true">
      <path d="M42 2C52 4 56 0 64 8 72 14 70 20 78 28 84 38 80 44 82 52 80 62 72 64 68 72 60 80 52 78 42 82 32 80 26 82 18 74 10 68 12 60 4 52 0 42 4 36 2 28 8 18 14 18 22 8 30 2 34 4 42 2Z" fill={color} />
      <circle cx="42" cy="42" r="28" fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="2" />
      <circle cx="42" cy="42" r="22" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
      <text x="42" y="51" textAnchor="middle" fill="#000" fillOpacity=".5" style={{ fontFamily: 'var(--font-vibes), cursive' }} fontSize="26">{initials.split('').join(' ')}</text>
    </svg>
  );
}

function Envelope({ initials, deep, seal }: { initials: string; deep: string; seal: string }) {
  return (
    <div className="lf-env relative aspect-[330/250] w-[min(86%,380px)] rounded-[10px] shadow-[0_30px_50px_-20px_rgba(40,10,20,.6)]"
      style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${deep} 88%, #fff), color-mix(in srgb, ${deep} 70%, #000))`, boxShadow: `0 30px 50px -20px rgba(40,10,20,.6), inset 0 0 0 2px color-mix(in srgb, ${seal} 55%, transparent)` }}>
      <svg viewBox="0 0 330 250" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 250L130 120M330 250L200 120" stroke="rgba(0,0,0,.25)" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 330 250" preserveAspectRatio="none" className="lf-flap absolute inset-0 h-full w-full origin-top" aria-hidden="true">
        <path d="M0 0L165 135L330 0Z" fill={`color-mix(in srgb, ${deep} 92%, #fff)`} stroke={`color-mix(in srgb, ${seal} 60%, transparent)`} strokeWidth="1.5" />
      </svg>
      <Seal initials={initials} color={seal} className="lf-seal absolute top-[54%] left-1/2 w-[25%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_6px_rgba(40,10,10,.4)]" />
    </div>
  );
}

function Hero({ invite, design, framed, H1 }: StyleProps) {
  const c = colorsOf(design);
  const id = `lf-${invite.slug}-${framed ? 'p' : 'm'}`;
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = (framed ? ['text-[54px]', 'text-[46px]', 'text-[38px]', 'text-[32px]'] : ['text-[54px] sm:text-[68px]', 'text-[46px] sm:text-[58px]', 'text-[38px] sm:text-[48px]', 'text-[32px] sm:text-[40px]'])[tier];
  const place = invite.venue || invite.city;
  const bg = { background: 'radial-gradient(120% 80% at 50% 30%, var(--color-inv-hero-from), var(--color-inv-hero-to))' };
  return (
    <header className={`lf relative flex flex-col items-center justify-start overflow-hidden text-inv-hero-text ${framed ? 'lf-auto min-h-[640px]' : 'min-h-dvh'}`} style={bg}>
      <input type="checkbox" id={id} className="lf-toggle peer sr-only" aria-label="Open the invitation" />

      {/* Envelope back, behind the card */}
      <div className="absolute inset-x-4 bottom-8 mx-auto h-[30%] max-w-[440px] rounded-[10px]" style={{ background: `linear-gradient(160deg, ${c.deep}, color-mix(in srgb, ${c.deep} 70%, #000))`, boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${c.alt} 55%, transparent)` }} aria-hidden="true" />

      {/* The card */}
      <div className={`lf-card relative z-10 mx-6 mt-10 mb-20 w-[calc(100%-48px)] max-w-[400px] rounded bg-[#fffaf3] px-6 pt-10 pb-8 text-center shadow-[0_20px_40px_-18px_rgba(60,10,20,.5)] ${framed ? '' : 'sm:mt-16'}`}>
        <div className="pointer-events-none absolute inset-3 border" style={{ borderColor: c.alt }} aria-hidden="true" />
        <label htmlFor={id} className="absolute top-4 right-5 z-10 cursor-pointer font-marcellus text-[11px] opacity-50 hover:opacity-90">Seal again</label>
        {invite.blessing && <ScriptText text={invite.blessing} className="relative text-[17px] text-inv-accent" latinClass="font-marcellus tracking-[0.14em]" />}
        {invite.message && <p className="relative mt-4 font-marcellus text-[15px] leading-relaxed opacity-80">{invite.message}</p>}
        <H1 className={`relative mt-3 font-script leading-none text-inv-accent ${size}`}>
          <span className="block break-words">{invite.partner1}</span>
          <span className="my-1 block font-italiana text-lg tracking-[0.3em]">AND</span>
          <span className="block break-words">{invite.partner2}</span>
        </H1>
        <p className="relative mt-5 font-italiana text-[21px] tracking-[0.22em] whitespace-nowrap"><time dateTime={invite.weddingDate}>{invite.weddingDate.split('-').reverse().join(' . ')}</time></p>
        <p className="relative mt-1 font-marcellus text-sm opacity-80">{formatLongDate(invite.weddingDate).split(',')[0]}{place && <><br />{place}</>}</p>
        <Countdown date={invite.weddingDate} time={invite.weddingTime} variant="text" className="relative mt-2 font-marcellus text-xs tracking-wider opacity-60" />
        <div className="relative mt-6 flex flex-wrap justify-center gap-2 font-marcellus text-[13px]">
          {invite.rsvpEnabled !== false && <a href="#rsvp" className="rounded-full bg-inv-accent px-4 py-2.5 text-white">Reply</a>}
          <a href="#celebrations" className="rounded-full border border-inv-accent px-4 py-2.5 text-inv-accent">Functions</a>
          {place && <a href={mapsSearchUrl([place, invite.city].filter(Boolean).join(', '))} target="_blank" rel="noopener noreferrer" className="rounded-full border border-inv-accent px-4 py-2.5 text-inv-accent">Map</a>}
        </div>
      </div>

      {/* The sealed envelope, on top until opened */}
      <label htmlFor={id} className="lf-cover absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center px-6 text-center" style={bg}>
        <span className="font-italiana text-sm tracking-[0.3em] opacity-70">WITH LOVE, FOR</span>
        <GuestName fallback="You & your family" className="mt-2 mb-12 block max-w-full font-script text-[38px] leading-tight text-inv-accent sm:text-[46px]" />
        <Envelope initials={initialsOf(invite.partner1, invite.partner2)} deep={c.deep} seal={c.alt} />
        <span className="mt-12 font-italiana text-lg tracking-[0.26em] text-inv-accent">TAP TO OPEN</span>
        <span className="mt-3 font-marcellus text-sm opacity-75">{invite.partner1} &amp; {invite.partner2} have an invitation for you</span>
        <span className="absolute bottom-10 font-marcellus text-sm opacity-70">{formatLongDate(invite.weddingDate).replace(/^\w+, /, '')}{invite.city && <><br />{invite.city}</>}</span>
      </label>
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const c = colorsOf(design);
  return (
    <section id="celebrations" className="px-5 py-16 sm:py-20" style={{ background: 'linear-gradient(180deg, var(--color-inv-hero-to), var(--color-inv-surface) 30%)' }}>
      <div className="mx-auto max-w-md">
        <H2 className="text-center font-italiana text-[30px] tracking-[0.2em] text-inv-heading uppercase">The Celebrations</H2>
        <NativeLine design={design} kind="events" className="mt-1 text-center text-lg text-inv-accent" />
        <SaveAll invite={invite} link={link} framed={framed} className="mt-4 mb-8" />
        <ol className="space-y-4">
          {invite.events.map((ev) => (
            <li key={ev.id} className="relative rounded bg-[#fffaf3] px-6 py-6 text-center shadow-[0_12px_28px_-18px_rgba(60,10,20,.5)]">
              <div className="pointer-events-none absolute inset-2.5 border" style={{ borderColor: `color-mix(in srgb, ${c.alt} 70%, transparent)` }} aria-hidden="true" />
              <H3 className="relative font-script text-[38px] leading-none text-inv-accent">{ev.name}</H3>
              <p className="relative mt-2 font-italiana text-[15px] tracking-[0.18em] uppercase"><time dateTime={ev.date}>{formatShortDate(ev.date)}</time>{ev.time && <> · {ev.time}</>}</p>
              {ev.venue && <p className="relative font-marcellus text-sm opacity-75">{ev.venue}</p>}
              {ev.note && <p className="relative mt-1 font-marcellus text-xs text-inv-accent italic">{ev.note}</p>}
              <EventActions ev={ev} invite={invite} link={link} framed={framed} className="relative mt-3 justify-center" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Swatch({ design, names: [a, b], blessing, size }: SwatchProps) {
  const c = colorsOf(design);
  const ini = initialsOf(a, b);
  return (
    <SwatchSvg size={size}>
      <defs><radialGradient id={`lf-${design.id}`} cx=".5" cy=".3" r=".9"><stop offset="0" stopColor={c.heroFrom} /><stop offset="1" stopColor={c.heroTo} /></radialGradient></defs>
      <rect width="400" height="500" fill={`url(#lf-${design.id})`} />
      <SvgScript text={blessing} y={84} size={18} fill={c.heroText} latinFont={SVG_FONT.italiana} lang={design.lang} width={280} />
      <text x="200" y="128" textAnchor="middle" fill={c.accent} style={{ fontFamily: SVG_FONT.vibes }} fontSize={fit(`${a} & ${b}`, 40, 330, 0.42)}>{a} &amp; {b}</text>
      <rect x="50" y="170" width="300" height="220" rx="10" fill={c.deep} />
      <path d="M50 390L168 280M350 390L232 280" stroke="#000" strokeOpacity=".25" strokeWidth="1.5" />
      <path d="M50 170L200 292L350 170Z" fill={c.deep} stroke={c.alt} strokeOpacity=".7" strokeWidth="1.5" style={{ filter: 'brightness(1.12)' }} />
      <svg x="160" y="250" width="80" height="80" viewBox="0 0 84 84"><path d="M42 2C52 4 56 0 64 8 72 14 70 20 78 28 84 38 80 44 82 52 80 62 72 64 68 72 60 80 52 78 42 82 32 80 26 82 18 74 10 68 12 60 4 52 0 42 4 36 2 28 8 18 14 18 22 8 30 2 34 4 42 2Z" fill={c.alt} /><circle cx="42" cy="42" r="26" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="2" /><text x="42" y="51" textAnchor="middle" fill="#000" fillOpacity=".5" style={{ fontFamily: SVG_FONT.vibes }} fontSize="26">{ini.split('').join(' ')}</text></svg>
      <text x="200" y="440" textAnchor="middle" fill={c.accent} style={{ fontFamily: SVG_FONT.italiana, letterSpacing: 6 }} fontSize="17">TAP TO OPEN</text>
    </SwatchSvg>
  );
}

export const lifafa: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-5 py-16 sm:py-20', title: 'Will you join us?', titleClass: 'font-italiana text-[32px] tracking-[0.12em] text-inv-heading', subClass: 'font-marcellus text-muted' },
};
