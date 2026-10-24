import Link from 'next/link';
import { site } from '@/config/site';

/** Shared layout for Privacy and Terms: title, date, contents list and readable prose. */
export function LegalPage({ title, intro, sections, children }: { title: string; intro: React.ReactNode; sections: { id: string; title: string }[]; children: React.ReactNode }) {
  return (
    <main className="container-page max-w-3xl py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › {title}</nav>
      <h1 className="font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated {site.legal.updated}</p>
      <div className="mt-6 text-lg text-ink/85">{intro}</div>
      <nav aria-label="Contents" className="mt-8 rounded-2xl border border-line bg-white p-5">
        <p className="mb-2 text-sm font-semibold text-muted">Contents</p>
        <ol className="grid list-decimal gap-x-8 gap-y-1 pl-5 text-sm sm:grid-cols-2">
          {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-maroon hover:underline">{s.title}</a></li>)}
        </ol>
      </nav>
      <div className="prose-page legal mt-4">{children}</div>
    </main>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-24">{children}</h2>;
}
