'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, Check, Copy, Image as ImageIcon, Loader2, Pencil, Plus, Search, Share2, Trash2, X } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';
import { PageLink } from '@/components/ui/PageLink';
import { FamilyCardDialog, familyMessage, whatsappUrl } from '@/components/invite/FamilyCardDialog';
import type { PersonalEntry } from '@/lib/validation';
import type { PersonalInviteData } from '@/lib/types';

const noSubscribe = () => () => {};
const useOrigin = () => useSyncExternalStore(noSubscribe, () => window.location.origin, () => '');

/** "Sharma Parivar, 98765 43210" → { name, phone }. One family per line. */
export function parseFamilies(text: string): PersonalEntry[] {
  return text.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const m = /^(.*?)[,;\t]\s*([+\d][\d\s-]{6,18})$/.exec(line);
    return { name: (m ? m[1] : line).trim().slice(0, 40), phone: m ? m[2].trim() : '' };
  }).filter((e, i, all) => e.name.length >= 2 && all.findIndex((x) => x.name.toLowerCase() === e.name.toLowerCase()) === i);
}

type Filter = 'all' | 'todo' | 'sent';

/** Personal invites: each family gets a link that greets them by name, and a card with their name. */
export function FamilyCards({ id }: { id: string }) {
  const qc = useQueryClient();
  const origin = useOrigin();
  const invite = useQuery({ queryKey: queryKeys.invite(id), queryFn: () => api.getInvite(id) });
  const families = useQuery({ queryKey: queryKeys.personal(id), queryFn: () => api.listPersonal(id) });
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [card, setCard] = useState<PersonalInviteData | null>(null);
  const [editing, setEditing] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [copied, setCopied] = useState('');
  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.personal(id) });

  const add = useMutation({
    mutationFn: (entries: PersonalEntry[]) => api.addPersonal(id, entries),
    onSuccess: (r) => {
      setText('');
      setNote(`${r.added.length} added${r.skipped ? `, ${r.skipped} already on your list` : ''}.`);
      refresh();
    },
  });
  const update = useMutation({ mutationFn: (v: { pid: string; data: { name?: string; phone?: string; sent?: boolean } }) => api.updatePersonal(id, v.pid, v.data), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (pid: string) => api.deletePersonal(id, pid), onSuccess: refresh });

  const list = useMemo(() => families.data ?? [], [families.data]);
  const shown = useMemo(() => list.filter((f) =>
    (filter === 'all' || (filter === 'sent') === f.sent) && (!q || f.name.toLowerCase().includes(q.toLowerCase()) || f.phone.includes(q)),
  ), [list, filter, q]);

  const inv = invite.data;
  if (!inv) return <div className="container-page py-10"><div className="card h-96 animate-pulse" /></div>;
  const base = `${origin}/i/${inv.slug}`;
  const linkFor = (name: string) => `${base}?to=${encodeURIComponent(name)}`;
  const markSent = (f: PersonalInviteData) => !f.sent && update.mutate({ pid: f.id, data: { sent: true } });
  const entries = parseFamilies(text);
  const sentCount = list.filter((f) => f.sent).length;
  const copy = async (f: PersonalInviteData) => {
    await navigator.clipboard.writeText(linkFor(f.name)).catch(() => {});
    setCopied(f.id); setTimeout(() => setCopied(''), 1600);
  };

  return (
    <div className="container-page py-8 sm:py-10">
      <PageLink href={`/dashboard/invites/${id}`} className="btn btn-ghost btn-sm -ml-3 mb-2"><ArrowLeft className="h-4 w-4" /> Back to editor</PageLink>
      <h1 className="font-display text-4xl font-semibold text-maroon-900">Family cards</h1>
      <p className="max-w-2xl text-muted">Invite each family personally. Their link opens your invite with <b>“Specially for {list[0]?.name ?? 'The Sharma Parivar'}”</b> at the top, and you get a card with their name on it to send on WhatsApp.</p>

      {!inv.published && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" /> Your invite is still a draft. You can add families and preview cards now; publish it before sending, so the links open for them.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="card h-fit p-5" aria-labelledby="add-title">
          <h2 id="add-title" className="font-display text-2xl font-semibold text-maroon-900">Add families</h2>
          <label htmlFor="families" className="mt-1 block text-sm text-muted">One per line. Add a WhatsApp number after a comma if you like.</label>
          <textarea id="families" rows={7} className="input mt-3 resize-y" value={text} onChange={(e) => { setText(e.target.value); setNote(''); }}
            placeholder={'Sharma Parivar\nVerma family, 98765 43210\nMr. & Mrs. Iyer'} />
          {add.isError && <p className="mt-2 text-sm text-red-700" role="alert">{add.error.message}</p>}
          {note && <p className="mt-2 text-sm text-green-700" role="status">{note}</p>}
          <button type="button" className="btn btn-primary mt-3 w-full" disabled={!entries.length || add.isPending} onClick={() => add.mutate(entries)}>
            {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add {entries.length > 1 ? `${entries.length} families` : 'family'}
          </button>
        </section>

        <section aria-labelledby="list-title">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="list-title" className="font-display text-2xl font-semibold text-maroon-900">
              {list.length} {list.length === 1 ? 'family' : 'families'} <span className="text-base font-normal text-muted">· {sentCount} sent</span>
            </h2>
            <div className="flex gap-1.5">
              {(['all', 'todo', 'sent'] as const).map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`chip text-xs ${filter === f ? 'chip-on' : 'bg-white'}`}>
                  {{ all: 'All', todo: 'Not sent', sent: 'Sent' }[f]}
                </button>
              ))}
            </div>
          </div>
          {list.length > 8 && (
            <label className="relative mb-3 block">
              <span className="sr-only">Search families</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
              <input type="search" className="input pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or number" />
            </label>
          )}

          {families.isPending ? <div className="card h-48 animate-pulse" /> : list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">Add the families you’re inviting, and each one gets their own card and link.</div>
          ) : (
            <ul className="card divide-y divide-line">
              {shown.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-3 p-3.5 sm:flex-nowrap">
                  <button type="button" aria-label={f.sent ? `Mark ${f.name} as not sent` : `Mark ${f.name} as sent`} onClick={() => update.mutate({ pid: f.id, data: { sent: !f.sent } })}
                    className={`grid h-7 w-7 flex-none place-items-center rounded-full border-2 transition ${f.sent ? 'border-green-600 bg-green-600 text-white' : 'border-line bg-white text-transparent hover:border-gold'}`}>
                    <Check className="h-4 w-4" />
                  </button>
                  {editing?.id === f.id ? (
                    <form className="flex min-w-0 flex-1 flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); update.mutate({ pid: f.id, data: { name: editing.name, phone: editing.phone } }); setEditing(null); }}>
                      <input className="input min-w-0 flex-1 py-1.5" aria-label="Family name" value={editing.name} maxLength={40} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                      <input className="input w-36 py-1.5" aria-label="WhatsApp number" value={editing.phone} placeholder="Number" onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
                      <button type="submit" className="btn btn-primary btn-sm">Save</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)} aria-label="Cancel"><X className="h-4 w-4" /></button>
                    </form>
                  ) : (
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{f.name}</p>
                      <p className="text-xs text-muted">{f.phone || 'No number'}{f.sent ? ' · sent' : ''}</p>
                    </div>
                  )}
                  {editing?.id !== f.id && (
                    <div className="flex w-full flex-wrap gap-1.5 sm:w-auto sm:flex-none">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setCard(f)}><ImageIcon className="h-4 w-4" /> Card</button>
                      <a href={whatsappUrl(f.phone, familyMessage(inv, f.name, linkFor(f.name)))} target="_blank" rel="noopener noreferrer" onClick={() => markSent(f)}
                        className="btn btn-sm bg-[#25D366] text-white"><Share2 className="h-4 w-4" /> WhatsApp</a>
                      <button type="button" className="btn btn-ghost btn-sm px-2" onClick={() => copy(f)} aria-label={`Copy ${f.name}’s link`}>{copied === f.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
                      <button type="button" className="btn btn-ghost btn-sm px-2" onClick={() => setEditing({ id: f.id, name: f.name, phone: f.phone })} aria-label={`Edit ${f.name}`}><Pencil className="h-4 w-4" /></button>
                      <button type="button" className="btn btn-ghost btn-sm px-2 text-red-700" onClick={() => confirm(`Remove ${f.name}?`) && remove.mutate(f.id)} aria-label={`Remove ${f.name}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  )}
                </li>
              ))}
              {shown.length === 0 && <li className="p-6 text-center text-sm text-muted">No families match.</li>}
            </ul>
          )}
        </section>
      </div>

      {card && <FamilyCardDialog invite={inv} family={card.name} link={linkFor(card.name)} onClose={() => setCard(null)} onSent={() => markSent(card)} />}
    </div>
  );
}
