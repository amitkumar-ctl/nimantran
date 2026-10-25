'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, MailCheck } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { fieldErrors, forgotSchema, resetSchema } from '@/lib/validation';

/** Step 1: ask for the email; we send a reset link (same answer whether or not the account exists). */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState(useSearchParams().get('email') ?? '');
  const [error, setError] = useState('');
  const send = useMutation({ mutationFn: () => api.forgotPassword(email) });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = forgotSchema.safeParse({ email });
    if (!parsed.success) return setError(fieldErrors(parsed.error).email ?? 'Enter a valid email');
    setError('');
    send.mutate();
  }

  if (send.isSuccess) {
    return (
      <div className="card p-6 text-center sm:p-8" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream-2 text-maroon"><MailCheck className="h-7 w-7" /></span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-maroon-900">Check your email</h2>
        <p className="mt-2 text-ink/75">If <b>{email}</b> has a Nimantran account, we’ve sent a link to choose a new password. It works for 1 hour.</p>
        <p className="mt-3 text-sm text-muted">Nothing after a few minutes? Check Spam or Promotions, or <button type="button" className="font-semibold text-maroon underline" onClick={() => send.reset()}>try again</button>.</p>
        <Link href="/login" className="btn btn-outline mt-6">Back to log in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" autoComplete="email" className="input" value={email} aria-invalid={!!error} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      </div>
      {send.isError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{send.error.message}</p>}
      <button type="submit" className="btn btn-primary w-full py-3.5" disabled={send.isPending}>
        {send.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
      </button>
      <p className="text-center text-sm text-muted">Remembered it? <Link href="/login" className="font-semibold text-maroon hover:underline">Log in</Link></p>
    </form>
  );
}

/** Step 2: from the emailed link, choose a new password (then you're signed in). */
export function ResetPasswordForm() {
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const reset = useMutation({
    mutationFn: () => api.resetPassword({ token, password }),
    // Full page load so the dashboard starts fresh with the new session.
    onSuccess: () => window.location.replace('/dashboard'),
    onError: (err) => setErrors(err instanceof ApiError && err.fields ? err.fields : {}),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = resetSchema.safeParse({ token, password });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    if (password !== confirm) return setErrors({ confirm: 'The two passwords don’t match' });
    setErrors({});
    reset.mutate();
  }

  if (!token || errors.token) {
    return (
      <div className="card p-6 text-center sm:p-8" role="alert">
        <h2 className="font-display text-2xl font-semibold text-maroon-900">This link has expired</h2>
        <p className="mt-2 text-ink/75">Reset links work once, for 1 hour. Ask for a new one and use the latest email.</p>
        <Link href="/forgot-password" className="btn btn-primary mt-6">Send a new link</Link>
      </div>
    );
  }

  const Toggle = (
    <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
      <div>
        <label htmlFor="password" className="label">New password</label>
        <div className="relative">
          <input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" className="input pr-10" value={password} aria-invalid={!!errors.password} onChange={(e) => setPassword(e.target.value)} />
          {Toggle}
        </div>
        {errors.password ? <p className="mt-1 text-xs text-red-700">{errors.password}</p> : <p className="mt-1 text-xs text-muted">At least 8 characters.</p>}
      </div>
      <div>
        <label htmlFor="confirm" className="label">Type it again</label>
        <input id="confirm" type={show ? 'text' : 'password'} autoComplete="new-password" className="input" value={confirm} aria-invalid={!!errors.confirm} onChange={(e) => setConfirm(e.target.value)} />
        {errors.confirm && <p className="mt-1 text-xs text-red-700">{errors.confirm}</p>}
      </div>
      {reset.isError && !Object.keys(errors).length && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{reset.error.message}</p>}
      <button type="submit" className="btn btn-primary w-full py-3.5" disabled={reset.isPending}>
        {reset.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save new password
      </button>
      <p className="text-center text-xs text-muted">You’ll be signed in, and signed out on every other device.</p>
    </form>
  );
}
