import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/ui/AuthForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to edit your wedding invitation and see RSVPs.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-4xl font-semibold text-maroon-900">Welcome back</h1>
      <p className="mb-6 text-muted">Log in to edit your invite and see who&apos;s coming.</p>
      <Suspense fallback={<div className="card h-80 animate-pulse" />}>
        <AuthForm mode="login" />
      </Suspense>
    </>
  );
}
