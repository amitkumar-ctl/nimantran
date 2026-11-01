'use client';

import { useState, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Crown, Loader2 } from 'lucide-react';
import { api, ApiError, queryKeys } from '@/lib/api-client';
import { CUSTOM_SLUG_RULE, customSlugProblem, sharePath, suggestSlug, tidySlug } from '@/lib/links';
import type { InviteData } from '@/lib/types';
import { useEditorStore } from '@/stores/editor-store';
import { PremiumOffer, useCanShare, usePlan } from './Upgrade';
import { PageLink } from '@/components/ui/PageLink';

const noSubscribe = () => () => {};
const useHost = () => useSyncExternalStore(noSubscribe, () => window.location.host, () => 'getnimantran.com');

/** Editor section: the invite's link, the Premium offer, and (once Premium) choosing a short link. */
export function LinkSection({ invite }: { invite: InviteData }) {
  const plan = usePlan();
  const live = useCanShare(invite); // older free invites are already live
  if (!invite.premium && !plan?.enabled) return null; // payments off: nothing to show
  return (
    <section data-tour="ed-premium" className={`p-5 sm:p-6 ${invite.premium ? 'card' : 'rounded-2xl border-2 border-gold bg-white shadow-[0_10px_30px_rgba(201,162,75,0.15)]'}`}>
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-maroon-900">
        <Crown className="h-5 w-5 text-gold" /> {invite.premium ? 'Premium' : live ? 'Make it Premium' : 'Publish your invite with Premium'}
      </h2>
      {invite.premium ? <CustomLinkForm invite={invite} /> : (
        <>
          <p className="mb-4 text-sm text-muted">{live
            ? 'Your invite is already live. Premium adds your own short link and removes the footer. One payment for your wedding.'
            : 'Right now your invite is a private preview that only you can see. One payment publishes it for your guests and adds everything below.'}</p>
          <PremiumOffer inviteId={invite.id} />
          {!live && <p className="mt-3 text-sm text-muted">Want to see a family card first? <PageLink href={`/dashboard/invites/${invite.id}/cards`} className="font-semibold text-maroon underline underline-offset-2">Make a free sample card</PageLink></p>}
        </>
      )}
    </section>
  );
}

function CustomLinkForm({ invite }: { invite: InviteData }) {
  const qc = useQueryClient();
  const host = useHost();
  const [value, setValue] = useState(invite.customSlug || suggestSlug(invite.partner1, invite.partner2));
  const [state, setState] = useState<{ saving?: boolean; error?: string; saved?: boolean }>({});
  const [copied, setCopied] = useState(false);
  const clean = tidySlug(value);
  const problem = clean ? customSlugProblem(clean) : CUSTOM_SLUG_RULE;
  const link = `${host}${sharePath(invite)}`;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (problem) return setState({ error: problem });
    setState({ saving: true });
    try {
      const inv = await api.setCustomLink(invite.id, clean);
      qc.setQueryData(queryKeys.invite(invite.id), inv);
      qc.invalidateQueries({ queryKey: queryKeys.invites });
      useEditorStore.getState().patchSaved({ customSlug: inv.customSlug });
      setValue(inv.customSlug);
      setState({ saved: true });
    } catch (err) {
      setState({ error: err instanceof ApiError ? err.message : 'Could not save. Please try again.' });
    }
  }

  return (
    <div className="mt-1">
      <p className="text-sm text-muted">{invite.customSlug
        ? 'Your invite can be shared, with no footer, unlimited family cards and the guest list download. Share your short link below.'
        : 'Thank you! Your invite can now be shared, with no footer, unlimited family cards and the guest list download. Now choose your short link.'}</p>
      <form onSubmit={save} className="mt-4">
        <label htmlFor="customSlug" className="label">Your link</label>
        <div className="flex flex-wrap gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-line bg-white focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-200">
            <span className="pl-3.5 text-sm whitespace-nowrap text-muted">{host}/</span>
            <input id="customSlug" className="min-w-0 flex-1 bg-transparent py-2.5 pr-3.5 outline-none" value={value} maxLength={40} autoCapitalize="none" spellCheck={false}
              aria-invalid={!!state.error} onChange={(e) => { setValue(e.target.value); setState({}); }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={state.saving || clean === invite.customSlug}>
            {state.saving && <Loader2 className="h-4 w-4 animate-spin" />} {invite.customSlug ? 'Change link' : 'Save link'}
          </button>
        </div>
        {state.error ? <p className="mt-1.5 text-sm text-red-700" role="alert">{state.error}</p>
          : clean !== value.trim() && clean ? <p className="mt-1.5 text-xs text-muted">Will be saved as <b>{clean}</b></p>
          : <p className="mt-1.5 text-xs text-muted">{CUSTOM_SLUG_RULE}{invite.customSlug ? ' If you change it, the old short link stops working, so change it before you share.' : ''}</p>}
      </form>
      {invite.customSlug && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-cream px-3.5 py-3">
          <span className="min-w-0 flex-1 truncate font-semibold text-ink">{link}</span>
          {state.saved && <span className="text-sm text-green-700" role="status">Saved</span>}
          <button type="button" className="btn btn-outline btn-sm" onClick={async () => { await navigator.clipboard.writeText(`https://${link}`).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      {invite.customSlug && <p className="mt-2 text-xs text-muted">Your earlier link (/i/{invite.slug}) keeps working too.</p>}
    </div>
  );
}
