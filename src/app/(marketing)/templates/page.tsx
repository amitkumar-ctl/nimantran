import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, TEMPLATE_IDS, TEMPLATES } from '@/lib/themes';
import { absoluteUrl } from '@/config/site';
import { ThemeSwatch } from '@/components/invite/ThemeSwatch';
import { JsonLd } from '@/components/marketing/JsonLd';

export const metadata: Metadata = {
  title: `Wedding Invitation Templates: ${TEMPLATE_IDS.length} Indian Designs with RSVP`,
  description:
    'Browse digital wedding invitation templates for every tradition: royal maroon, haldi, mehndi, sangeet, South Indian kasavu, Bengali sindoor, Mughal nikah, pastel and beach-wedding designs. All include RSVP, maps, countdown and UPI shagun.',
  alternates: { canonical: '/templates' },
};

const CATEGORY_INTRO: Record<string, string> = {
  Traditional: 'Rich colours and classic motifs for grand, traditional celebrations.',
  Regional: 'Designs rooted in regional traditions: Bengali, Rajasthani, South Indian and Mughal.',
  'Pastel & modern': 'Soft palettes and clean layouts for modern and intimate weddings.',
  Destination: 'Made for beach, hill and abroad weddings where guests travel to celebrate.',
};

export default function TemplatesPage() {
  return (
    <main className="container-page py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org', '@type': 'ItemList', name: 'Wedding invitation templates',
          itemListElement: TEMPLATE_IDS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: TEMPLATES[t].name, url: absoluteUrl(`/templates/${t}`) })),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › Templates</nav>
      <h1 className="font-display text-5xl font-semibold text-maroon-900">Wedding invitation templates</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/80">
        {TEMPLATE_IDS.length} designs, each a full invitation website, not just a card: all your functions, venue maps, a live countdown,
        RSVP and UPI shagun. Pick one now and switch anytime, even after sharing.
      </p>

      {/* Jump links by tradition */}
      <nav aria-label="Template categories" className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <a key={c} href={`#${c.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="chip bg-white hover:border-gold">{c}</a>
        ))}
      </nav>

      {CATEGORIES.map((cat) => {
        const items = TEMPLATE_IDS.filter((t) => TEMPLATES[t].category === cat);
        return (
          <section key={cat} id={cat.toLowerCase().replace(/[^a-z]+/g, '-')} className="mt-14 scroll-mt-24" aria-labelledby={`h-${cat}`}>
            <h2 id={`h-${cat}`} className="font-display text-3xl font-semibold text-maroon-900">{cat}</h2>
            <p className="mb-5 text-muted">{CATEGORY_INTRO[cat]}</p>
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {items.map((t) => (
                <li key={t}>
                  <Link href={`/templates/${t}`} className="card group block overflow-hidden transition hover:-translate-y-1">
                    <ThemeSwatch theme={t} size="lg" />
                    <div className="p-4">
                      <h3 className="font-display text-xl font-semibold text-maroon-900 group-hover:underline">{TEMPLATES[t].name}</h3>
                      <p className="text-sm text-muted">{TEMPLATES[t].tagline}</p>
                      <p className="mt-2 text-xs text-ink/60">Best for: {TEMPLATES[t].bestFor}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="mt-16 rounded-3xl bg-maroon-900 p-8 text-center text-cream sm:p-12">
        <p className="font-display text-3xl font-semibold text-gold-200">Found one you love?</p>
        <p className="mt-2 text-cream/80">Create your invite free. You can try every design on your own names before sharing.</p>
        <Link href="/signup" className="btn mt-6 bg-gold-200 text-maroon-900">Start with any design</Link>
      </div>
    </main>
  );
}
