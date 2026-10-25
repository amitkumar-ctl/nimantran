import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/ui/AuthForm';

export const metadata: Metadata = {
  title: 'Create your free wedding invitation',
  description: 'Sign up free and create a wedding invitation website where guests reply online, in minutes.',
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
      <p className="mt-4 text-center text-xs text-muted">
        By creating an account you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </>
  );
}
