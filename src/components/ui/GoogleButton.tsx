'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';

// Minimal typing for Google Identity Services (https://developers.google.com/identity/gsi/web).
type GoogleId = {
  initialize: (o: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: 'popup'; context?: string; auto_select?: boolean }) => void;
  renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
};
declare global {
  interface Window { google?: { accounts: { id: GoogleId } } }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

/**
 * Official "Continue with Google" button. Google returns a signed ID token,
 * which /api/auth/google verifies before creating a session. Renders nothing
 * if NEXT_PUBLIC_GOOGLE_CLIENT_ID isn't set.
 */
export function GoogleButton({ mode, onSuccess }: { mode: 'login' | 'signup'; onSuccess: () => void }) {
  const slot = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  const signIn = useMutation({ mutationFn: api.google, onSuccess });
  const submit = signIn.mutate;

  const render = useCallback(() => {
    const gid = window.google?.accounts.id;
    if (!gid || !slot.current) return;
    gid.initialize({
      client_id: CLIENT_ID,
      callback: ({ credential }) => submit(credential),
      ux_mode: 'popup',
      context: mode === 'signup' ? 'signup' : 'signin',
    });
    gid.renderButton(slot.current, {
      type: 'standard', theme: 'outline', size: 'large', shape: 'pill',
      text: mode === 'signup' ? 'signup_with' : 'continue_with',
      logo_alignment: 'center',
      width: Math.min(400, Math.max(240, slot.current.offsetWidth)),
    });
    setState('ready');
  }, [mode, submit]);

  // Script already on the page (e.g. moving from /login to /signup): render now.
  useEffect(() => {
    if (window.google?.accounts?.id) render();
  }, [render]);

  if (!CLIENT_ID || state === 'failed') return null;

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={render} onError={() => setState('failed')} />
      <div className="relative flex min-h-11 justify-center">
        {state === 'loading' && <div className="absolute inset-0 animate-pulse rounded-full border border-line bg-white" aria-hidden="true" />}
        <div ref={slot} className="w-full [&>div]:mx-auto" aria-busy={state === 'loading'} />
        {signIn.isPending && (
          <div className="absolute inset-0 grid place-items-center rounded-full bg-white/80">
            <Loader2 className="h-5 w-5 animate-spin text-maroon" aria-label="Signing in" />
          </div>
        )}
      </div>
      {signIn.isError && <p className="mt-2 text-center text-sm text-red-700" role="alert">{signIn.error.message}</p>}
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
