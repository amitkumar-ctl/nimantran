'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Minus, Plus, Check, Loader2 } from 'lucide-react';
import { rsvpSchema, fieldErrors, type RsvpInput } from '@/lib/validation';

type Props = { slug: string; events: string[]; preview?: boolean };

async function submitRsvp(slug: string, data: RsvpInput) {
  const res = await fetch(`/api/public/invites/${slug}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.message ?? 'Could not send RSVP'), { fields: body.fields });
  return body;
}

export function RsvpForm({ slug, events, preview = false }: Props) {
  const [form, setForm] = useState<RsvpInput>({
    name: '', phone: '', attending: true, guests: 1, events, dietary: '', message: '', website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (data: RsvpInput) => submitRsvp(slug, data),
    onError: (err: Error & { fields?: Record<string, string> }) => setErrors(err.fields ?? {}),
  });

  const set = <K extends keyof RsvpInput>(k: K, v: RsvpInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleEvent = (name: string) =>
    set('events', form.events.includes(name) ? form.events.filter((e) => e !== name) : [...form.events, name]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (preview) return;
    const parsed = rsvpSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    mutation.mutate(parsed.data);
  }

  if (mutation.isSuccess) {
    return (
      <div className="card animate-fade-up p-8 text-center" role="status">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-cream-2 text-inv-primary">
          <Check className="h-7 w-7" />
        </div>
        <p className="font-display text-2xl font-semibold text-inv-heading">
          {form.attending ? 'Thank you! See you there 🎉' : 'Thank you for letting us know 🙏'}
        </p>
        <p className="mt-1 text-sm text-muted">Your response has been sent to the couple.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-5 sm:p-6" noValidate>
      <div>
        <label htmlFor="rsvp-name" className="label">Your name</label>
        <input id="rsvp-name" className="input" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} placeholder="e.g. Rohan Sharma" />
        {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
      </div>

      <fieldset>
        <legend className="label">Attending?</legend>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((v) => (
            <button key={String(v)} type="button" onClick={() => set('attending', v)} aria-pressed={form.attending === v}
              className={`btn ${form.attending === v ? 'bg-inv-primary text-white' : 'btn-outline'}`}>
              {v ? 'Joyfully yes' : 'Sadly no'}
            </button>
          ))}
        </div>
      </fieldset>

      {form.attending && (
        <>
          <div>
            <span className="label" id="guests-label">Number of guests</span>
            <div className="flex items-center justify-between rounded-xl border border-line bg-white py-1.5 pr-1.5 pl-3.5" aria-labelledby="guests-label">
              <span className="text-[15px]">{form.guests} {form.guests === 1 ? 'person' : 'people'}</span>
              <span className="flex gap-1.5">
                <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-cream-2 text-inv-primary disabled:opacity-40" onClick={() => set('guests', Math.max(1, form.guests - 1))} disabled={form.guests <= 1} aria-label="Fewer guests"><Minus className="h-4 w-4" /></button>
                <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-cream-2 text-inv-primary disabled:opacity-40" onClick={() => set('guests', Math.min(20, form.guests + 1))} disabled={form.guests >= 20} aria-label="More guests"><Plus className="h-4 w-4" /></button>
              </span>
            </div>
          </div>

          {events.length > 0 && (
            <fieldset>
              <legend className="label">Which functions?</legend>
              <div className="flex flex-wrap gap-2">
                {events.map((ev) => {
                  const on = form.events.includes(ev);
                  return (
                    <button key={ev} type="button" onClick={() => toggleEvent(ev)} aria-pressed={on} className={`chip ${on ? 'chip-on' : 'bg-white'}`}>
                      {on && <Check className="h-3.5 w-3.5" />} {ev}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor="rsvp-diet" className="label">Dietary needs <span className="normal-case tracking-normal opacity-70">(optional)</span></label>
            <input id="rsvp-diet" className="input" value={form.dietary} onChange={(e) => set('dietary', e.target.value)} placeholder="e.g. Jain food for 1 guest" />
          </div>
        </>
      )}

      <div>
        <label htmlFor="rsvp-phone" className="label">Phone <span className="normal-case tracking-normal opacity-70">(optional)</span></label>
        <input id="rsvp-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} placeholder="+91 98xxxxxx10" />
        {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="rsvp-msg" className="label">Message for the couple <span className="normal-case tracking-normal opacity-70">(optional)</span></label>
        <textarea id="rsvp-msg" rows={2} className="input resize-none" value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Wishing you a lifetime of happiness!" />
      </div>

      {/* Honeypot for bots: hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={form.website} onChange={(e) => set('website', e.target.value)} />

      {mutation.isError && !Object.keys(errors).length && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{mutation.error.message}</p>
      )}

      <button type="submit" disabled={mutation.isPending || preview} className="btn w-full bg-inv-primary py-3.5 text-[15px] text-white shadow-lg">
        {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : 'Send RSVP 💌'}
      </button>
      {preview && <p className="text-center text-xs text-muted">Preview: guests fill this in on your invite link.</p>}
    </form>
  );
}
