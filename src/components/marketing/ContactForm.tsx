'use client';

import { useRef, useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';
import { CONTACT_TOPICS, CONTACT_TOPIC_LABELS } from '@/lib/contact';

type Topic = (typeof CONTACT_TOPICS)[number];
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string; fields?: Record<string, string> };

/** Help & contact form → POST /api/contact → email to the team (Resend). */
export function ContactForm({ defaultTopic = 'help' }: { defaultTopic?: Topic }) {
  // When the person first touched the form (set on focus, not render, so the page can be prerendered).
  const startedAt = useRef(0);
  const [topic, setTopic] = useState<Topic>(defaultTopic);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const fields = status.kind === 'error' ? status.fields ?? {} : {};

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'), topic, message: f.get('message'),
          inviteLink: f.get('inviteLink') ?? '', website: f.get('website') ?? '', startedAt: startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setStatus({ kind: 'error', message: data.message ?? 'Something went wrong. Please try again.', fields: data.fields });
      setStatus({ kind: 'sent' });
    } catch {
      setStatus({ kind: 'error', message: 'No connection. Check your internet and try again.' });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="card p-8 text-center" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-700"><Check className="h-7 w-7" /></span>
        <h2 className="mt-4 font-display text-3xl font-semibold text-maroon-900">Message sent</h2>
        <p className="mt-2 text-ink/75">Thank you! We usually reply within one working day, to the email you gave us.</p>
        <button type="button" className="btn btn-outline mt-6" onClick={() => setStatus({ kind: 'idle' })}>Send another message</button>
      </div>
    );
  }

  const sending = status.kind === 'sending';
  return (
    <form onSubmit={submit} onFocusCapture={() => { startedAt.current ||= Date.now(); }} className="card space-y-4 p-6 sm:p-8" noValidate>
      <fieldset>
        <legend className="label">What do you need help with?</legend>
        <div className="flex flex-wrap gap-1.5">
          {CONTACT_TOPICS.map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className={`chip ${topic === t ? 'chip-on' : 'bg-white hover:border-gold'}`}>
              {CONTACT_TOPIC_LABELS[t]}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">Your name</label>
          <input id="c-name" name="name" className="input" autoComplete="name" required maxLength={80} aria-invalid={!!fields.name} />
          {fields.name && <p className="mt-1 text-xs text-red-700">{fields.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email (we reply here)</label>
          <input id="c-email" name="email" type="email" className="input" autoComplete="email" required maxLength={120} aria-invalid={!!fields.email} />
          {fields.email && <p className="mt-1 text-xs text-red-700">{fields.email}</p>}
        </div>
      </div>
      {topic !== 'feedback' && (
        <div>
          <label htmlFor="c-invite" className="label">Invite link (optional)</label>
          <input id="c-invite" name="inviteLink" className="input" maxLength={200} placeholder="getnimantran.com/i/aarav-weds-meera" />
        </div>
      )}
      <div>
        <label htmlFor="c-message" className="label">Message</label>
        <textarea id="c-message" name="message" rows={6} className="input resize-y" required maxLength={3000} aria-invalid={!!fields.message}
          placeholder={topic === 'privacy' ? 'Tell us the email on your account and what you would like us to do (download or delete your data).' : 'Tell us what happened, or what you would like to do.'} />
        {fields.message && <p className="mt-1 text-xs text-red-700">{fields.message}</p>}
      </div>
      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === 'error' && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{status.message}</p>}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={sending}>
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
