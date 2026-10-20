import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { isTheme, TEMPLATE_IDS, TEMPLATES } from '@/lib/themes';
import { EVENT_SETS } from '@/lib/sample';
import { absoluteUrl } from '@/config/site';
import { PhonePreview } from '@/components/marketing/PhonePreview';
import { ThemeSwatch } from '@/components/invite/ThemeSwatch';
import { JsonLd } from '@/components/marketing/JsonLd';

type Props = PageProps<'/templates/[theme]'>;

// Every template page is built as static HTML at build time.
export function generateStaticParams() {
  return TEMPLATE_IDS.map((theme) => ({ theme }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  if (!isTheme(theme)) return {};
  const info = TEMPLATES[theme];
  return {
    title: `${info.name} Wedding Invitation Template`,
    description: `${info.description} Free digital wedding invite with RSVP, maps and countdown.`,
    alternates: { canonical: `/templates/${theme}` },
  };
}

export default async function TemplatePage({ params }: Props) {
  const { theme } = await params;
  if (!isTheme(theme)) notFound();
  const info = TEMPLATES[theme];
  // Same-category designs first, then the rest.
  const others = [...TEMPLATE_IDS.filter((t) => t !== theme && TEMPLATES[t].category === info.category), ...TEMPLATE_IDS.filter((t) => TEMPLATES[t].category !== info.category)].slice(0, 4);
  const swatch = [info.colors.heroVia, info.colors.accent, info.colors.surface];
  const ceremonies = EVENT_SETS[info.events].map((e) => `${e.emoji} ${e.name}`).join(' · ');

  return (
    <main className="container-page py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Templates', item: absoluteUrl('/templates') },
            { '@type': 'ListItem', position: 3, name: info.name, item: absoluteUrl(`/templates/${theme}`) },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:underline">Home</Link> › <Link href="/templates" className="hover:underline">Templates</Link> › {info.name}
      </nav>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-2 inline-block rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-maroon">{info.category}</p>
          <h1 className="font-display text-5xl font-semibold text-maroon-900">{info.name} wedding invitation</h1>
          <p className="mt-2 font-display text-xl italic text-muted">{info.tagline}</p>
          <p className="mt-5 text-lg text-ink/80">{info.description}</p>
          <p className="mt-3 text-ink/70"><strong className="text-ink">Best for:</strong> {info.bestFor}</p>
          <p className="mt-1 text-ink/70"><strong className="text-ink">Starts with:</strong> {ceremonies} (add or rename any)</p>
          <div className="mt-5 flex gap-2" aria-label="Colour palette">
            {swatch.map((c) => <span key={c} className="h-9 w-9 rounded-full border border-line shadow-inner" style={{ background: c }} title={c} />)}
          </div>
          <h2 className="mt-8 font-display text-2xl font-semibold text-maroon-900">Included with this design</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {['Your names & blessing line', 'All functions with venues', 'Google Maps link per venue', 'Live countdown to muhurat', 'RSVP with headcount per function', 'UPI shagun button', 'WhatsApp preview card', 'Edit anytime, same link'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-ink/85"><Check className="h-4 w-4 flex-none text-green-700" /> {f}</li>
            ))}
          </ul>
          <Link href="/signup" className="btn btn-primary mt-8 px-7 py-4 text-base">Use {info.name}, free</Link>
        </div>
        <PhonePreview theme={theme} />
      </div>

      <section className="mt-20" aria-labelledby="more-title">
        <h2 id="more-title" className="font-display text-3xl font-semibold text-maroon-900">More designs</h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {others.map((t) => (
            <li key={t}>
              <Link href={`/templates/${t}`} className="card group block overflow-hidden transition hover:-translate-y-0.5">
                <ThemeSwatch theme={t} />
                <span className="block p-3">
                  <span className="block font-display text-lg font-semibold text-maroon-900 group-hover:underline">{TEMPLATES[t].name}</span>
                  <span className="block text-sm text-muted">{TEMPLATES[t].tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/templates" className="btn btn-outline mt-6">All {TEMPLATE_IDS.length} designs</Link>
      </section>
    </main>
  );
}
