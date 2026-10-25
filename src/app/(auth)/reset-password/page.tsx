import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/ui/PasswordResetForms';

export const metadata: Metadata = {
  title: 'Choose a new password',
  robots: { index: false, follow: false },
  // The token is in the URL: never send it to other sites as a referrer.
  referrer: 'no-referrer',
};

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-4xl font-semibold text-maroon-900">Choose a new password</h1>
      <p className="mb-6 text-muted">Pick something you haven’t used here before.</p>
      <Suspense fallback={<div className="card h-72 animate-pulse" />}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
