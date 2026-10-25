'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Download, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api, queryKeys, type ShagunInput } from '@/lib/api-client';
import { fieldErrors, shagunEntrySchema } from '@/lib/validation';
import type { RsvpData, ShagunData } from '@/lib/types';

/*
 * The couple's shagun register. UPI payments go straight to their bank, so
 * entries come from guests ("I've sent ₹1,100", shown as "to check") or from
 * the couple (cash envelopes, gifts, anything they received).
 */

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const METHOD_LABEL: Record<ShagunData['method'], string> = { upi: 'UPI', cash: 'Cash', gift: 'Gift', other: 'Other' };

export type Prefill = { name: string; rsvpId: string | null } | null;

export function ShagunRegister({ inviteId, entries, rsvps, prefill, onPrefillUsed }: {
  inviteId: string;
  entries: ShagunData[];
  rsvps: RsvpData[];
  /** "+ Add" on a guest row opens the form for that guest. */
  prefill: Prefill;
  onPrefillUsed: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const showForm = adding || !!prefill;
  const close = () => { setAdding(false); onPrefillUsed(); };
  const toCheck = entries.filter((e) => !e.confirmed);

  return (
    <section id="shagun" data-tour="gl-register" className="mt-10 scroll-mt-24" aria-labelledby="shagun-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="shagun-title" className="font-display text-3xl font-semibold text-maroon-900">Shagun register</h2>
          <p className="text-sm text-muted">UPI shagun goes straight to your bank, so check your bank app and tick what arrived. Add cash envelopes and gifts here too.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`/api/invites/${inviteId}/shagun?format=csv`} className="btn btn-outline btn-sm"><Download className="h-4 w-4" /> Download (CSV)</a>
          {!showForm && <button type="button" data-tour="gl-record" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Record shagun</button>}
        </div>
      </div>

      {showForm && (
        <EntryForm
          key={prefill ? `p-${prefill.rsvpId ?? prefill.name}` : 'new'}
          inviteId={inviteId}
          rsvps={rsvps}
          initial={{ name: prefill?.name ?? '', amount: '', method: 'cash', note: '', rsvpId: prefill?.rsvpId ?? null }}
          title="Record shagun"
          onDone={close}
        />
      )}

      {toCheck.length > 0 && (
        <p data-tour="gl-to-check" className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {toCheck.length} shagun {toCheck.length === 1 ? 'report' : 'reports'} from guests to check ({inr(toCheck.reduce((n, e) => n + e.amount, 0))}). Look in your bank or UPI app and tap <b>Received</b>.
        </p>
      )}

      {entries.length === 0 ? (
        <div className="card mt-3 p-8 text-center text-sm text-muted">
          No shagun recorded yet. When guests tap “I’ve sent shagun” on your invite, it appears here. Record cash envelopes with <b>Record shagun</b>.
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {entries.map((e) => <EntryRow key={e.id} inviteId={inviteId} entry={e} rsvps={rsvps} />)}
        </ul>
      )}
    </section>
  );
}

function useInvalidate(inviteId: string) {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.shagun(inviteId) });
}

function EntryRow({ inviteId, entry: e, rsvps }: { inviteId: string; entry: ShagunData; rsvps: RsvpData[] }) {
  const refresh = useInvalidate(inviteId);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirm = useMutation({ mutationFn: (v: boolean) => api.updateShagun(inviteId, e.id, { confirmed: v }), onSuccess: refresh });
  const del = useMutation({ mutationFn: () => api.deleteShagun(inviteId, e.id), onSuccess: refresh });
  const guest = e.rsvpId ? rsvps.find((r) => r.id === e.rsvpId) : null;

  if (editing) {
    return (
      <li>
        <EntryForm
          inviteId={inviteId}
          entryId={e.id}
          rsvps={rsvps}
          initial={{ name: e.name, amount: String(e.amount), method: e.method, note: e.note, rsvpId: e.rsvpId }}
          title="Edit shagun"
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`card flex flex-wrap items-center gap-x-4 gap-y-2 p-3 sm:p-4 ${e.confirmed ? '' : 'border-amber-200 bg-amber-50/40'}`}>
      <div className="min-w-40 flex-1">
        <p className="font-semibold">{e.name}</p>
        <p className="text-xs text-muted">
          {METHOD_LABEL[e.method]} · {e.source === 'guest' ? 'Reported by guest' : 'Added by you'} · {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          {guest && guest.name !== e.name && <> · replied as {guest.name}</>}
        </p>
        {e.note && <p className="mt-0.5 text-sm italic text-muted">“{e.note}”</p>}
      </div>
      <p className="font-display text-2xl font-semibold text-maroon-900">{inr(e.amount)}</p>
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${e.confirmed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
        {e.confirmed ? 'Received' : 'To check'}
      </span>
      {confirmDelete ? (
        <div className="flex w-full items-center gap-2 text-sm sm:w-auto" role="alertdialog" aria-label="Confirm delete">
          <span>Delete this entry?</span>
          <button type="button" className="btn btn-sm bg-red-700 text-white hover:bg-red-800" disabled={del.isPending} onClick={() => del.mutate()}>Delete</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
        </div>
      ) : (
        <div className="flex gap-1">
          {!e.confirmed ? (
            <button type="button" className="btn btn-sm bg-green-700 text-white hover:bg-green-800" disabled={confirm.isPending} onClick={() => confirm.mutate(true)}>
              {confirm.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Received
            </button>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" title="Mark as not received" disabled={confirm.isPending} onClick={() => confirm.mutate(false)}>Undo</button>
          )}
          <button type="button" className="btn btn-ghost btn-sm px-2" aria-label={`Edit shagun from ${e.name}`} onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></button>
          <button type="button" className="btn btn-ghost btn-sm px-2 text-red-700" aria-label={`Delete shagun from ${e.name}`} onClick={() => setConfirmDelete(true)}><Trash2 className="h-4 w-4" /></button>
        </div>
      )}
    </li>
  );
}

type FormState = { name: string; amount: string; method: ShagunData['method']; note: string; rsvpId: string | null };

function EntryForm({ inviteId, entryId, rsvps, initial, title, onDone }: {
  inviteId: string; entryId?: string; rsvps: RsvpData[]; initial: FormState; title: string; onDone: () => void;
}) {
  const refresh = useInvalidate(inviteId);
  const [f, setF] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = useMutation({
    mutationFn: (data: ShagunInput) => (entryId ? api.updateShagun(inviteId, entryId, data) : api.addShagun(inviteId, data)),
    onSuccess: () => { refresh(); onDone(); },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = shagunEntrySchema.safeParse({ ...f, rsvpId: f.rsvpId || null });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    save.mutate(parsed.data as ShagunInput);
  }

  // Picking a guest fills in their name (still editable, e.g. "Sharma family").
  const pickGuest = (id: string) => {
    const g = rsvps.find((r) => r.id === id);
    setF((s) => ({ ...s, rsvpId: id || null, name: g && (!s.name || rsvps.some((r) => r.name === s.name)) ? g.name : s.name }));
  };

  return (
    <form onSubmit={submit} className="card mt-3 border-gold/60 p-4" noValidate>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-xl font-semibold text-maroon-900">{title}</p>
        <button type="button" className="btn btn-ghost btn-sm px-2" aria-label="Close" onClick={onDone}><X className="h-4 w-4" /></button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="se-guest" className="label">Guest (optional)</label>
          <select id="se-guest" className="input" value={f.rsvpId ?? ''} onChange={(e) => pickGuest(e.target.value)}>
            <option value="">Not on the guest list</option>
            {rsvps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="se-name" className="label">From</label>
          <input id="se-name" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Sharma family" aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="se-amount" className="label">Amount</label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">₹</span>
            <input id="se-amount" className="input pl-8" inputMode="numeric" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value.replace(/[^\d]/g, '') })} placeholder="1100" aria-invalid={!!errors.amount} />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-700">{errors.amount}</p>}
        </div>
        <div>
          <label htmlFor="se-method" className="label">How</label>
          <select id="se-method" className="input" value={f.method} onChange={(e) => setF({ ...f, method: e.target.value as FormState['method'] })}>
            {Object.entries(METHOD_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="se-note" className="label">Note (optional)</label>
          <input id="se-note" className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Envelope at the reception, silver coin…" />
        </div>
      </div>
      {save.isError && <p className="mt-2 text-sm text-red-700" role="alert">{save.error.message}</p>}
      <div className="mt-3 flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={save.isPending}>
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {entryId ? 'Save' : 'Add to register'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}
