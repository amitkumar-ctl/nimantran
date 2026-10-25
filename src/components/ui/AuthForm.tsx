'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { api, ApiError, safeNext } from '@/lib/api-client';
import { GoogleButton } from './GoogleButton';
import { fieldErrors, loginSchema, signupSchema } from '@/lib/validation';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const goNext = () => {
    router.replace(next);
    router.refresh();
  };

  const mutation = useMutation({
    mutationFn: () => (mode === 'signup' ? api.signup(values) : api.login(values)),
    onSuccess: goNext,
    onError: (err) => setErrors(err instanceof ApiError && err.fields ? err.fields : {}),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = (mode === 'signup' ? signupSchema : loginSchema).safeParse(values);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    mutation.mutate();
  }

  const field = (key: 'name' | 'email' | 'password', label: string, type: string, autoComplete: string) => (
    <div>
      <label htmlFor={key} className="label">{label}</label>
      <input
        id={key} type={type} autoComplete={autoComplete} className="input" value={values[key]} aria-invalid={!!errors[key]}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
      {errors[key] && <p className="mt-1 text-xs text-red-700">{errors[key]}</p>}
    </div>
  );

  const other = mode === 'login' ? '/signup' : '/login';
  const otherHref = next !== '/dashboard' ? `${other}?next=${encodeURIComponent(next)}` : other;

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
      <GoogleButton mode={mode} onSuccess={goNext} />
      {mode === 'signup' && field('name', 'Your name', 'text', 'name')}
      {field('email', 'Email', 'email', 'email')}
      {field('password', 'Password', 'password', mode === 'signup' ? 'new-password' : 'current-password')}
      {mode === 'login' && (
        <p className="-mt-2 text-right text-sm">
          <Link href={values.email ? `/forgot-password?email=${encodeURIComponent(values.email)}` : '/forgot-password'} className="font-semibold text-maroon hover:underline">Forgot password?</Link>
        </p>
      )}
      {mutation.isError && !Object.keys(errors).length && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{mutation.error.message}</p>
      )}
      <button type="submit" className="btn btn-primary w-full py-3.5" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === 'signup' ? 'Create account' : 'Log in'}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === 'signup' ? 'Already have an account?' : 'New here?'}{' '}
        <Link href={otherHref} className="font-semibold text-maroon hover:underline">
          {mode === 'signup' ? 'Log in' : 'Create a free account'}
        </Link>
      </p>
    </form>
  );
}
