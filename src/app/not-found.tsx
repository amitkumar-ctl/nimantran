import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/marketing/SiteChrome';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-page py-24 text-center">
        <p className="font-script text-7xl text-gold">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-maroon-900">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">This page doesn’t exist. It may have moved, or the link has a typo.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/templates" className="btn btn-outline">Browse templates</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
