import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { FEATURED_IDS } from '@/lib/themes';
import { COLLECTIONS } from '@/lib/templates/collections';

// Public marketing pages only. Couples' invitations are private and noindex,
// and the thousands of generated designs are reached through the collections.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/templates'), changeFrequency: 'weekly', priority: 0.9 },
    ...COLLECTIONS.map((c) => ({ url: absoluteUrl(`/templates/c/${c.slug}`), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...FEATURED_IDS.map((t) => ({ url: absoluteUrl(`/templates/${t}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: absoluteUrl('/wedding-invitation-wording'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/signup'), changeFrequency: 'yearly', priority: 0.5 },
  ];
}
