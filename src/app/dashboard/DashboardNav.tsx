'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Mail } from 'lucide-react';

const LINKS = [
  // "My invites" covers the list and every invite's editor / guest list.
  { href: '/dashboard', label: 'My invites', short: 'Invites', icon: Mail, active: (p: string) => p.startsWith('/dashboard') },
  { href: '/templates', label: 'Templates', short: 'Designs', icon: LayoutGrid, active: () => false },
  { href: '/', label: 'Home', short: 'Home', icon: Home, active: () => false },
];

/** App navigation: the current section is highlighted so it's clear where you are. */
export function DashboardNav() {
  return <NavLinks pathname={usePathname()} />;
}

/** Same links without reading the URL; the instant placeholder inside <Suspense>. */
export function NavLinks({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="App" className="flex items-center gap-1">
      {LINKS.map(({ href, label, short, icon: Icon, active }) => {
        const on = active(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? 'page' : undefined}
            data-tour={href === '/templates' ? 'nav-designs' : undefined}
            className={`btn btn-sm gap-1.5 px-2.5 sm:px-3 ${on ? 'bg-cream-2 text-maroon' : 'btn-ghost'}`}
          >
            <Icon className="h-4 w-4" />
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
