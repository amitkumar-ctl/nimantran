import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { FEATURED_IDS, getTemplate, templateCount } from '@/lib/themes';
import { COLLECTIONS } from '@/lib/templates/collections';
import { absoluteUrl } from '@/config/site';
import { JsonLd } from '@/components/marketing/JsonLd';
import { BrowseCard } from '@/components/templates/TemplateBrowser';
import { TemplateSearch } from './TemplateSearch';

const count = templateCount().toLocaleString('en-IN');

export const metadata: Metadata = {
  title: `Wedding Invitation Templates: ${count}+ Indian Designs with RSVP`,
  description:
    `Search ${count}+ digital wedding invitation templates by colour, tradition and motif: royal maroon, haldi, mehndi, sangeet, South Indian kasavu, nikah, pastel and beach designs. All include RSVP, maps, countdown and UPI shagun.`,
  alternates: { canonical: '/templates' },
};

/** Static grid shown to crawlers and before the search loads. */
function FeaturedGrid() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {FEATURED_IDS.map((t) => <li key={t}><BrowseCard t={getTemplate(t)} /></li>)}
    </ul>
  );
}

export default function TemplatesPage() {
  return (
    <main className="container-page py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org', '@type': 'ItemList', name: 'Wedding invitation templates',
          itemListElement: FEATURED_IDS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: getTemplate(t).name, url: absoluteUrl(`/templates/${t}`) })),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › Templates</nav>
      <h1 className="font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Wedding invitation templates</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/80">
        {count} designs, each a full invitation website, not just a card: all your functions, venue maps, a live countdown,
        RSVP and UPI shagun. Search by colour, tradition or motif, and switch anytime, even after sharing.
      </p>

      <section className="mt-8" aria-label="Search designs">
        <Suspense fallback={<FeaturedGrid />}>
          <TemplateSearch />
        </Suspense>
      </section>

      <section className="mt-16" aria-labelledby="collections-title">
        <h2 id="collections-title" className="font-display text-3xl font-semibold text-maroon-900">Browse by collection</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {COLLECTIONS.map((c) => (
            <li key={c.slug}><Link href={`/templates/c/${c.slug}`} className="chip bg-white hover:border-gold">{c.h1}</Link></li>
          ))}
        </ul>
      </section>

      <div className="mt-16 rounded-3xl bg-maroon-900 p-8 text-center text-cream sm:p-12">
        <p className="font-display text-3xl font-semibold text-gold-200">Found one you love?</p>
        <p className="mt-2 text-cream/80">Create your invite free. You can try every design on your own names before sharing.</p>
        <Link href="/signup" className="btn mt-6 bg-gold-200 text-maroon-900">Start with any design</Link>
      </div>
    </main>
  );
}
