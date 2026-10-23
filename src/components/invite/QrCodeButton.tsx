'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Loader2, QrCode, X } from 'lucide-react';

/*
 * QR code for printed cards: scanning it opens the invite website.
 * Shows a ready-to-print card (names + QR) to download as PNG, plus a bare
 * SVG of the QR for printers/designers. The QR library loads only when the
 * dialog opens, so it doesn't slow down the editor.
 */

type Props = { link: string; names: string; colour: string; slug: string };

export function QrCodeButton(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>
        <QrCode className="h-4 w-4" /> QR code
      </button>
      {open && <QrDialog {...props} onClose={() => setOpen(false)} />}
    </>
  );
}

const loadQr = () => import('qrcode');

function QrDialog({ link, names, colour, slug, onClose }: Props & { onClose: () => void }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scriptRef = useRef<HTMLSpanElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let alive = true;
    loadQr()
      .then((Q) => Q.toString(link, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: colour, light: '#ffffff' } }))
      .then((s) => { if (alive) setSvg(s); });
    return () => { alive = false; };
  }, [link, colour]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  const file = slug.replace(/[^a-z0-9-]/gi, '');
  const save = (href: string, name: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = name;
    a.click();
  };

  // A print-ready card: names, QR, a line of text and the link (1200×1500 px).
  async function downloadCard() {
    setBusy(true);
    try {
      const Q = await loadQr();
      const qr = document.createElement('canvas');
      await Q.toCanvas(qr, link, { width: 760, margin: 1, errorCorrectionLevel: 'M', color: { dark: colour, light: '#ffffff' } });
      const c = document.createElement('canvas');
      c.width = 1200;
      c.height = 1500;
      const g = c.getContext('2d')!;
      // Use the site's own fonts (next/font gives them generated names).
      const script = scriptRef.current ? getComputedStyle(scriptRef.current).fontFamily : 'cursive';
      const display = displayRef.current ? getComputedStyle(displayRef.current).fontFamily : 'serif';
      await document.fonts.ready;
      g.fillStyle = '#ffffff';
      g.fillRect(0, 0, c.width, c.height);
      g.strokeStyle = colour;
      g.lineWidth = 6;
      g.strokeRect(40, 40, c.width - 80, c.height - 80);
      g.lineWidth = 2;
      g.strokeRect(58, 58, c.width - 116, c.height - 116);
      g.fillStyle = colour;
      g.textAlign = 'center';
      g.font = `96px ${script}`;
      g.fillText(names, c.width / 2, 210, c.width - 200);
      g.font = `600 40px ${display}`;
      g.fillText('Scan to open our wedding invitation', c.width / 2, 300);
      g.drawImage(qr, (c.width - 760) / 2, 360);
      g.font = `32px ${display}`;
      g.fillText('Functions · Venue maps · RSVP', c.width / 2, 1200);
      g.font = `28px ${display}`;
      g.fillText(link.replace(/^https?:\/\//, ''), c.width / 2, 1290, c.width - 200);
      save(c.toDataURL('image/png'), `${file}-qr-card.png`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(30,10,6,0.6)] p-4" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={onClose}>
      <div className="w-full max-w-sm animate-pop rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 id="qr-title" className="font-display text-2xl font-semibold text-maroon-900">QR code for printed cards</h2>
            <p className="text-sm text-muted">Guests scan it to open your invite, see the venues and RSVP.</p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm -mr-2 px-2" onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: colour, color: colour }}>
          <span ref={scriptRef} className="block font-script text-3xl leading-tight">{names}</span>
          <span ref={displayRef} className="mb-2 block font-display text-sm font-semibold">Scan to open our wedding invitation</span>
          <div className="mx-auto aspect-square w-52">
            {svg ? (
              // SVG produced by the QR library from our own link.
              <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
              <div className="grid h-full w-full place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
            )}
          </div>
          <span className="mt-2 block break-all text-[11px] text-muted">{link.replace(/^https?:\/\//, '')}</span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" className="btn btn-primary btn-sm" disabled={!svg || busy} onClick={downloadCard}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Card (PNG)
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={!svg}
            onClick={() => svg && save(URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), `${file}-qr.svg`)}
          >
            <Download className="h-4 w-4" /> QR only (SVG)
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">Tip: print the QR at least 2.5 cm wide. The SVG stays sharp at any size, which is ideal for your card printer.</p>
      </div>
    </div>
  );
}
