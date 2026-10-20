import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { THEMES } from '@/lib/validation';

// Public marketing pages only. Couples' invitations are private and noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/templates'), changeFrequency: 'weekly', priority: 0.9 },
    ...THEMES.map((t) => ({ url: absoluteUrl(`/templates/${t}`), changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: absoluteUrl('/wedding-invitation-wording'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/signup'), changeFrequency: 'yearly', priority: 0.5 },
  ];
}
