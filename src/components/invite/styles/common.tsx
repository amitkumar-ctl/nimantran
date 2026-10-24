import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { MapPin } from 'lucide-react';
import type { InviteData } from '@/lib/types';
import type { TemplateInfo } from '@/lib/themes';
import type { Colors } from '@/lib/templates/types';
import { getLanguage, scriptProps } from '@/lib/templates/languages';
import { mapsSearchUrl } from '@/lib/format';
import { AddToCalendar } from '../AddToCalendar';

export type Tag = 'h1' | 'h2' | 'h3' | 'p';
export type InviteEventData = InviteData['events'][number];

export type StyleProps = {
  invite: InviteData;
  design: TemplateInfo;
  /** Phone-frame preview (editor, marketing): fixed phone sizes, no page-level headings. */
  framed: boolean;
  /** Public link of the invite (for calendar entries). */
  link: string;
  H1: Tag; H2: Tag; H3: Tag;
};

export type SwatchProps = { design: TemplateInfo; names: [string, string]; blessing: string; city: string; size: 'sm' | 'md' | 'lg' };

export type StyleView = {
  Hero: ComponentType<StyleProps>;
  Events: ComponentType<StyleProps>;
  /** Looks for the RSVP + shagun section. */
  rsvp: { section: string; style?: CSSProperties; title: string; titleClass: string; subClass: string };
  Swatch: ComponentType<SwatchProps>;
};

/** A design's colours with the optional extras filled in. */
export type FullColors = Required<Colors>;
export const colorsOf = (d: TemplateInfo): FullColors => ({ alt: d.colors.accent, deep: d.colors.heroTo, ...d.colors } as FullColors);

/** Text in any script (Tamil, Urdu, Bengali…) with the right font, lang and direction. */
export function ScriptText({ text, as: As = 'p', className = '', latinClass = '', lang: hint }: { text: string; as?: 'p' | 'span' | 'div'; className?: string; latinClass?: string; lang?: string }) {
  const s = scriptProps(text, hint);
  return (
    <As lang={s.lang} dir={s.dir} className={`${className} ${s.script === 'latin' ? latinClass : `${s.className} ${s.script === 'urdu' ? 'leading-[2.1]' : 'leading-snug'}`}`}>
      {text}
    </As>
  );
}

/** The design's language line under a heading ("நிகழ்ச்சிகள்", "অনুষ্ঠান"…); nothing for English designs. */
export function NativeLine({ design, kind, className = '' }: { design: TemplateInfo; kind: 'events' | 'welcome'; className?: string }) {
  const text = getLanguage(design.lang)[kind];
  if (!text) return null;
  return <ScriptText text={text} lang={design.lang} className={className} />;
}

/** 0 (short names) … 3 (very long): pick one of four sizes so names stay inside the art. */
export function nameTier(a: string, b: string) {
  const longest = Math.max(a.length, b.length);
  return longest > 14 ? 3 : longest > 11 ? 2 : longest > 7 ? 1 : 0;
}

/** The ceremony itself (wedding, nikah, muhurtham, anand karaj…) gets highlighted in some looks. */
const MAIN = /\b(wedding|vivah|shaadi|shadi|nikah|muhurt\w*|anand karaj|biye|biya|lagna|lagan|pelli|holy matrimony|pheras?|kalyanam|marriage)\b/i;
export function mainEventId(events: InviteEventData[]) {
  return (events.find((e) => MAIN.test(e.name)) ?? null)?.id ?? null;
}

/** "9:15 AM" → { big: '9:15', small: 'am' }, "7:00 PM" → { big: '7', small: 'pm' } */
export function splitTime(t: string) {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?/.exec(t.trim());
  if (!m) return { big: t, small: '' };
  return { big: m[2] && m[2] !== '00' ? `${m[1]}:${m[2]}` : m[1], small: (m[3] ?? '').toLowerCase() };
}

/** Map + calendar buttons for one function (map falls back to the main venue). */
export function EventActions({ ev, invite, link, framed, className = '', vertical = false }: { ev: InviteEventData; invite: InviteData; link: string; framed: boolean; className?: string; vertical?: boolean }) {
  const place = ev.venue || invite.venue;
  const map = ev.mapUrl || (place ? mapsSearchUrl([place, invite.city].filter(Boolean).join(', ')) : '');
  return (
    <div className={`flex flex-none gap-1.5 ${vertical ? 'flex-col items-stretch' : 'flex-wrap items-center'} ${className}`}>
      {map && (
        <a href={map} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm rounded-full text-inv-primary" aria-label={`Open ${ev.name} venue in Google Maps`}>
          <MapPin className="h-3.5 w-3.5" /> Map
        </a>
      )}
      <AddToCalendar invite={invite} event={ev} link={link} disabled={framed} />
    </div>
  );
}

/** Small "Save all dates" + heading row used under most event headings. */
export function SaveAll({ invite, link, framed, className = '', align = 'center' }: { invite: InviteData; link: string; framed: boolean; className?: string; align?: 'center' | 'start' }) {
  return (
    <div className={`flex ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}>
      <AddToCalendar invite={invite} link={link} disabled={framed} label="Save all dates" />
    </div>
  );
}

/** Font size (SVG units) that fits `text` into `width`, given the font's average glyph width. */
export function fit(text: string, base: number, width: number, em = 0.55) {
  return Math.min(base, width / Math.max(1, text.length * em));
}

/** Swatch viewBox: the whole card when large, a band around the names when small. */
export const swatchBox = (size: SwatchProps['size']) => (size === 'lg' ? '0 0 400 500' : '0 130 400 240');

export function SwatchSvg({ size, children, label }: { size: SwatchProps['size']; children: ReactNode; label?: string }) {
  const dims = { sm: 'h-20', md: 'h-28', lg: 'aspect-[4/5]' }[size];
  return (
    <svg viewBox={swatchBox(size)} preserveAspectRatio="xMidYMid slice" className={`block w-full ${dims}`} aria-hidden="true" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

const SVG_SCRIPT_FONT: Record<string, string> = {
  deva: 'var(--font-tiro), serif', beng: 'var(--nf-bn), serif', guru: 'var(--nf-pa), serif', gujr: 'var(--nf-gu), serif', orya: 'var(--nf-or), serif',
  taml: 'var(--nf-ta), serif', telu: 'var(--nf-te), serif', knda: 'var(--nf-kn), serif', mlym: 'var(--nf-ml), serif', arab: 'var(--nf-arabic), serif', urdu: 'var(--nf-urdu), serif',
};

/** Latin font stacks for swatch SVG text. */
export const SVG_FONT = {
  cinzel: 'var(--nf-cinzel), Georgia, serif', pinyon: 'var(--nf-pinyon), cursive', lora: 'var(--nf-lora), Georgia, serif',
  bodoni: 'var(--nf-bodoni), Georgia, serif', josefin: 'var(--nf-josefin), sans-serif', limelight: 'var(--nf-limelight), Georgia, serif',
  poiret: 'var(--nf-poiret), sans-serif', baloo: 'var(--nf-baloo), sans-serif', yatra: 'var(--nf-yatra), serif', italiana: 'var(--nf-italiana), serif',
  marcellus: 'var(--nf-marcellus), Georgia, serif', amiri: 'var(--nf-amiri), Georgia, serif', vibes: 'var(--font-vibes), cursive',
};

/** A line of script text inside a swatch SVG (with the right font and direction). */
export function SvgScript({ text, x = 200, y, size, fill, latinFont, lang, width = 300, anchor = 'middle' }: { text: string; x?: number; y: number; size: number; fill: string; latinFont: string; lang?: string; width?: number; anchor?: 'start' | 'middle' }) {
  const s = scriptProps(text, lang);
  // Raw next/font variables (Tailwind's @theme tokens aren't guaranteed to exist as CSS variables).
  const font = s.script === 'latin' ? latinFont : SVG_SCRIPT_FONT[s.script];
  return (
    // No `direction`: the bidi algorithm already orders Arabic/Urdu, and anchoring stays left-to-right.
    <text x={x} y={y} textAnchor={anchor} fill={fill} style={{ fontFamily: font, fontSize: fit(text, size, width, s.script === 'latin' ? 0.6 : 0.75) }}>
      {text}
    </text>
  );
}

/** Seeded pseudo-random numbers, identical on server and browser (no hydration drift). */
export function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
export const r2 = (n: number) => Math.round(n * 100) / 100;
