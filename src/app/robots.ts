import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Invites (/i/…) stay crawlable on purpose: crawlers must fetch them to
      // read the noindex tag, and WhatsApp needs them for link previews.
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/'] },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
