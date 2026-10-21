import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { allTemplates, FEATURED_IDS, getTemplate, isTheme, templateCount, type TemplateInfo } from '@/lib/themes';
import { EVENT_SETS } from '@/lib/sample';
import { absoluteUrl } from '@/config/site';
import { PhonePreview } from '@/components/marketing/PhonePreview';
import { ThemeSwatch } from '@/components/invite/ThemeSwatch';
import { JsonLd } from '@/components/marketing/JsonLd';
import { UseDesignLink } from '@/components/templates/UseDesignLink';
import { DesignLink } from '@/components/templates/TemplateBrowser';

type Props = PageProps<'/templates/[theme]'>;

// The whole page depends on the URL (which design / collection), so render it
// in one go instead of streaming a generic shell first. This also means an
// unknown id gets a real 404 status for search engines.
export const instant = false;

// The featured designs are built as static HTML at build time; the thousands
// of generated ones render on first visit and are then cached.
export function generateStaticParams() {
  return FEATURED_IDS.map((theme) => ({ theme }));
}

/** Same palette with other motifs, then the same motif in other colours. */
function similar(info: TemplateInfo, n = 8): TemplateInfo[] {
  const palette = info.featured ? null : info.id.split('-')[1];
  const pool = allTemplates().filter((t) => t.id !== info.id);
  const out = new Map<string, TemplateInfo>();
  const add = (list: TemplateInfo[], k: number) => list.slice(0, k).forEach((t) => out.size < n && out.set(t.id, t));
  add(pool.filter((t) => t.ornament !== info.ornament && (palette ? t.id.split('-')[1] === palette : t.category === info.category) && t.frame === info.frame), 4);
  add(pool.filter((t) => t.ornament === info.ornament && t.colors.heroVia !== info.colors.heroVia && t.nameStyle === info.nameStyle), n);
  return [...out.values()];
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  if (!isTheme(theme)) return {};
  const info = getTemplate(theme);
  return {
    title: `${info.name} Wedding Invitation Template`,
    description: `${info.description} Free digital wedding invite with RSVP, maps and countdown.`,
    alternates: { canonical: `/templates/${theme}` },
    // Generated variants are near-duplicates: let Google follow them, but index the featured pages + collections.
    ...(info.featured ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function TemplatePage({ params }: Props) {
  const { theme } = await params;
  if (!isTheme(theme)) notFound();
  const info = getTemplate(theme);
  const others = similar(info);
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
          <h1 className="font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">{info.name} wedding invitation</h1>
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
          <UseDesignLink id={info.id} className="btn btn-primary mt-8 px-7 py-4 text-base">Use this design, free</UseDesignLink>
        </div>
        <PhonePreview theme={theme} />
      </div>

      <section className="mt-20" aria-labelledby="more-title">
        <h2 id="more-title" className="font-display text-3xl font-semibold text-maroon-900">Similar designs</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {others.map((t) => (
            <li key={t.id}>
              <DesignLink featured={t.featured} href={`/templates/${t.id}`} className="card group block overflow-hidden transition hover:-translate-y-0.5">
                <ThemeSwatch theme={t.id} />
                <span className="block p-3">
                  <span className="block font-display text-base font-semibold text-maroon-900 group-hover:underline sm:text-lg">{t.name}</span>
                  <span className="block text-xs text-muted sm:text-sm">{t.category}</span>
                </span>
              </DesignLink>
            </li>
          ))}
        </ul>
        <Link href="/templates" className="btn btn-outline mt-6">Search all {templateCount().toLocaleString('en-IN')} designs</Link>
      </section>
    </main>
  );
}
