import localFont from 'next/font/local';

/*
 * Fonts for the styled invitation looks and for every Indian script.
 * Self-hosted and not preloaded: a browser only downloads a file when text on
 * the page actually uses it, so an English invite never fetches Tamil glyphs.
 * Each family is exposed as a CSS variable (--nf-*) that globals.css maps to
 * a Tailwind font token (font-cinzel, font-ta, …). next/font needs each call
 * written out in full at module scope.
 */
// Looks
const cinzel = localFont({ variable: '--nf-cinzel', display: 'swap', preload: false, src: [{ path: './fonts/cinzel-latin-400-normal.woff2', weight: '400' }, { path: './fonts/cinzel-latin-600-normal.woff2', weight: '600' }] });
const pinyon = localFont({ variable: '--nf-pinyon', display: 'swap', preload: false, src: './fonts/pinyon-script-latin-400-normal.woff2' });
const lora = localFont({ variable: '--nf-lora', display: 'swap', preload: false, src: [{ path: './fonts/lora-latin-400-normal.woff2', weight: '400' }, { path: './fonts/lora-latin-400-italic.woff2', weight: '400', style: 'italic' }, { path: './fonts/lora-latin-600-normal.woff2', weight: '600' }] });
const bodoni = localFont({ variable: '--nf-bodoni', display: 'swap', preload: false, src: [{ path: './fonts/bodoni-moda-latin-400-normal.woff2', weight: '400' }, { path: './fonts/bodoni-moda-latin-400-italic.woff2', weight: '400', style: 'italic' }, { path: './fonts/bodoni-moda-latin-700-normal.woff2', weight: '700' }] });
const josefin = localFont({ variable: '--nf-josefin', display: 'swap', preload: false, src: [{ path: './fonts/josefin-sans-latin-400-normal.woff2', weight: '400' }, { path: './fonts/josefin-sans-latin-600-normal.woff2', weight: '600' }] });
const limelight = localFont({ variable: '--nf-limelight', display: 'swap', preload: false, src: './fonts/limelight-latin-400-normal.woff2' });
const poiret = localFont({ variable: '--nf-poiret', display: 'swap', preload: false, src: './fonts/poiret-one-latin-400-normal.woff2' });
const baloo = localFont({ variable: '--nf-baloo', display: 'swap', preload: false, src: [{ path: './fonts/baloo-2-latin-500-normal.woff2', weight: '500' }, { path: './fonts/baloo-2-latin-800-normal.woff2', weight: '800' }] });
const balooDeva = localFont({ variable: '--nf-baloo-deva', display: 'swap', preload: false, src: './fonts/baloo-2-devanagari-800-normal.woff2' });
const yatra = localFont({ variable: '--nf-yatra', display: 'swap', preload: false, src: './fonts/yatra-one-devanagari-400-normal.woff2' });
const italiana = localFont({ variable: '--nf-italiana', display: 'swap', preload: false, src: './fonts/italiana-latin-400-normal.woff2' });
const marcellus = localFont({ variable: '--nf-marcellus', display: 'swap', preload: false, src: './fonts/marcellus-latin-400-normal.woff2' });
const amiri = localFont({ variable: '--nf-amiri', display: 'swap', preload: false, src: [{ path: './fonts/amiri-latin-400-normal.woff2', weight: '400' }, { path: './fonts/amiri-latin-400-italic.woff2', weight: '400', style: 'italic' }, { path: './fonts/amiri-latin-700-normal.woff2', weight: '700' }] });

// Scripts (Devanagari uses Tiro, loaded in layout.tsx)
const arabic = localFont({ variable: '--nf-arabic', display: 'swap', preload: false, src: './fonts/amiri-arabic-400-normal.woff2' });
const urdu = localFont({ variable: '--nf-urdu', display: 'swap', preload: false, src: './fonts/noto-nastaliq-urdu-arabic-500-normal.woff2' });
const bn = localFont({ variable: '--nf-bn', display: 'swap', preload: false, src: './fonts/noto-serif-bengali-bengali-600-normal.woff2' });
const gu = localFont({ variable: '--nf-gu', display: 'swap', preload: false, src: './fonts/noto-serif-gujarati-gujarati-600-normal.woff2' });
const pa = localFont({ variable: '--nf-pa', display: 'swap', preload: false, src: './fonts/noto-serif-gurmukhi-gurmukhi-600-normal.woff2' });
const or = localFont({ variable: '--nf-or', display: 'swap', preload: false, src: './fonts/noto-serif-oriya-oriya-600-normal.woff2' });
const ta = localFont({ variable: '--nf-ta', display: 'swap', preload: false, src: './fonts/noto-serif-tamil-tamil-600-normal.woff2' });
const te = localFont({ variable: '--nf-te', display: 'swap', preload: false, src: './fonts/noto-serif-telugu-telugu-600-normal.woff2' });
const kn = localFont({ variable: '--nf-kn', display: 'swap', preload: false, src: './fonts/noto-serif-kannada-kannada-600-normal.woff2' });
const ml = localFont({ variable: '--nf-ml', display: 'swap', preload: false, src: './fonts/noto-serif-malayalam-malayalam-600-normal.woff2' });

export const extraFontVariables = [
  cinzel, pinyon, lora, bodoni, josefin, limelight, poiret, baloo, balooDeva, yatra, italiana, marcellus, amiri,
  arabic, urdu, bn, gu, pa, or, ta, te, kn, ml,
].map((x) => x.variable).join(' ');
