import type { Colors } from './templates/types';

/*
 * A personal invitation card as an image (1080×1350, the shape WhatsApp and
 * Instagram show best): the family's name, the couple, the date and venue in
 * the design's colours, plus a QR code that opens the family's own link.
 * Drawn in the browser so every script (Hindi, Tamil, Urdu…) uses the fonts
 * the site already has.
 */

export type CardFonts = { script: string; display: string; body: string; blessing: string; /** the invite language's script */ lang: string };
export type CardInput = {
  family: string; partner1: string; partner2: string; blessing: string;
  /** Respectful address and invitation line, in the invite's language. */
  salutation: string; invited: string; english: boolean;
  dateLabel: string; place: string; link: string; replies: boolean;
  colors: Colors; nameStyle: 'script' | 'serif'; fonts: CardFonts;
};

const W = 1080, H = 1350;

/** Largest font size (≤ max) at which `text` fits in `width`. */
function fitSize(g: CanvasRenderingContext2D, text: string, font: (px: number) => string, max: number, width: number, min = 18) {
  let px = max;
  for (; px > min; px -= 2) { g.font = font(px); if (g.measureText(text).width <= width) break; }
  g.font = font(px);
  return px;
}

function diamond(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath(); g.fill();
}

function withAlpha(hex: string, a: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export async function drawFamilyCard(c: CardInput): Promise<HTMLCanvasElement> {
  const { colors: k, fonts: f } = c;
  // Make sure each font (and the right script) is loaded before drawing.
  await Promise.all([
    document.fonts.load(`96px ${f.script}`, `${c.family}${c.partner1}${c.partner2}`),
    document.fonts.load(`600 40px ${f.display}`, 'Aa'),
    document.fonts.load(`italic 36px ${f.display}`, 'Aa'),
    document.fonts.load(`26px ${f.body}`, 'Aa'),
    c.blessing ? document.fonts.load(`46px ${f.blessing}`, c.blessing) : Promise.resolve([]),
    document.fonts.load(`34px ${f.lang}`, `${c.salutation}${c.invited}`),
  ]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d')!;
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';

  // Background: the design's hero colours.
  const bg = g.createRadialGradient(W / 2, -100, 50, W / 2, -100, H * 1.25);
  bg.addColorStop(0, k.heroFrom); bg.addColorStop(0.45, k.heroVia); bg.addColorStop(1, k.heroTo);
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  // Double frame with small diamonds at the corners.
  g.strokeStyle = withAlpha(k.accent, 0.6); g.lineWidth = 3; g.strokeRect(40, 40, W - 80, H - 80);
  g.lineWidth = 1.5; g.strokeRect(56, 56, W - 112, H - 112);
  g.fillStyle = k.accent;
  for (const [x, y] of [[56, 56], [W - 56, 56], [56, H - 56], [W - 56, H - 56]]) diamond(g, x, y, 9);

  const text = (s: string, y: number, color: string) => { g.fillStyle = color; g.fillText(s, W / 2, y); };
  const inner = W - 220;

  if (c.blessing) { fitSize(g, c.blessing, (px) => `${px}px ${f.blessing}`, 46, inner); text(c.blessing, 150, k.accent); }

  // "Respected" / "आदरणीय" above the family's name, in the invite's language.
  if (c.english) {
    g.font = `600 24px ${f.body}`;
    if ('letterSpacing' in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '6px';
    text(c.salutation.toUpperCase(), 238, withAlpha(k.heroText, 0.8));
    if ('letterSpacing' in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';
  } else {
    fitSize(g, c.salutation, (px) => `${px}px ${f.lang}`, 34, inner); text(c.salutation, 240, withAlpha(k.heroText, 0.9));
  }
  fitSize(g, c.family, (px) => `${px}px ${f.script}`, 100, inner);
  text(c.family, 335, k.accent);

  // Divider
  g.strokeStyle = withAlpha(k.accent, 0.7); g.lineWidth = 2;
  g.beginPath(); g.moveTo(W / 2 - 170, 392); g.lineTo(W / 2 - 22, 392); g.moveTo(W / 2 + 22, 392); g.lineTo(W / 2 + 170, 392); g.stroke();
  g.fillStyle = k.accent; diamond(g, W / 2, 392, 10);

  // "You and your family are cordially invited (to the wedding of)" in the invite's language.
  const line = c.english ? `${c.invited} to the wedding of` : c.invited;
  fitSize(g, line, (px) => (c.english ? `italic ${px}px ${f.display}` : `${px}px ${f.lang}`), 36, inner);
  text(line, 470, k.heroText);

  if (c.nameStyle === 'script') {
    fitSize(g, c.partner1, (px) => `${px}px ${f.script}`, 120, inner); text(c.partner1, 610, k.accent);
    g.font = `italic 54px ${f.display}`; text('&', 690, k.accent);
    fitSize(g, c.partner2, (px) => `${px}px ${f.script}`, 120, inner); text(c.partner2, 800, k.accent);
  } else {
    fitSize(g, c.partner1.toUpperCase(), (px) => `600 ${px}px ${f.display}`, 86, inner); text(c.partner1.toUpperCase(), 600, k.accent);
    g.font = `italic 50px ${f.display}`; text('&', 680, k.accent);
    fitSize(g, c.partner2.toUpperCase(), (px) => `600 ${px}px ${f.display}`, 86, inner); text(c.partner2.toUpperCase(), 785, k.accent);
  }

  fitSize(g, c.dateLabel, (px) => `600 ${px}px ${f.display}`, 42, inner); text(c.dateLabel, 890, k.heroText);
  if (c.place) { fitSize(g, c.place, (px) => `${px}px ${f.display}`, 34, inner); text(c.place, 942, withAlpha(k.heroText, 0.9)); }

  // QR code to the family's own link, on a white tile.
  const Q = await import('qrcode');
  const qr = document.createElement('canvas');
  await Q.toCanvas(qr, c.link, { width: 196, margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1f1611', light: '#ffffff' } });
  const tile = 236, tx = (W - tile) / 2, ty = 995;
  g.fillStyle = '#ffffff';
  g.beginPath(); g.roundRect(tx, ty, tile, tile, 22); g.fill();
  g.drawImage(qr, tx + (tile - 196) / 2, ty + (tile - 196) / 2);

  g.font = `500 26px ${f.body}`;
  text(c.replies ? 'Scan to see all functions and reply' : 'Scan to see all functions and venues', 1272, k.heroText);
  fitSize(g, c.link.replace(/^https?:\/\//, '').split('?')[0], (px) => `${px}px ${f.body}`, 20, inner, 12);
  text(c.link.replace(/^https?:\/\//, '').split('?')[0], 1306, withAlpha(k.heroText, 0.7));
  return canvas;
}

/** File name like "sharma-parivar-invitation.jpg" (plain letters only: phones mangle others). */
export const cardFileName = (family: string) => `${family.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'family'}-invitation.jpg`;
