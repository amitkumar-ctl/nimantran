import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/ui/AuthForm';

export const metadata: Metadata = {
  title: 'Create your free wedding invitation',
  description: 'Sign up free and create a wedding invitation website with RSVP in minutes.',
  alternates: { canonical: '/signup' },
};

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-4xl font-semibold text-maroon-900">Create your invite</h1>
      <p className="mb-6 text-muted">Free to start. Your invitation will be ready to share in minutes.</p>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </>
  );
}
