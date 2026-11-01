'use client';

import { useState, type FormEvent } from 'react';
import { sharePath } from '@/lib/links';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarHeart, Compass, Crown, ExternalLink, Loader2, Pencil, Plus, Users } from 'lucide-react';
import { PriceLine, UpgradeButton, usePlan } from '@/components/premium/Upgrade';
import { canShareWith, rupees } from '@/lib/payments/plan';
import { api, ApiError, queryKeys } from '@/lib/api-client';
import { createInviteSchema, fieldErrors } from '@/lib/validation';
import { DEFAULT_THEME, isTheme, type Theme } from '@/lib/themes';
import { TemplateBrowser } from '@/components/templates/TemplateBrowser';
import { ThemeSwatch } from '@/components/invite/ThemeSwatch';
import { formatLongDate, pastDateErrors, todayIST } from '@/lib/format';
import { GuidedTour, TourButton } from '@/components/tour/GuidedTour';
import { DeleteInvite } from '@/components/invite/DeleteInvite';
import { DASHBOARD_TOUR } from '@/components/tour/tours';
import { goToPage, PageLink } from '@/components/ui/PageLink';

export function DashboardHome() {
  const { data: invites, isPending, isError, error } = useQuery({ queryKey: queryKeys.invites, queryFn: api.listInvites });
  // Arriving from "Use this design" (/dashboard?template=…) opens the create
  // form with that design picked, even when the user already has invites.
  const raw = useSearchParams().get('template');
  const template = raw && isTheme(raw) ? raw : null;
  const [mode, setMode] = useState<'auto' | 'open' | 'closed'>('auto');
  const showCreate = mode === 'open' || (mode === 'auto' && !!template);
  const setShowCreate = (open: boolean) => setMode(open ? 'open' : 'closed');
  const hasInvites = (invites?.length ?? 0) > 0;
  const plan = usePlan();
  // One invite per account while payments are on.
  const atLimit = !!plan?.enabled && (invites?.length ?? 0) >= plan.maxInvites;
  const unpaid = plan?.enabled ? invites?.find((inv) => !canShareWith(inv, plan)) : undefined;

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-maroon-900">My invitations</h1>
          <p className="text-muted">Create, edit and share your wedding invite.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TourButton id="dashboard"><Compass className="h-4 w-4" /> Tour</TourButton>
          {hasInvites && !showCreate && !atLimit && (
            <button type="button" data-tour="new-invite" className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> New invite
            </button>
          )}
        </div>
      </div>

      {/* First visit: a short guided tour (once the page has loaded). */}
      {!isPending && <GuidedTour id="dashboard" steps={DASHBOARD_TOUR} />}

      {isPending && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="card h-44 animate-pulse" />)}</div>}
      {isError && <p className="card p-6 text-red-800" role="alert">{error.message}</p>}

      {!isPending && !isError && (!hasInvites || showCreate) && !atLimit && (
        <CreateInviteCard key={template ?? 'default'} initialTheme={template ?? DEFAULT_THEME} onCancel={hasInvites ? () => setShowCreate(false) : undefined} />
      )}
      {!isPending && atLimit && template && invites?.[0] && (
        <p className="card mb-6 p-4 text-sm text-ink" role="status">
          Your account has one invite. To use this design, open it and pick the design under <b>Design</b>.{' '}
          <PageLink href={`/dashboard/invites/${invites[0].id}`} className="font-semibold text-maroon underline underline-offset-2">Open my invite</PageLink>
        </p>
      )}

      {/* Unpaid invite: say plainly that guests can't see it yet, and what Premium adds. */}
      {unpaid && (
        <section aria-labelledby="premium-banner" className="mb-6 grid gap-5 rounded-2xl border-2 border-gold bg-gradient-to-br from-[#fff8e8] to-white p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 id="premium-banner" className="flex items-center gap-2 font-display text-2xl font-semibold text-maroon-900"><Crown className="h-5 w-5 text-gold" /> Your invite is a private preview</h2>
            <p className="mt-1 max-w-2xl text-ink/80">Design it as much as you like, free. When it’s ready, publish it with Premium to share it with guests: one link for WhatsApp, a QR code, guest replies, family cards for everyone, your own short link and no footer.</p>
            <PriceLine className="mt-3" />
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <UpgradeButton inviteId={unpaid.id} className="btn btn-primary px-6 py-3" />
            <a href="/pricing" target="_blank" className="text-sm text-muted underline underline-offset-2 hover:text-ink">What’s included · refunds</a>
          </div>
        </section>
      )}

      {hasInvites && (
        <ul className="mt-6 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invites!.map((inv, i) => (
            <li key={inv.id} data-tour={i === 0 ? 'invite-card' : undefined} className="card overflow-hidden">
              <ThemeSwatch theme={inv.theme} names={[inv.partner1, inv.partner2]} />
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-sm text-muted"><CalendarHeart className="h-4 w-4" />{formatLongDate(inv.weddingDate)}</p>
                  <span className="flex flex-none gap-1.5">
                    {inv.premium && <span className="rounded-full bg-[#fff3d1] px-2 py-0.5 text-[11px] font-semibold text-[#7a5410]">Premium</span>}
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${inv.published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {inv.published ? 'Live' : 'Draft'}
                    </span>
                  </span>
                </div>
                {/* One row: Edit · replies/Guests · View, and delete on the right. */}
                <div className="flex flex-wrap items-center gap-2 [&>.btn]:whitespace-nowrap">
                  <PageLink href={`/dashboard/invites/${inv.id}`} className="btn btn-outline btn-sm"><Pencil className="h-3.5 w-3.5" /> Edit</PageLink>
                  {/* Replies only come in once guests can open it. */}
                  {!(plan?.enabled && !canShareWith(inv, plan)) && (
                    <PageLink href={`/dashboard/invites/${inv.id}/guests`} className="btn btn-outline btn-sm"><Users className="h-3.5 w-3.5" /> {inv.rsvpEnabled || inv.rsvpCount ? `${inv.rsvpCount} ${inv.rsvpCount === 1 ? 'reply' : 'replies'}` : 'Guests'}</PageLink>
                  )}
                  {inv.published && (
                    <a href={sharePath(inv)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink className="h-3.5 w-3.5" /> View</a>
                  )}
                  {plan?.enabled && !canShareWith(inv, plan) && (
                    <UpgradeButton inviteId={inv.id} className="btn btn-sm border border-gold bg-[#fff3d1] text-[#5c3d06] hover:bg-[#ffe9ad]">Publish · {rupees(plan.price)}</UpgradeButton>
                  )}
                  <DeleteInvite id={inv.id} published={inv.published} rsvpCount={inv.rsvpCount} tour={i === 0 ? 'invite-delete' : undefined} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateInviteCard({ initialTheme, onCancel }: { initialTheme: Theme; onCancel?: () => void }) {
  const qc = useQueryClient();
  const plan = usePlan();
  const [form, setForm] = useState({ partner1: '', partner2: '', weddingDate: '', theme: initialTheme });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const create = useMutation({
    mutationFn: api.createInvite,
    onSuccess: (invite) => {
      qc.invalidateQueries({ queryKey: queryKeys.invites });
      qc.setQueryData(queryKeys.invite(invite.id), invite);
      goToPage(`/dashboard/invites/${invite.id}`); // full load: see PageLink
    },
    onError: (err) => setErrors(err instanceof ApiError && err.fields ? err.fields : {}),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = createInviteSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    const past = pastDateErrors({ weddingDate: parsed.data.weddingDate });
    if (past.weddingDate) return setErrors(past);
    setErrors({});
    create.mutate(parsed.data);
  }

  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-8" noValidate>
      <h2 className="font-display text-3xl font-semibold text-maroon-900">Start your invitation ✨</h2>
      <p className="mb-6 text-sm text-muted">Just the basics. You can add every function, venue and your UPI shagun next.{plan?.enabled ? ' Designing and previewing is free; you pay only when you publish it for guests.' : ''}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {(['partner1', 'partner2'] as const).map((k, i) => (
          <div key={k} data-tour={i === 0 ? 'create-names' : undefined}>
            <label htmlFor={k} className="label">{i === 0 ? "Groom's / partner's name" : "Bride's / partner's name"}</label>
            <input id={k} className="input" value={form[k]} placeholder={i === 0 ? 'Aarav' : 'Meera'} aria-invalid={!!errors[k]}
              onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
            {errors[k] && <p className="mt-1 text-xs text-red-700">{errors[k]}</p>}
          </div>
        ))}
        <div data-tour="create-date">
          <label htmlFor="weddingDate" className="label">Wedding date</label>
          <input id="weddingDate" type="date" className="input" min={todayIST()} value={form.weddingDate} aria-invalid={!!errors.weddingDate}
            onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))} />
          {errors.weddingDate && <p className="mt-1 text-xs text-red-700">{errors.weddingDate}</p>}
        </div>
      </div>

      <fieldset className="mt-6" data-tour="create-design">
        <legend className="label">Choose a design</legend>
        <TemplateBrowser
          mode="pick" className="mt-1" selected={form.theme}
          onSelect={(theme) => setForm((f) => ({ ...f, theme }))}
          names={form.partner1 && form.partner2 ? [form.partner1, form.partner2] : undefined}
        />
      </fieldset>

      {create.isError && !Object.keys(errors).length && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{create.error.message}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" data-tour="create-submit" className="btn btn-primary" disabled={create.isPending}>
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Create invite
        </button>
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
