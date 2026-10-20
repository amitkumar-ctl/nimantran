import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Logo } from '@/components/ui/Logo';
import { UserMenu } from './UserMenu';
import { DashboardNav, NavLinks } from './DashboardNav';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <span className="hidden sm:block"><Logo /></span>
            {/* Every page here is under /dashboard, so the fallback can show that tab active. */}
            <Suspense fallback={<NavLinks pathname="/dashboard" />}>
              <DashboardNav />
            </Suspense>
          </div>
          <UserMenu />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
