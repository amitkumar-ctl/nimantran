'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, IdCard, ChevronDown, ChevronUp, Compass, Copy, Eye, Loader2, Pencil, Plus, Rocket, Share2, Trash2, Users } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';
import { useEditorStore } from '@/stores/editor-store';
import { fieldErrors, inviteContentSchema } from '@/lib/validation';
import { pastDateErrors, todayIST } from '@/lib/format';
import { EVENT_PRESETS } from '@/lib/sample';
import { TemplateBrowser } from '@/components/templates/TemplateBrowser';
import type { InviteData } from '@/lib/types';
import { InviteView } from '@/components/invite/InviteView';
import { RsvpForm } from '@/components/invite/RsvpForm';
import { Shagun } from '@/components/invite/Shagun';
import { goToPage, PageLink } from '@/components/ui/PageLink';
import { DeleteInvite } from '@/components/invite/DeleteInvite';
import { QrCodeButton } from '@/components/invite/QrCodeButton';
import { getTemplate } from '@/lib/themes';
import { BLESSING_SUGGESTIONS, DEFAULT_BLESSINGS, getLanguage } from '@/lib/templates/languages';
import { GuidedTour, TourButton } from '@/components/tour/GuidedTour';
import { EDITOR_TOUR } from '@/components/tour/tours';

/** Just the editable fields (drops id, slug, published, updatedAt). */
const contentOf = (d: InviteData) =>
  Object.fromEntries(Object.keys(inviteContentSchema.shape).map((k) => [k, d[k as keyof InviteData]]));

// Site origin for share links, read without a setState-in-effect.
const noSubscribe = () => () => {};
const useOrigin = () => useSyncExternalStore(noSubscribe, () => window.location.origin, () => '');

export function InviteEditor({ id }: { id: string }) {
  const qc = useQueryClient();
  const { data, isPending, isError, error } = useQuery({ queryKey: queryKeys.invite(id), queryFn: () => api.getInvite(id) });
  const { draft, dirty, load, markSaved } = useEditorStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  // Load server data into the draft (only when switching invites, so a
  // background refetch never wipes unsaved typing).
  useEffect(() => {
    if (data && useEditorStore.getState().draft?.id !== data.id) load(data);
  }, [data, load]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const save = useMutation({
    mutationFn: (extra: { published?: boolean }) => {
      const parsed = inviteContentSchema.safeParse(contentOf(draft!));
      if (!parsed.success) {
        setErrors(fieldErrors(parsed.error));
        throw new Error('Please fix the highlighted fields');
      }
      // Same rule as the server: dates you change can't be in the past.
      const past = pastDateErrors(parsed.data, data);
      if (Object.keys(past).length) {
        setErrors(past);
        throw new Error('Please pick today or a later date for the highlighted dates');
      }
      setErrors({});
      return api.updateInvite(id, { ...parsed.data, ...extra });
    },
    onSuccess: (invite) => {
      markSaved(invite);
      qc.setQueryData(queryKeys.invite(id), invite);
      qc.invalidateQueries({ queryKey: queryKeys.invites });
    },
  });

  if (isPending || (!draft && !isError)) return <div className="container-page py-10"><div className="card h-96 animate-pulse" /></div>;
  if (isError) return <div className="container-page py-10"><p className="card p-6 text-red-800">{error.message}</p></div>;
  if (!draft) return null;

  return (
    <div className="pb-24 lg:pb-10">
      <EditorTopBar draft={draft} dirty={dirty} saving={save.isPending} onSave={(extra) => save.mutate(extra)} saveError={save.isError ? save.error.message : ''} />
      {/* First time in the editor: a short guided tour of every feature. */}
      <GuidedTour id="editor" steps={EDITOR_TOUR} />

      {/* Mobile tabs */}
      <div className="container-page mt-4 grid grid-cols-2 gap-2 lg:hidden" role="tablist">
        {(['edit', 'preview'] as const).map((t) => (
          <button key={t} role="tab" data-tour-tab={t} aria-selected={tab === t} onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'bg-maroon text-white' : 'btn-outline'}`}>
            {t === 'edit' ? <><Pencil className="h-4 w-4" /> Edit</> : <><Eye className="h-4 w-4" /> Preview</>}
          </button>
        ))}
      </div>

      <div className="container-page mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className={tab === 'edit' ? 'block' : 'hidden lg:block'}>
          <EditorForm errors={errors} />
        </div>
        <div className={tab === 'preview' ? 'block' : 'hidden lg:block'}>
          <div className="lg:sticky lg:top-24">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted">Live preview</p>
            <div data-tour="ed-preview" className="mx-auto w-full max-w-[400px] overflow-hidden rounded-[2.2rem] border-[10px] border-ink bg-ink shadow-2xl">
              <div className="h-[72vh] max-h-[760px] overflow-y-auto rounded-[1.6rem] bg-white">
                <InviteView
                  framed
                  invite={draft}
                  rsvpSlot={<RsvpForm preview slug={draft.slug} events={draft.events.map((e) => e.name)} />}
                  shagunSlot={<Shagun upiId={draft.upiId} upiName={draft.upiName} couple={`${draft.partner1} & ${draft.partner2}`} preview />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorTopBar({ draft, dirty, saving, onSave, saveError }: {
  draft: InviteData; dirty: boolean; saving: boolean; onSave: (extra: { published?: boolean }) => void; saveError: string;
}) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const link = `${origin}/i/${draft.slug}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`You're invited to the wedding of ${draft.partner1} & ${draft.partner2} 💍\n${link}`)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="border-b border-line bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/dashboard" className="btn btn-ghost btn-sm" aria-label="Back to my invites"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold text-maroon-900">{draft.partner1} &amp; {draft.partner2}</p>
            <p className="text-xs text-muted">
              <span className={draft.published ? 'text-green-700' : 'text-amber-700'}>{draft.published ? '● Live' : '● Draft'}</span>
              {dirty ? ' · Unsaved changes' : ' · All changes saved'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TourButton id="editor"><Compass className="h-4 w-4" /> <span className="hidden sm:inline">Tour</span></TourButton>
          <PageLink data-tour="ed-guests" href={`/dashboard/invites/${draft.id}/guests`} className="btn btn-ghost btn-sm"><Users className="h-4 w-4" /> Guests</PageLink>
          <PageLink data-tour="ed-cards" href={`/dashboard/invites/${draft.id}/cards`} className="btn btn-ghost btn-sm"><IdCard className="h-4 w-4" /> Family cards</PageLink>
          {draft.published && (
            <span data-tour="ed-share" className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline btn-sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy link'}</button>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-[#25D366] text-white"><Share2 className="h-4 w-4" /> WhatsApp</a>
              <QrCodeButton link={link} slug={draft.slug} names={`${draft.partner1} & ${draft.partner2}`} colour={getTemplate(draft.theme).colors.heading} />
            </span>
          )}
          <button type="button" data-tour="ed-save" className="btn btn-outline btn-sm" disabled={!dirty || saving} onClick={() => onSave({})}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
          {!draft.published ? (
            // Wrapper: the tour's "QR code" step points here until the invite is published.
            <span data-tour="ed-qr-soon" className="inline-flex">
              <button type="button" data-tour="ed-publish" className="btn btn-primary btn-sm" disabled={saving} onClick={() => onSave({ published: true })}>
                <Rocket className="h-4 w-4" /> Publish
              </button>
            </span>
          ) : (
            <button type="button" data-tour="ed-publish" className="btn btn-ghost btn-sm" disabled={saving} onClick={() => onSave({ published: false })}>Unpublish</button>
          )}
        </div>
      </div>
      {saveError && <p className="container-page pb-3 text-sm text-red-700" role="alert">{saveError}</p>}
    </div>
  );
}

function Section({ title, hint, tour, children }: { title: string; hint?: string; tour?: string; children: React.ReactNode }) {
  return (
    <section data-tour={tour} className="card p-5 sm:p-6">
      <h2 className="font-display text-2xl font-semibold text-maroon-900">{title}</h2>
      {hint && <p className="mb-4 text-sm text-muted">{hint}</p>}
      <div className={hint ? '' : 'mt-4'}>{children}</div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

function EditorForm({ errors }: { errors: Record<string, string> }) {
  const { draft, update, updateEvent, addEvent, removeEvent, moveEvent } = useEditorStore();
  if (!draft) return null;
  const today = todayIST(); // date pickers start from today (India time)
  const text = (k: keyof InviteData) => ({
    id: k, className: 'input', value: String(draft[k] ?? ''), 'aria-invalid': !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update({ [k]: e.target.value } as Partial<InviteData>),
  });

  return (
    <div className="space-y-5">
      <Section title="The couple" tour="ed-couple">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="partner1" label="Partner 1" error={errors.partner1}><input {...text('partner1')} /></Field>
          <Field id="partner2" label="Partner 2" error={errors.partner2}><input {...text('partner2')} /></Field>
          <Field id="blessing" label="Blessing (top line)">
            {/* Any language: suggestions in every script, or type your own. */}
            <input {...text('blessing')} dir="auto" list="blessing-options" placeholder="॥ शुभ विवाह ॥" />
            <datalist id="blessing-options">
              {BLESSING_SUGGESTIONS.map((b) => <option key={b.text} value={b.text}>{getLanguage(b.lang).name}</option>)}
            </datalist>
            <p className="mt-1 text-xs text-muted">Pick one in your language from the list, or type your own.</p>
          </Field>
          <div className="sm:col-span-2">
            <Field id="message" label="Invitation message"><textarea {...text('message')} rows={2} className="input resize-none" /></Field>
          </div>
        </div>
      </Section>

      <Section title="Wedding day" tour="ed-day">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="weddingDate" label="Date" error={errors.weddingDate}><input type="date" min={today} {...text('weddingDate')} /></Field>
          <Field id="weddingTime" label="Muhurat / time (for countdown)" error={errors.weddingTime}><input type="time" {...text('weddingTime')} /></Field>
          <Field id="venue" label="Main venue"><input {...text('venue')} placeholder="The Leela Palace, Jaipur" /></Field>
          <Field id="city" label="City"><input {...text('city')} placeholder="Jaipur" /></Field>
        </div>
      </Section>

      <Section title="Design" tour="ed-design">
        <TemplateBrowser mode="pick" pageSize={8} selected={draft.theme} onSelect={(theme) => update({
          theme,
          // Swap the top line to the new design's language, unless the couple wrote their own.
          ...(!draft.blessing.trim() || DEFAULT_BLESSINGS.has(draft.blessing.trim()) ? { blessing: getTemplate(theme).sample.blessing } : {}),
        })} names={[draft.partner1 || 'A', draft.partner2 || 'B']} />
      </Section>

      <Section title="Functions" tour="ed-functions" hint="Add every ceremony. Guests can choose which ones they'll attend.">
        <ol className="space-y-3">
          {draft.events.map((ev, i) => (
            <li key={ev.id} className="rounded-xl border border-line bg-cream/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <input aria-label="Emoji" className="input w-14 px-2 text-center text-lg" value={ev.emoji} onChange={(e) => updateEvent(ev.id, { emoji: e.target.value })} />
                <input aria-label="Function name" className="input font-semibold" value={ev.name} onChange={(e) => updateEvent(ev.id, { name: e.target.value })} />
                <div className="flex flex-none">
                  <button type="button" className="btn btn-ghost btn-sm px-2" onClick={() => moveEvent(ev.id, -1)} disabled={i === 0} aria-label="Move up"><ChevronUp className="h-4 w-4" /></button>
                  <button type="button" className="btn btn-ghost btn-sm px-2" onClick={() => moveEvent(ev.id, 1)} disabled={i === draft.events.length - 1} aria-label="Move down"><ChevronDown className="h-4 w-4" /></button>
                  <button type="button" className="btn btn-ghost btn-sm px-2 text-red-700" onClick={() => removeEvent(ev.id)} aria-label={`Remove ${ev.name}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`d-${ev.id}`} label="Date" error={errors[`events.${i}.date`]}>
                  <input id={`d-${ev.id}`} type="date" min={today} className="input" value={ev.date} aria-invalid={!!errors[`events.${i}.date`]} onChange={(e) => updateEvent(ev.id, { date: e.target.value })} />
                </Field>
                <Field id={`t-${ev.id}`} label="Time">
                  <input id={`t-${ev.id}`} className="input" value={ev.time} placeholder="7:30 PM" onChange={(e) => updateEvent(ev.id, { time: e.target.value })} />
                </Field>
                <Field id={`v-${ev.id}`} label="Venue">
                  <input id={`v-${ev.id}`} className="input" value={ev.venue} placeholder="Grand Ballroom" onChange={(e) => updateEvent(ev.id, { venue: e.target.value })} />
                </Field>
                <Field id={`m-${ev.id}`} label="Google Maps link (optional)" error={errors[`events.${i}.mapUrl`]}>
                  <input id={`m-${ev.id}`} className="input" value={ev.mapUrl} placeholder="https://maps.app.goo.gl/…" onChange={(e) => updateEvent(ev.id, { mapUrl: e.target.value })} />
                </Field>
                <div className="sm:col-span-2">
                  <Field id={`n-${ev.id}`} label="Note (optional)">
                    <input id={`n-${ev.id}`} className="input" value={ev.note} placeholder="Dress code: yellow" onChange={(e) => updateEvent(ev.id, { note: e.target.value })} />
                  </Field>
                </div>
              </div>
            </li>
          ))}
        </ol>
        {draft.events.length < 10 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {EVENT_PRESETS.filter((p) => !draft.events.some((e) => e.name === p.name)).map((p) => (
              <button key={p.name} type="button" className="chip bg-white hover:border-gold"
                onClick={() => addEvent({ ...p, date: draft.weddingDate, time: '', venue: '', mapUrl: '', note: '' })}>
                <Plus className="h-3.5 w-3.5" /> {p.emoji} {p.name}
              </button>
            ))}
            <button type="button" className="chip bg-white hover:border-gold"
              onClick={() => addEvent({ name: 'New function', emoji: '✨', date: draft.weddingDate, time: '', venue: '', mapUrl: '', note: '' })}>
              <Plus className="h-3.5 w-3.5" /> Custom
            </button>
          </div>
        )}
      </Section>

      <Section title="Guest replies & shagun" tour="ed-rsvp">
        {/* Some families only want to send a beautiful card, without asking anyone to reply. */}
        <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-cream/50 p-3.5">
          <input type="checkbox" className="mt-0.5 h-5 w-5 flex-none accent-maroon" checked={draft.rsvpEnabled !== false} onChange={(e) => update({ rsvpEnabled: e.target.checked })} />
          <span>
            <span className="block font-semibold text-ink">Ask guests to reply (RSVP)</span>
            <span className="block text-sm text-muted">{draft.rsvpEnabled !== false
              ? 'Guests tell you if they’re coming, how many people and for which functions.'
              : 'Off: your invite is just the card, with functions and maps. No reply form.'}</span>
          </span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {draft.rsvpEnabled !== false && (
            <>
              <Field id="rsvpDeadline" label="Ask guests to reply by (optional)" error={errors.rsvpDeadline}><input type="date" min={today} max={draft.weddingDate || undefined} {...text('rsvpDeadline')} /></Field>
              <div className="hidden sm:block" />
            </>
          )}
          <Field id="upiId" label="UPI ID for shagun (optional)" error={errors.upiId}><input {...text('upiId')} placeholder="name@okhdfcbank" autoCapitalize="none" /></Field>
          <Field id="upiName" label="Name shown in UPI app"><input {...text('upiName')} placeholder="Aarav Sharma" /></Field>
        </div>
        <p className="mt-3 rounded-xl bg-cream px-3 py-2.5 text-xs leading-relaxed text-muted">
          <b className="text-ink">Tips:</b> write the name exactly as your bank shows it, so guests can see they’re paying the right person.
          Guests can always pay by copying your UPI ID or scanning its QR code. One-tap “Open UPI app” links are often blocked for personal
          UPI IDs, but work with a free business UPI ID (Google Pay for Business, PhonePe Business, Paytm for Business).
        </p>
      </Section>

      <section data-tour="ed-delete" className="rounded-2xl border border-red-100 bg-white/60 p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-maroon-900">Delete invite</h2>
        <p className="mb-3 text-sm text-muted">Created by mistake? Remove this invite and its guest replies for good.</p>
        <DeleteInvite
          id={draft.id}
          published={draft.published}
          variant="section"
          onDeleted={() => {
            // Nothing left to save: clear the "unsaved changes" guard before leaving.
            useEditorStore.setState({ dirty: false });
            setTimeout(() => goToPage('/dashboard'), 0);
          }}
        />
      </section>
    </div>
  );
}
