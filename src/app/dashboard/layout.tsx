import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { UserMenu } from './UserMenu';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {/* Inside the app, the logo goes to the couple's invites */}
            <Logo href="/dashboard" />
            <Link href="/dashboard" className="btn btn-ghost btn-sm hidden sm:inline-flex">My invites</Link>
          </div>
          <UserMenu />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
