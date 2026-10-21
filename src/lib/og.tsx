import 'server-only';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTemplate, type Theme } from './themes';

// Link-preview images (WhatsApp, LinkedIn, X…). Satori can't read CSS
// variables, so colours come straight from the theme config.

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), 'src/assets/og', file));

export async function inviteCardImage(opts: { title: string; kicker: string; line1: string; line2?: string; theme?: Theme }) {
  const design = getTemplate(opts.theme);
  const c = design.colors;
  const serif = design.nameStyle === 'serif';
  const t = { from: c.heroFrom, to: c.heroTo, accent: c.accent, text: c.heroText };
  const [vibes, cormorant, inter] = await Promise.all([
    font('great-vibes-latin-400-normal.woff'),
    font('cormorant-garamond-latin-600-normal.woff'),
    font('inter-latin-500-normal.woff'),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', padding: 28, background: `linear-gradient(160deg, ${t.from}, ${t.to})` }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.accent}80`, borderRadius: 24, color: t.text }}>
          <div style={{ fontFamily: 'Inter', fontSize: 24, letterSpacing: 8, textTransform: 'uppercase', color: t.accent, opacity: 0.9 }}>{opts.kicker}</div>
          <div style={serif
            ? { fontFamily: 'Cormorant', fontSize: 84, letterSpacing: 8, textTransform: 'uppercase', color: t.accent, marginTop: 18, lineHeight: 1.1 }
            : { fontFamily: 'Vibes', fontSize: 128, color: t.accent, marginTop: 10, lineHeight: 1.1 }}>{opts.title}</div>
          <div style={{ fontFamily: 'Cormorant', fontSize: 40, letterSpacing: 6, textTransform: 'uppercase', marginTop: 18 }}>{opts.line1}</div>
          {opts.line2 && <div style={{ fontFamily: 'Cormorant', fontSize: 32, opacity: 0.85, marginTop: 6 }}>{opts.line2}</div>}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Vibes', data: vibes, style: 'normal', weight: 400 },
        { name: 'Cormorant', data: cormorant, style: 'normal', weight: 600 },
        { name: 'Inter', data: inter, style: 'normal', weight: 500 },
      ],
    },
  );
}
