'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Check, Copy, Download, ExternalLink, QrCode } from 'lucide-react';
import { upiLink } from '@/lib/format';
import { ShagunReport } from './ShagunReport';

/*
 * UPI shagun.
 *
 * Most UPI apps now block or flag "pay" links that open a payment to a
 * *personal* UPI ID (NPCI safety rules against payment-link scams), so a
 * one-tap "Pay" button often fails. What every app allows:
 *   1. paying to a UPI ID the guest types/pastes → "Copy UPI ID" (primary)
 *   2. scanning a UPI QR code → shown here; on a phone, "Save QR" then
 *      "Scan from gallery" in GPay / PhonePe / Paytm
 * The direct link is kept as a last option (it still works for merchant
 * UPI IDs and in some apps).
 */

const noSubscribe = () => () => {};
// Desktop/laptop (precise pointer): the QR is the easiest way, so show it open.
const useIsDesktop = () => useSyncExternalStore(noSubscribe, () => matchMedia('(pointer: fine)').matches, () => false);

export function Shagun({ upiId, upiName, couple, slug, preview = false }: { upiId: string; upiName: string; couple: string; slug?: string; preview?: boolean }) {
  const [copied, setCopied] = useState(false);
  const isDesktop = useIsDesktop();
  const [qrToggled, setQrToggled] = useState<boolean | null>(null);
  const showQr = qrToggled ?? isDesktop;
  const [svg, setSvg] = useState<string | null>(null);
  const payee = upiName || couple;
  // No note/amount: extra pre-filled details make UPI apps more suspicious.
  const payLink = upiLink(upiId, payee);

  useEffect(() => {
    if (!showQr || !upiId) return;
    let alive = true;
    import('qrcode')
      .then((Q) => Q.toString(payLink, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#2b1d14', light: '#ffffff' } }))
      .then((s) => { if (alive) setSvg(s); });
    return () => { alive = false; };
  }, [showQr, payLink, upiId]);

  if (!upiId) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the ID is visible to copy by hand */
    }
  };

  const saveQr = async () => {
    const Q = await import('qrcode');
    const url = await Q.toDataURL(payLink, { width: 800, margin: 2, errorCorrectionLevel: 'M' });
    const a = document.createElement('a');
    a.href = url;
    a.download = `shagun-upi-qr-${upiId.split('@')[0]}.png`;
    a.click();
  };

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-gold bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">🪔</span>
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold text-inv-heading">Send Shagun</p>
          <p className="text-xs text-muted">Bless the couple from any UPI app</p>
        </div>
      </div>

      {/* 1. UPI ID: always works (Pay → "To UPI ID" → paste) */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-cream px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-wide text-muted uppercase">UPI ID{upiName ? ` · ${upiName}` : ''}</p>
          <p className="font-semibold break-all text-ink select-all">{upiId}</p>
        </div>
        <button type="button" onClick={copy} className="btn btn-primary btn-sm flex-none rounded-full" aria-label={`Copy UPI ID ${upiId}`}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-1.5 text-xs text-muted" aria-live="polite">
        {copied
          ? 'Copied! Now open your UPI app → Pay → “To UPI ID” → paste.'
          : 'Open GPay, PhonePe or Paytm → Pay → “To UPI ID / number” → paste this ID.'}
      </p>

      {/* 2. QR: scan on a laptop, or save and "scan from gallery" on a phone */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline btn-sm rounded-full" aria-expanded={showQr} onClick={() => setQrToggled(!showQr)}>
          <QrCode className="h-3.5 w-3.5" /> {showQr ? 'Hide QR' : 'Show QR'}
        </button>
        {/* 3. Direct link: last resort (often blocked for personal UPI IDs) */}
        <a href={payLink} className="btn btn-ghost btn-sm rounded-full text-inv-primary">
          <ExternalLink className="h-3.5 w-3.5" /> Open UPI app
        </a>
      </div>

      {showQr && (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-line p-3 text-center sm:flex-row sm:text-left">
          <div className="aspect-square w-36 flex-none">
            {svg && <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" role="img" aria-label={`UPI QR code for ${upiId}`} dangerouslySetInnerHTML={{ __html: svg }} />}
          </div>
          <div className="text-xs text-muted">
            <p><b className="text-ink">On a laptop?</b> Scan this with your phone’s UPI app.</p>
            <p className="mt-1"><b className="text-ink">On this phone?</b> Save the QR, then in GPay, PhonePe or Paytm tap Scan → <i>gallery</i> and pick it.</p>
            <button type="button" className="btn btn-outline btn-sm mt-2 rounded-full" onClick={saveQr}>
              <Download className="h-3.5 w-3.5" /> Save QR
            </button>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-snug text-muted/80">
        Some UPI apps block payment links for safety. If “Open UPI app” doesn’t work, use Copy or the QR. Money goes straight to the couple’s account.
      </p>

      <ShagunReport slug={slug} preview={preview} />
    </div>
  );
}
