'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, RefreshCw, Search } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';
import { PageLink } from '@/components/ui/PageLink';

type Filter = 'all' | 'yes' | 'no';

export function GuestList({ id }: { id: string }) {
  const invite = useQuery({ queryKey: queryKeys.invite(id), queryFn: () => api.getInvite(id) });
  const rsvps = useQuery({ queryKey: queryKeys.rsvps(id), queryFn: () => api.listRsvps(id), refetchInterval: 60_000 });
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const stats = useMemo(() => {
    const list = rsvps.data ?? [];
    const yes = list.filter((r) => r.attending);
    const perEvent = new Map<string, number>();
    for (const r of yes) for (const e of r.events) perEvent.set(e, (perEvent.get(e) ?? 0) + r.guests);
    return {
      responses: list.length,
      attending: yes.length,
      declined: list.length - yes.length,
      headcount: yes.reduce((n, r) => n + r.guests, 0),
      perEvent,
    };
  }, [rsvps.data]);

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
        <div className="flex gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => rsvps.refetch()} disabled={rsvps.isFetching}>
            <RefreshCw className={`h-4 w-4 ${rsvps.isFetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <a href={`/api/invites/${id}/rsvps?format=csv`} className="btn btn-primary btn-sm"><Download className="h-4 w-4" /> Download Excel (CSV)</a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Responses', stats.responses],
          ['Attending', stats.attending],
          ['Total guests', stats.headcount],
          ['Can’t come', stats.declined],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="font-display text-4xl font-semibold text-maroon-900">{rsvps.isPending ? '–' : value}</p>
          </div>
        ))}
      </div>

      {stats.perEvent.size > 0 && (
        <div className="card mt-3 p-4">
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
          <ul className="mt-4 space-y-3 md:hidden">
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
              </li>
            ))}
          </ul>
          {/* Table on desktop */}
          <div className="card mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>{['Name', 'Phone', 'Attending', 'Guests', 'Functions', 'Dietary', 'Message'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
