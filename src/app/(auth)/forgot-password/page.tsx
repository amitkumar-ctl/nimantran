import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/ui/PasswordResetForms';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Get a link to reset your Nimantran password.',
  alternates: { canonical: '/forgot-password' },
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-4xl font-semibold text-maroon-900">Forgot your password?</h1>
      <p className="mb-6 text-muted">Enter the email you signed up with and we’ll send you a link to choose a new one.</p>
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <ForgotPasswordForm />
      </Suspense>
    </>
  );
}
