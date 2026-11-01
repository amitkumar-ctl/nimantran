'use client';

import { useEffect, useRef, useState } from 'react';
import { UpgradeButton, usePlan } from '@/components/premium/Upgrade';
import { rupees } from '@/lib/payments/plan';
import { Download, Loader2, Share2, X } from 'lucide-react';
import type { InviteData } from '@/lib/types';
import { getTemplate } from '@/lib/themes';
import { getLanguage, inviteLanguage, scriptProps } from '@/lib/templates/languages';
import { formatLongDate } from '@/lib/format';
import { cardFileName, drawFamilyCard } from '@/lib/family-card';

/** The message sent with a family's card or link. */
export function familyMessage(invite: InviteData, family: string, link: string) {
  const when = formatLongDate(invite.weddingDate);
  const sal = getLanguage(inviteLanguage(invite.blessing, getTemplate(invite.theme).lang)).salutation;
  return `${sal} ${family},\nWith joy, we invite you and your family to the wedding of ${invite.partner1} & ${invite.partner2} on ${when}${invite.city ? ` in ${invite.city}` : ''}.\n${invite.rsvpEnabled !== false ? 'See all the functions and let us know if you can come' : 'See all the functions and venues'}:\n${link}`;
}

/** wa.me link: to a number if we have one (10 digits = India), otherwise WhatsApp's contact picker. */
export function whatsappUrl(phone: string, text: string) {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits.length >= 11 ? digits : ''}?text=${encodeURIComponent(text)}`;
}

/** Preview a family's card, then share it (phones) or download it. */
export function FamilyCardDialog({ invite, family, link, onClose, onSent, sample = false }: {
  invite: InviteData; family: string; link: string; onClose: () => void; onSent?: () => void;
  /** Unpaid invite: a watermarked preview with no way to send it. */
  sample?: boolean;
}) {
  const fontRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [png, setPng] = useState<{ url: string; blob: Blob } | null>(null);
  const [error, setError] = useState('');
  const design = getTemplate(invite.theme);
  const blessingFont = scriptProps(invite.blessing).className || 'font-display';
  const language = getLanguage(inviteLanguage(invite.blessing, design.lang));
  const langFont = scriptProps(language.salutation, language.code).className || 'font-display';
  const plan = usePlan();
  const canShareFiles = typeof navigator !== 'undefined' && 'canShare' in navigator;

  useEffect(() => {
    let alive = true;
    let made: string | null = null;
    const font = (k: string, fallback: string) => (fontRefs.current[k] ? getComputedStyle(fontRefs.current[k]!).fontFamily : fallback);
    drawFamilyCard({
      family, partner1: invite.partner1, partner2: invite.partner2, blessing: invite.blessing,
      salutation: language.salutation, invited: language.invited, english: language.code === 'en',
      dateLabel: formatLongDate(invite.weddingDate), place: invite.venue || invite.city, link, replies: invite.rsvpEnabled !== false,
      colors: design.colors, nameStyle: design.nameStyle, sample,
      fonts: { script: font('script', 'cursive'), display: font('display', 'serif'), body: font('body', 'sans-serif'), blessing: font('blessing', 'serif'), lang: font('lang', 'serif') },
    })
      .then((canvas) => new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not make the card'))), 'image/jpeg', 0.92)))
      .then((blob) => { if (alive) { made = URL.createObjectURL(blob); setPng({ url: made, blob }); } })
      .catch((e) => alive && setError((e as Error).message));
    return () => { alive = false; if (made) URL.revokeObjectURL(made); };
  }, [family, invite, link, design.colors, design.nameStyle, language, sample]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  const name = cardFileName(family);
  const download = () => {
    if (!png) return;
    const a = document.createElement('a');
    a.href = png.url; a.download = name; a.click();
    onSent?.();
  };
  const share = async () => {
    if (!png) return;
    const file = new File([png.blob], name, { type: 'image/jpeg' });
    const data = { files: [file], text: familyMessage(invite, family, link) };
    if (navigator.canShare?.(data)) {
      try { await navigator.share(data); onSent?.(); } catch { /* closed the share sheet */ }
    } else download();
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[rgba(30,10,6,0.6)] p-4" role="dialog" aria-modal="true" aria-label={`Card for ${family}`} onClick={onClose}>
      <div className="w-full max-w-sm animate-pop rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-display text-xl font-semibold text-maroon-900">Card for {family}</p>
          <button type="button" className="btn btn-ghost btn-sm px-2" aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-xl bg-cream">
          {png
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={png.url} alt={`Invitation card for ${family}`} className="h-full w-full object-contain" />
            : error ? <p className="p-4 text-sm text-red-700">{error}</p> : <Loader2 className="h-6 w-6 animate-spin text-muted" />}
        </div>
        {sample ? (
          <div className="mt-3">
            <p className="mb-3 text-center text-sm text-muted">This is how {family}’s card will look. Publish your invite with Premium to send cards like this, without the stamp, to every family.</p>
            <UpgradeButton inviteId={invite.id} className="btn btn-primary w-full">Publish with Premium · {plan ? rupees(plan.price) : ''}</UpgradeButton>
          </div>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="btn btn-primary" disabled={!png} onClick={share}><Share2 className="h-4 w-4" /> {canShareFiles ? 'Share' : 'Save'}</button>
              <button type="button" className="btn btn-outline" disabled={!png} onClick={download}><Download className="h-4 w-4" /> Download</button>
            </div>
            <p className="mt-2 text-center text-xs text-muted">On a phone, Share sends the card with their link straight to WhatsApp.</p>
          </>
        )}
        {/* The site's fonts, measured to draw the card with them */}
        <span aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
          <span ref={(el) => { fontRefs.current.script = el; }} className="font-script">a</span>
          <span ref={(el) => { fontRefs.current.display = el; }} className="font-display">a</span>
          <span ref={(el) => { fontRefs.current.body = el; }} className="font-sans">a</span>
          <span ref={(el) => { fontRefs.current.blessing = el; }} className={blessingFont}>a</span>
          <span ref={(el) => { fontRefs.current.lang = el; }} className={langFont}>a</span>
        </span>
      </div>
    </div>
  );
}
