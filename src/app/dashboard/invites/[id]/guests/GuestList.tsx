'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Compass, Download, Plus, RefreshCw, Search } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';
import { PageLink } from '@/components/ui/PageLink';
import { inr, ShagunRegister, type Prefill } from './ShagunRegister';
import { GuidedTour, TourButton } from '@/components/tour/GuidedTour';
import { GUESTS_TOUR } from '@/components/tour/tours';

type Filter = 'all' | 'yes' | 'no';

export function GuestList({ id }: { id: string }) {
  const invite = useQuery({ queryKey: queryKeys.invite(id), queryFn: () => api.getInvite(id) });
  const rsvps = useQuery({ queryKey: queryKeys.rsvps(id), queryFn: () => api.listRsvps(id), refetchInterval: 60_000 });
  const shagun = useQuery({ queryKey: queryKeys.shagun(id), queryFn: () => api.listShagun(id), refetchInterval: 60_000 });
  const [prefill, setPrefill] = useState<Prefill>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const stats = useMemo(() => {
    const list = rsvps.data ?? [];
    const yes = list.filter((r) => r.attending);
    const perEvent = new Map<string, number>();
    for (const r of yes) for (const e of r.events) perEvent.set(e, (perEvent.get(e) ?? 0) + r.guests);
    const entries = shagun.data ?? [];
    const received = entries.filter((e) => e.confirmed);
    const toCheck = entries.filter((e) => !e.confirmed);
    // Shagun per guest (linked entries), for the Shagun column.
    const byRsvp = new Map<string, { amount: number; confirmed: boolean }>();
    for (const e of entries) {
      if (!e.rsvpId) continue;
      const cur = byRsvp.get(e.rsvpId) ?? { amount: 0, confirmed: true };
      byRsvp.set(e.rsvpId, { amount: cur.amount + e.amount, confirmed: cur.confirmed && e.confirmed });
    }
    return {
      responses: list.length,
      attending: yes.length,
      declined: list.length - yes.length,
      headcount: yes.reduce((n, r) => n + r.guests, 0),
      perEvent,
      received: received.reduce((n, e) => n + e.amount, 0),
      receivedCount: received.length,
      toCheck: toCheck.reduce((n, e) => n + e.amount, 0),
      toCheckCount: toCheck.length,
      byRsvp,
    };
  }, [rsvps.data, shagun.data]);

  const addFor = (name: string, rsvpId: string) => {
    setPrefill({ name, rsvpId });
    requestAnimationFrame(() => document.getElementById('shagun')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const shagunCell = (r: { id: string; name: string }) => {
    const s = stats.byRsvp.get(r.id);
    if (s) return <span className="whitespace-nowrap font-semibold">{inr(s.amount)} <span className={s.confirmed ? 'text-green-700' : 'text-amber-700'} title={s.confirmed ? 'Received' : 'Reported by guest, to check'}>{s.confirmed ? '✓' : '•'}</span></span>;
    return <button type="button" className="text-xs font-semibold text-maroon hover:underline" onClick={() => addFor(r.name, r.id)}><Plus className="inline h-3 w-3" /> Add</button>;
  };

  const shown = (rsvps.data ?? []).filter(
    (r) => (filter === 'all' || (filter === 'yes') === r.attending) && (!q || r.name.toLowerCase().includes(q.toLowerCase()) || r.phone.includes(q)),
  );

  return (
    <div className="container-page py-8 sm:py-10">
      <PageLink href={`/dashboard/invites/${id}`} className="btn btn-ghost btn-sm -ml-3 mb-2"><ArrowLeft className="h-4 w-4" /> Back to editor</PageLink>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold text-maroon-900">Guest list</h1>
          {invite.data && <p className="text-muted">{invite.data.partner1} &amp; {invite.data.partner2}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <TourButton id="guests"><Compass className="h-4 w-4" /> Tour</TourButton>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { rsvps.refetch(); shagun.refetch(); }} disabled={rsvps.isFetching}>
            <RefreshCw className={`h-4 w-4 ${rsvps.isFetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <a href={`/api/invites/${id}/rsvps?format=csv`} data-tour="gl-download" className="btn btn-primary btn-sm"><Download className="h-4 w-4" /> Guest list (CSV)</a>
        </div>
      </div>

      {/* Counters: replies, who's coming (and how many people), shagun collected */}
      <div data-tour="gl-counts" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Responses</p>
          <p className="font-display text-3xl font-semibold text-maroon-900">{rsvps.isPending ? '–' : stats.responses}</p>
        </div>
        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Attending</p>
          <p className="font-display text-3xl font-semibold text-maroon-900">
            {rsvps.isPending ? '–' : stats.attending}
            {/* RSVPs can be for a whole family: the head-count caterers need. */}
            {!rsvps.isPending && <span className="ml-1.5 font-sans text-sm font-semibold text-muted">· {stats.headcount} {stats.headcount === 1 ? 'person' : 'people'}</span>}
          </p>
        </div>
        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Can’t come</p>
          <p className="font-display text-3xl font-semibold text-maroon-900">{rsvps.isPending ? '–' : stats.declined}</p>
        </div>
        <a href="#shagun" data-tour="gl-shagun-total" className="card p-3 transition hover:border-gold sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Shagun received</p>
          <p className="font-display text-3xl font-semibold text-maroon-900">{shagun.isPending ? '–' : inr(stats.received)}</p>
          {stats.toCheckCount > 0 && <p className="text-xs font-semibold text-amber-800">+ {inr(stats.toCheck)} to check</p>}
        </a>
      </div>

      {stats.perEvent.size > 0 && (
        <div data-tour="gl-per-function" className="card mt-3 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Headcount per function (for caterers)</p>
          <div className="flex flex-wrap gap-2">
            {[...stats.perEvent].map(([name, n]) => <span key={name} className="chip bg-cream-2">{name}: <b>{n}</b></span>)}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Search name or phone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search guests" />
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Filter">
          {(['all', 'yes', 'no'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`chip ${filter === f ? 'chip-on' : 'bg-white'}`}>
              {f === 'all' ? 'All' : f === 'yes' ? 'Attending' : 'Declined'}
            </button>
          ))}
        </div>
      </div>

      {rsvps.isError && <p className="card mt-4 p-4 text-red-800">{rsvps.error.message}</p>}
      {!rsvps.isPending && shown.length === 0 && (
        <div className="card mt-4 p-10 text-center text-muted">
          {stats.responses === 0 ? 'No RSVPs yet. Share your invite link on WhatsApp to start collecting responses.' : 'No guests match this filter.'}
        </div>
      )}

      {shown.length > 0 && (
        <>
          {/* Cards on mobile */}
          <ul data-tour="gl-guests" className="mt-4 space-y-3 md:hidden">
            {shown.map((r) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    {r.phone && <a href={`tel:${r.phone}`} className="text-sm text-muted">{r.phone}</a>}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.attending ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                    {r.attending ? `Yes · ${r.guests}` : 'No'}
                  </span>
                </div>
                {r.events.length > 0 && <p className="mt-2 text-sm text-muted">{r.events.join(' · ')}</p>}
                {r.dietary && <p className="mt-1 text-sm">🍽 {r.dietary}</p>}
                {r.message && <p className="mt-1 text-sm italic">“{r.message}”</p>}
                <p className="mt-2 flex items-center gap-2 border-t border-line pt-2 text-sm"><span className="text-muted">Shagun:</span> {shagunCell(r)}</p>
              </li>
            ))}
          </ul>
          {/* Table on desktop */}
          <div data-tour="gl-guests" className="card mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>{['Name', 'Phone', 'Attending', 'Guests', 'Functions', 'Dietary', 'Message', 'Shagun'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3 text-muted">{r.phone || '—'}</td>
                    <td className="px-4 py-3">{r.attending ? '✅ Yes' : '❌ No'}</td>
                    <td className="px-4 py-3">{r.attending ? r.guests : '—'}</td>
                    <td className="px-4 py-3 text-muted">{r.events.join(', ') || '—'}</td>
                    <td className="px-4 py-3">{r.dietary || '—'}</td>
                    <td className="max-w-64 px-4 py-3 italic text-muted">{r.message || '—'}</td>
                    <td className="px-4 py-3">{shagunCell(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ShagunRegister inviteId={id} entries={shagun.data ?? []} rsvps={rsvps.data ?? []} prefill={prefill} onPrefillUsed={() => setPrefill(null)} />

      {/* First visit: a short tour of the guest list and shagun register. */}
      {!rsvps.isPending && !shagun.isPending && <GuidedTour id="guests" steps={GUESTS_TOUR} />}
    </div>
  );
}
