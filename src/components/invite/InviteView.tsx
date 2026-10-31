import type { ReactNode } from 'react';
import { sharePath } from '@/lib/links';
import { MapPin } from 'lucide-react';
import type { InviteData } from '@/lib/types';
import { formatHeroDate, formatLongDate, formatShortDate, mapsSearchUrl } from '@/lib/format';
import { Countdown } from './Countdown';
import { AddToCalendar } from './AddToCalendar';
import { absoluteUrl } from '@/config/site';
import { Divider } from './Mandala';
import { Crest, HeroFrame, initialsOf, nameClass } from './Ornaments';
import { getTemplate, themeVars } from '@/lib/themes';
import { STYLE_VIEWS } from './styles';
import { ForFamily } from './ForFamily';
import { inviteLanguage } from '@/lib/templates/languages';
import { NativeLine, ScriptText } from './styles/common';

const EVENT_TINTS = ['#fdf1c7', '#e3f2df', '#f6e1ec', '#f9dede', '#e4e6f7', '#e6f3f7', '#f3eadf'];

type Props = {
  invite: InviteData;
  /** RSVP area: the live form on the public page, a preview in the editor. */
  rsvpSlot?: ReactNode;
  shagunSlot?: ReactNode;
  /** Editor preview renders inside a phone frame instead of the full viewport. */
  framed?: boolean;
};

/**
 * Presentational invite, shared by the public page (server-rendered, so
 * crawlers and WhatsApp previews see real HTML) and the editor's live preview.
 */
export function InviteView({ invite, rsvpSlot, shagunSlot, framed = false }: Props) {
  const hero = framed ? 'min-h-[640px]' : 'min-h-dvh';
  const link = absoluteUrl(sharePath(invite));
  // Previews (editor, marketing mock-ups) use neutral tags so the host page
  // keeps a single <h1> and a clean heading outline for SEO.
  const H1 = framed ? 'p' : 'h1';
  const H2 = framed ? 'p' : 'h2';
  const H3 = framed ? 'p' : 'h3';
  const design = getTemplate(invite.theme);
  const theme = design.id;
  // Replies can be switched off (an invitation card only); shagun shows when a UPI ID is set.
  const replies = invite.rsvpEnabled !== false ? rsvpSlot : null;
  const shagun = invite.upiId ? shagunSlot : null;

  // Styled looks (palace, envelope, temple…) draw their own hero and functions.
  if (design.layout !== 'classic') {
    const view = STYLE_VIEWS[design.layout];
    const props = { invite, design, framed, link, H1, H2, H3 } as const;
    return (
      <div style={themeVars(theme)} className="bg-inv-surface text-ink">
        {/* The envelope look addresses the family on the envelope itself. */}
        {design.layout !== 'lifafa' && <ForFamily lang={inviteLanguage(invite.blessing, design.lang)} />}
        <view.Hero {...props} />
        {invite.events.length > 0 && <view.Events {...props} />}
        {(replies || shagun) && (
          <section id="rsvp" className={view.rsvp.section} style={view.rsvp.style}>
            <div className="mx-auto max-w-md">
              <H2 className={`text-center ${view.rsvp.titleClass}`}>{replies ? view.rsvp.title : 'With your blessings'}</H2>
              <NativeLine design={design} kind="welcome" className="mt-1 text-center text-lg text-inv-primary" />
              {replies && invite.rsvpDeadline && <p className={`mt-1 mb-6 text-center ${view.rsvp.subClass}`}>Please reply by {formatLongDate(invite.rsvpDeadline)}</p>}
              {!(replies && invite.rsvpDeadline) && <div className="mb-6" />}
              {replies}
              {shagun}
            </div>
          </section>
        )}
      </div>
    );
  }
  // Long names shrink so they stay inside the border on small phones.
  const longest = Math.max(invite.partner1.length, invite.partner2.length);
  // Long names step down in size. The phone-frame preview always uses the
  // phone sizes, even on a wide screen. (Class names are written out in full
  // so Tailwind can find them.)
  const tier = longest > 14 ? 3 : longest > 11 ? 2 : longest > 7 ? 1 : 0;
  const nameSize = (design.nameStyle === 'serif'
    ? framed ? ['text-[40px]', 'text-[34px]', 'text-[28px]', 'text-[24px]'] : ['text-[40px] sm:text-[64px]', 'text-[34px] sm:text-[56px]', 'text-[28px] sm:text-[46px]', 'text-[24px] sm:text-[38px]']
    : framed ? ['text-[54px]', 'text-[46px]', 'text-[38px]', 'text-[32px]'] : ['text-[54px] sm:text-[84px]', 'text-[46px] sm:text-[76px]', 'text-[38px] sm:text-[64px]', 'text-[32px] sm:text-[54px]'])[tier];
  return (
    <div style={themeVars(theme)} className="bg-inv-surface text-ink">
      <ForFamily lang={inviteLanguage(invite.blessing, design.lang)} />
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header
        className={`relative flex ${hero} flex-col items-center justify-center overflow-hidden ${framed ? 'px-12' : 'px-10 sm:px-16'} text-center text-inv-hero-text ${design.frame === 'arch' || design.frame === 'toran' ? 'pt-24 pb-12 sm:pt-28' : 'py-12 sm:py-16'}`}
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, var(--color-inv-hero-from) 0%, var(--color-inv-hero-via) 45%, var(--color-inv-hero-to) 100%)',
        }}
      >
        <HeroFrame frame={design.frame} />

        <Crest ornament={design.ornament} initials={initialsOf(invite.partner1, invite.partner2)} className="relative mb-2 h-24 w-24 animate-fade-up text-inv-accent sm:h-36 sm:w-36" />
        {invite.blessing && (
          // Any script: Devanagari, Tamil, Bengali, Urdu… gets its own font and lang.
          <ScriptText text={invite.blessing}
            className="relative mb-4 text-xl tracking-wide text-inv-accent sm:mb-6 sm:text-[22px]"
            latinClass="font-display font-semibold uppercase tracking-[0.2em] sm:text-2xl" />
        )}
        {invite.message && (
          <p className={`relative max-w-sm font-display text-base italic leading-relaxed opacity-90 ${framed ? '' : 'sm:text-lg'}`}>{invite.message}</p>
        )}

        <H1 className={`mt-3 mb-1 max-w-full ${nameClass(design.nameStyle)} leading-[1.05] text-inv-accent ${nameSize} ${design.dark ? 'drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]' : ''}`}>
          {invite.partner1}
          <span className={`block opacity-90 ${framed ? 'text-[34px]' : 'text-[34px] sm:text-5xl'}`}>&amp;</span>
          {invite.partner2}
        </H1>

        <p className={`relative mt-3 whitespace-nowrap font-display font-semibold uppercase ${framed ? 'text-base tracking-[0.14em]' : 'text-base tracking-[0.14em] sm:text-xl sm:tracking-[0.18em]'}`}>
          <time dateTime={invite.weddingDate}>{formatHeroDate(invite.weddingDate)}</time>
        </p>
        {(invite.venue || invite.city) && (
          <p className="mt-1 font-display text-lg opacity-85">{invite.venue || invite.city}</p>
        )}

        <Countdown date={invite.weddingDate} time={invite.weddingTime} compact={framed} />
        <a href="#celebrations" className="absolute bottom-9 text-xs tracking-[0.2em] opacity-70 transition hover:opacity-100">
          SCROLL ↓
        </a>
      </header>

      {/* ── Functions ─────────────────────────────────────────────────── */}
      {invite.events.length > 0 && (
        <section id="celebrations" className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
          <H2 className="text-center font-display text-4xl font-semibold text-inv-heading">The Celebrations</H2>
          <p className="mt-1 mb-5 text-center font-display text-lg italic text-muted">
            {formatLongDate(invite.events[0].date)}
            {invite.events.length > 1 && <> – {formatLongDate(invite.events[invite.events.length - 1].date)}</>}
          </p>
          <Divider />
          <div className="mb-4 flex justify-center">
            <AddToCalendar invite={invite} link={link} disabled={framed} label="Save all dates" />
          </div>
          <ol className="space-y-3">
            {invite.events.map((ev, i) => {
              // Falls back to the main venue when a function has no venue of its own.
              const place = ev.venue || invite.venue;
              const map = ev.mapUrl || (place ? mapsSearchUrl([place, invite.city].filter(Boolean).join(', ')) : '');
              return (
                <li key={ev.id} className="card flex items-center gap-4 p-4">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-xl text-2xl" style={{ background: EVENT_TINTS[i % EVENT_TINTS.length] }} aria-hidden="true">
                    {ev.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <H3 className="font-display text-[22px] font-semibold leading-tight text-inv-heading">{ev.name}</H3>
                    <p className="text-[13px] text-muted">
                      <time dateTime={ev.date} className="whitespace-nowrap">{formatShortDate(ev.date)}</time>
                      {ev.time && <> · <span className="whitespace-nowrap">{ev.time}</span></>}
                    </p>
                    {ev.venue && <p className="truncate text-[13px] text-muted">{ev.venue}</p>}
                    {ev.note && <p className="mt-0.5 text-xs italic text-inv-primary">{ev.note}</p>}
                  </div>
                  <div className="flex flex-none flex-col items-stretch gap-1.5">
                    {map && (
                      <a href={map} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm rounded-full text-inv-primary" aria-label={`Open ${ev.name} venue in Google Maps`}>
                        <MapPin className="h-3.5 w-3.5" /> Map
                      </a>
                    )}
                    <AddToCalendar invite={invite} event={ev} link={link} disabled={framed} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* ── RSVP + Shagun ─────────────────────────────────────────────── */}
      {(replies || shagun) && (
        <section id="rsvp" className="bg-gradient-to-b from-inv-surface to-cream-2/70 px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-md">
            <H2 className="text-center font-display text-4xl font-semibold text-inv-heading">{replies ? 'Will you join us?' : 'With your blessings'}</H2>
            {replies && invite.rsvpDeadline && (
              <p className="mt-1 mb-6 text-center font-display text-lg italic text-muted">Please reply by {formatLongDate(invite.rsvpDeadline)}</p>
            )}
            {replies}
            {shagun}
          </div>
        </section>
      )}
    </div>
  );
}
