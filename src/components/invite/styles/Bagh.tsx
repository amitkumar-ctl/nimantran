import { formatLongDate, formatShortDate } from '@/lib/format';
import { Countdown } from '../Countdown';
import { colorsOf, type FullColors, EventActions, fit, NativeLine, nameTier, SaveAll, ScriptText, SVG_FONT, SvgScript, SwatchSvg, type StyleProps, type StyleView, type SwatchProps } from './common';

/*
 * Bagh: hand-painted watercolour flowers on paper. Big left-aligned script
 * names like a letter; functions pinned up as taped cards.
 */

/** Watercolour filters (identical everywhere, so repeated ids are harmless). */
function Filters() {
  return (
    <defs>
      <filter id="bg-wc" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="22" result="d" />
        <feGaussianBlur in="d" stdDeviation="1.6" result="b" />
        <feComposite in="b" in2="d" operator="arithmetic" k2=".6" k3=".6" />
      </filter>
      <filter id="bg-grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="2" /><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .07 0" /></filter>
    </defs>
  );
}

export function Bloom({ color, x = 0, y = 0, s = 1 }: { color: string; x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#bg-wc)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-15" rx="12" ry="17" transform={`rotate(${deg})`} fill={color} opacity=".72" />
      ))}
      <circle r="6" fill="#c87b4e" opacity=".8" />
    </g>
  );
}
export function Leaf({ color, x = 0, y = 0, r = 0, s = 1 }: { color: string; x?: number; y?: number; r?: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} filter="url(#bg-wc)" d="M0 0C18-20 46-20 64 0 46 16 18 16 0 0Z" fill={color} opacity=".75" />;
}

/** Painted clusters pinned to the top-right and bottom-left corners (stay put at any screen shape). */
function Garden({ c }: { c: FullColors }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full"><Filters /><rect width="100%" height="100%" filter="url(#bg-grain)" /></svg>
      <svg viewBox="150 -40 260 280" className="absolute -top-4 -right-6 w-[min(78vw,440px)]">
        <Filters />
        <ellipse cx="300" cy="90" rx="150" ry="110" fill={c.heroFrom} opacity=".6" filter="url(#bg-wc)" />
        <g transform="translate(290 100) rotate(-20)">
          <Leaf color={c.deep} x={-20} y={30} r={140} /><Leaf color={c.deep} x={30} y={-40} r={-60} /><Leaf color={c.deep} x={60} y={30} r={20} s={0.8} />
          <Bloom color={c.alt} s={2.3} /><Bloom color={c.alt} x={80} y={-60} s={1.4} /><Bloom color={c.alt} x={-40} y={-80} s={1.1} />
        </g>
      </svg>
      <svg viewBox="-60 640 300 230" className="absolute -bottom-2 -left-6 w-[min(72vw,400px)]">
        <Filters />
        <ellipse cx="60" cy="760" rx="160" ry="110" fill={c.heroVia} opacity=".8" filter="url(#bg-wc)" />
        <g transform="translate(70 800)">
          <Leaf color={c.deep} r={-150} s={1.2} /><Leaf color={c.deep} x={40} y={-10} r={-70} />
          <Bloom color={c.alt} x={20} y={-30} s={1.6} /><Bloom color={c.alt} x={90} y={-10} />
        </g>
      </svg>
      <svg viewBox="260 620 140 160" className="absolute right-0 bottom-[12%] w-[min(30vw,160px)]">
        <Filters /><ellipse cx="340" cy="700" rx="90" ry="70" fill={c.heroTo} opacity=".55" filter="url(#bg-wc)" />
      </svg>
    </div>
  );
}

function Hero({ invite, design, framed, H1 }: StyleProps) {
  const c = colorsOf(design);
  const tier = nameTier(invite.partner1, invite.partner2);
  const size = (framed
    ? ['text-[76px]', 'text-[62px]', 'text-[50px]', 'text-[40px]']
    : ['text-[76px] sm:text-[112px]', 'text-[62px] sm:text-[96px]', 'text-[50px] sm:text-[78px]', 'text-[40px] sm:text-[62px]'])[tier];
  return (
    <header className={`relative flex flex-col justify-center overflow-hidden bg-inv-surface text-inv-hero-text ${framed ? 'min-h-[640px]' : 'min-h-dvh'}`}>
      <Garden c={c} />
      <div className={`relative z-10 mx-auto w-full max-w-xl px-8 ${framed ? 'pt-40 pb-24' : 'pt-40 pb-28 sm:px-12'}`}>
        {invite.blessing && <ScriptText text={invite.blessing} className="mb-3 text-lg text-inv-accent" latinClass="font-lora italic" />}
        {invite.message && <p className="max-w-xs font-lora text-[17px] leading-relaxed italic opacity-80">{invite.message}</p>}
        <H1 className={`mt-2 font-pinyon leading-[0.95] text-inv-accent ${size}`}>
          <span className="block break-words">{invite.partner1}</span>
          <span className="my-1 ml-2 block font-lora text-[22px] italic opacity-70">and</span>
          <span className="block pl-10 break-words">{invite.partner2}</span>
        </H1>
        <p className="mt-7 font-lora text-base leading-relaxed">
          <b className="font-semibold text-inv-accent"><time dateTime={invite.weddingDate}>{formatLongDate(invite.weddingDate)}</time></b>
          {(invite.venue || invite.city) && <><br />{invite.venue || invite.city}</>}
        </p>
        <Countdown date={invite.weddingDate} time={invite.weddingTime} variant="text" className="mt-2 font-lora text-sm italic opacity-75" />
        <a href="#celebrations" className="mt-6 inline-block bg-inv-primary px-6 py-3.5 font-lora text-[15px] font-semibold text-white shadow-md transition hover:brightness-110" style={{ borderRadius: '30px 6px 30px 6px' }}>
          See our celebrations
        </a>
      </div>
    </header>
  );
}

function Events({ invite, design, framed, link, H2, H3 }: StyleProps) {
  const c = colorsOf(design);
  return (
    <section id="celebrations" className="relative bg-inv-surface px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <H2 className="font-pinyon text-[54px] leading-none text-inv-heading">Celebrations</H2>
        <NativeLine design={design} kind="events" className="mt-1 text-lg text-inv-accent" />
        <p className="mt-1 font-lora text-base text-ink/70 italic">Join us for any or all of them</p>
        <SaveAll invite={invite} link={link} framed={framed} className="mt-4 mb-8" align="start" />
        <ol className="space-y-5">
          {invite.events.map((ev, i) => (
            <li key={ev.id} className={`relative flex items-center gap-3 rounded-[3px] bg-white py-4 pr-4 pl-[78px] shadow-[0_1px_0_#efe6e0,0_10px_22px_-14px_rgba(90,50,60,.45)] ${i % 2 ? 'ml-2 rotate-[1deg]' : 'rotate-[-1.2deg]'}`}>
              <span className="absolute -top-2 left-1/2 h-[18px] w-16 -translate-x-1/2 -rotate-3" style={{ background: `color-mix(in srgb, ${c.alt} 55%, transparent)` }} aria-hidden="true" />
              <svg viewBox="-40 -40 80 80" className="absolute top-1/2 left-3 h-[54px] w-[54px] -translate-y-1/2" aria-hidden="true">
                <Filters />
                {i % 3 === 1
                  ? <><Leaf color={c.deep} x={-34} y={14} r={-35} s={1.1} /><Leaf color={c.deep} x={-14} y={30} r={-95} s={0.9} /><Leaf color={c.deep} x={-30} y={-4} r={15} s={0.7} /></>
                  : i % 3 === 2 ? <><Bloom color={c.alt} x={-10} y={-6} s={1.1} /><Bloom color={c.alt} x={14} y={13} s={0.8} /></>
                    : <Bloom color={c.alt} s={1.6} />}
              </svg>
              <div className="min-w-0 flex-1">
                <H3 className="font-pinyon text-[32px] leading-none text-inv-heading">{ev.name}</H3>
                <p className="mt-1 font-lora text-[13px] font-semibold"><time dateTime={ev.date}>{formatShortDate(ev.date)}</time>{ev.time && <>, {ev.time}</>}</p>
                {ev.venue && <p className="truncate font-lora text-sm text-ink/70 italic">{ev.venue}</p>}
                {ev.note && <p className="font-lora text-xs text-inv-primary italic">{ev.note}</p>}
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
  return (
    <SwatchSvg size={size}>
      <Filters />
      <rect width="400" height="500" fill={c.surface} />
      <g filter="url(#bg-wc)">
        <ellipse cx="320" cy="60" rx="140" ry="100" fill={c.heroFrom} opacity=".7" />
        <ellipse cx="60" cy="470" rx="150" ry="90" fill={c.heroVia} opacity=".9" />
      </g>
      <g transform="translate(320 80) rotate(-20)">
        <Leaf color={c.deep} x={-20} y={30} r={140} /><Leaf color={c.deep} x={30} y={-40} r={-60} />
        <Bloom color={c.alt} s={2} /><Bloom color={c.alt} x={-50} y={40} s={1.1} />
      </g>
      <g transform="translate(60 470)"><Leaf color={c.deep} r={-150} s={1.1} /><Bloom color={c.alt} x={30} y={-20} s={1.4} /></g>
      <SvgScript anchor="start" text={blessing} x={44} y={150} size={20} fill={c.accent} latinFont={SVG_FONT.lora} lang={design.lang} width={220} />
      <g style={{ fontFamily: SVG_FONT.pinyon }} fill={c.accent}>
        <text x="40" y="225" fontSize={fit(a, 78, 320, 0.42)}>{a}</text>
        <text x="48" y="262" fontSize="22" style={{ fontFamily: SVG_FONT.lora, fontStyle: 'italic' }} opacity=".7">and</text>
        <text x="84" y="325" fontSize={fit(b, 78, 290, 0.42)}>{b}</text>
      </g>
    </SwatchSvg>
  );
}

export const bagh: StyleView = {
  Hero, Events, Swatch,
  rsvp: { section: 'bg-inv-surface px-5 py-16 sm:py-20', title: 'Will you join us?', titleClass: 'font-pinyon text-[50px] leading-none text-inv-heading', subClass: 'font-lora italic text-muted' },
};
