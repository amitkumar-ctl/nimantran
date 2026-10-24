import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { searchTemplates } from '@/lib/themes';
import { COLLECTIONS, getCollection, relatedCollections } from '@/lib/templates/collections';
import { absoluteUrl } from '@/config/site';
import { JsonLd } from '@/components/marketing/JsonLd';
import { BrowseCard } from '@/components/templates/TemplateBrowser';

type Props = PageProps<'/templates/c/[collection]'>;

// The whole page depends on the URL (which design / collection), so render it
// in one go instead of streaming a generic shell first. This also means an
// unknown id gets a real 404 status for search engines.
export const instant = false;

const SHOWN = 48;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollection((await params).collection);
  if (!c) return {};
  const n = searchTemplates(c.query ?? '', c.filters).length;
  return {
    title: `${c.title} (${n}+ designs with RSVP)`,
    description: `${c.intro} ${n} digital invitation designs with RSVP, venue maps, countdown and UPI shagun. Free to start.`,
    alternates: { canonical: `/templates/c/${c.slug}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const c = getCollection((await params).collection);
  if (!c) notFound();
  const results = searchTemplates(c.query ?? '', c.filters);
  const related = relatedCollections(c);
  const seeAll = c.query ? `/templates?q=${encodeURIComponent(c.query)}` : '/templates';

  return (
    <main className="container-page py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.h1, url: absoluteUrl(`/templates/c/${c.slug}`),
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
              { '@type': 'ListItem', position: 2, name: 'Templates', item: absoluteUrl('/templates') },
              { '@type': 'ListItem', position: 3, name: c.h1, item: absoluteUrl(`/templates/c/${c.slug}`) },
            ],
          },
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:underline">Home</Link> › <Link href="/templates" className="hover:underline">Templates</Link> › {c.h1}
      </nav>
      <h1 className="font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">{c.h1}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/80">{c.intro}</p>
      <p className="mt-2 text-sm text-muted">{results.length.toLocaleString('en-IN')} designs · every one includes RSVP, maps, countdown and UPI shagun.</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.slice(0, SHOWN).map((t) => <li key={t.id}><BrowseCard t={t} /></li>)}
      </ul>
      {results.length > SHOWN && (
        <div className="mt-8 text-center">
          <Link href={seeAll} className="btn btn-outline">Search all {results.length.toLocaleString('en-IN')} designs</Link>
        </div>
      )}

      <section className="mt-16" aria-labelledby="related-title">
        <h2 id="related-title" className="font-display text-2xl font-semibold text-maroon-900">More collections</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {related.map((x) => <li key={x.slug}><Link href={`/templates/c/${x.slug}`} className="chip bg-white hover:border-gold">{x.h1}</Link></li>)}
        </ul>
      </section>
    </main>
  );
}
