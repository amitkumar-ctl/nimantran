import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { site } from '@/config/site';
import { TEMPLATE_IDS, TEMPLATES } from '@/lib/themes';
import { HeaderAuth, MobileLoginChip } from './HeaderAuth';

const NAV = [
  { href: '/templates', label: 'Templates' },
  { href: '/wedding-invitation-wording', label: 'Wording ideas' },
  { href: '/#how-it-works', label: 'How it works' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-cream/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="btn-ghost btn btn-sm text-sm">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <HeaderAuth />
        </div>
      </div>
      {/* Mobile: section links in a scrollable row */}
      <nav aria-label="Main mobile" className="container-page -mt-1 flex gap-1 overflow-x-auto pb-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="chip shrink-0 bg-white text-xs">{n.label}</Link>
        ))}
        <MobileLoginChip />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-maroon-900 text-cream/80">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-3 max-w-xs text-sm">{site.description}</p>
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-gold-200">Templates</h2>
          <ul className="space-y-2 text-sm">
            {TEMPLATE_IDS.slice(0, 6).map((t) => (
              <li key={t}><Link className="hover:text-white" href={`/templates/${t}`}>{TEMPLATES[t].name}</Link></li>
            ))}
            <li><Link className="font-semibold text-gold-200 hover:text-white" href="/templates">All {TEMPLATE_IDS.length} designs →</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-gold-200">Guides</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/wedding-invitation-wording">Wedding invitation wording</Link></li>
            <li><Link className="hover:text-white" href="/#faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-gold-200">Get started</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/signup">Create your invite</Link></li>
            <li><Link className="hover:text-white" href="/login">Log in</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs">© {site.name}. Made in India with ♥</p>
    </footer>
  );
}
