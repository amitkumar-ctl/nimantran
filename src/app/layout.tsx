import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { site } from '@/config/site';
import './globals.css';

// Self-hosted fonts (no request to Google at runtime, no layout shift).
const inter = localFont({
  variable: '--font-inter',
  display: 'swap',
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/inter-latin-500-normal.woff2', weight: '500' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600' },
    { path: './fonts/inter-latin-700-normal.woff2', weight: '700' },
  ],
});
const cormorant = localFont({
  variable: '--font-cormorant',
  display: 'swap',
  src: [
    { path: './fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500' },
    { path: './fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './fonts/cormorant-garamond-latin-600-normal.woff2', weight: '600' },
    { path: './fonts/cormorant-garamond-latin-700-normal.woff2', weight: '700' },
  ],
});
const vibes = localFont({ variable: '--font-vibes', display: 'swap', src: './fonts/great-vibes-latin-400-normal.woff2' });
const tiro = localFont({
  variable: '--font-tiro',
  display: 'swap',
  preload: false,
  src: './fonts/tiro-devanagari-hindi-devanagari-400-normal.woff2',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  openGraph: { type: 'website', siteName: site.name, locale: site.locale },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#6b0f1a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${vibes.variable} ${tiro.variable}`}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
