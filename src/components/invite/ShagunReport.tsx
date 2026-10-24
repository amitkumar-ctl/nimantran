'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, Pencil } from 'lucide-react';
import { fieldErrors, shagunReportSchema } from '@/lib/validation';
import { fetchMyRsvp, myRsvpKey, type MyRsvp } from './RsvpForm';

/*
 * "Already sent shagun? Let the couple know." UPI money goes straight to the
 * couple, so this is how it reaches their shagun register. One report per
 * browser; the guest can correct it later. Hidden for the couple themselves.
 */

const AMOUNTS = [501, 1100, 2100, 5100, 11000];
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function ShagunReport({ slug, preview = false }: { slug?: string; preview?: boolean }) {
  if (preview || !slug) {
    return (
      <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
        After paying, guests can tap <b>“I’ve sent shagun”</b> so it appears in your guest list.
      </p>
    );
  }
  return <LiveReport slug={slug} />;
}

function LiveReport({ slug }: { slug: string }) {
  const qc = useQueryClient();
  const { data, isPending } = useQuery({ queryKey: myRsvpKey(slug), queryFn: () => fetchMyRsvp(slug), retry: false });
  const [editing, setEditing] = useState(false);

  if (isPending) return null;
  if (data?.isOwner) {
    return <p className="mt-3 border-t border-line pt-3 text-xs text-muted">Guests can tell you here after sending shagun. You’ll see it in your guest list.</p>;
  }

  const mine = data?.shagun;
  if (mine && !editing) {
    return (
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm" aria-live="polite">
        <p className="text-green-800">
          <Check className="mr-1 inline h-4 w-4 align-[-3px]" />You told the couple you sent <b>{inr(mine.amount)}</b>. Thank you! 🙏
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /> Edit</button>
      </div>
    );
  }

  return (
    <ReportForm
      slug={slug}
      initial={{ name: mine?.name ?? data?.rsvp?.name ?? '', amount: mine?.amount ? String(mine.amount) : '', message: mine?.message ?? '' }}
      startOpen={editing}
      onSaved={(saved) => {
        qc.setQueryData<MyRsvp>(myRsvpKey(slug), (old) => ({ isOwner: false, rsvp: old?.rsvp ?? null, ...old, shagun: saved }));
        setEditing(false);
      }}
      onCancel={editing ? () => setEditing(false) : undefined}
    />
  );
}

function ReportForm({ slug, initial, startOpen, onSaved, onCancel }: {
  slug: string;
  initial: { name: string; amount: string; message: string };
  startOpen: boolean;
  onSaved: (s: NonNullable<MyRsvp['shagun']>) => void;
  onCancel?: () => void;
}) {
  const [open, setOpen] = useState(startOpen);
  const [form, setForm] = useState({ ...initial, website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const send = useMutation({
    mutationFn: async (body: unknown) => {
      const res = await fetch(`/api/public/invites/${slug}/rsvp/shagun`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(out.message ?? 'Could not send'), { fields: out.fields });
      return out.shagun as NonNullable<MyRsvp['shagun']>;
    },
    onSuccess: onSaved,
    onError: (e: Error & { fields?: Record<string, string> }) => setErrors(e.fields ?? {}),
  });

  if (!open) {
    return (
      <button type="button" className="mt-3 w-full border-t border-line pt-3 text-left text-sm font-semibold text-inv-primary hover:underline" onClick={() => setOpen(true)}>
        Already sent shagun? Let the couple know →
      </button>
    );
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = shagunReportSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    send.mutate(parsed.data);
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3 border-t border-line pt-3" noValidate>
      <p className="text-sm font-semibold text-ink">Let the couple know you sent shagun</p>
      <div>
        <label htmlFor="sg-name" className="label">Your name</label>
        <input id="sg-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sharma family" aria-invalid={!!errors.name} />
        {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="sg-amount" className="label">Amount sent</label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">₹</span>
          <input id="sg-amount" className="input pl-8" inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^\d]/g, '') })} placeholder="1100" aria-invalid={!!errors.amount} />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {AMOUNTS.map((a) => (
            <button key={a} type="button" className={`chip text-xs ${form.amount === String(a) ? 'chip-on' : 'bg-white'}`} onClick={() => setForm({ ...form, amount: String(a) })}>{inr(a)}</button>
          ))}
        </div>
        {errors.amount && <p className="mt-1 text-xs text-red-700">{errors.amount}</p>}
      </div>
      <div>
        <label htmlFor="sg-msg" className="label">Blessing (optional)</label>
        <input id="sg-msg" className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Best wishes to you both!" />
      </div>
      {/* Honeypot for bots */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      {send.isError && !Object.keys(errors).length && <p className="text-sm text-red-700" role="alert">{send.error.message}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={send.isPending}>
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} I’ve sent shagun
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => (onCancel ? onCancel() : setOpen(false))}>Cancel</button>
      </div>
      <p className="text-[11px] text-muted">Only the couple sees this, in their guest list.</p>
    </form>
  );
}
