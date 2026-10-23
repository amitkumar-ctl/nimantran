'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { api, queryKeys } from '@/lib/api-client';
import type { InviteSummary } from '@/lib/types';

type Props = {
  id: string;
  published: boolean;
  rsvpCount?: number;
  /** Called after the invite is gone (e.g. leave the editor). */
  onDeleted?: () => void;
  /** Small trash button for the dashboard cards; full-width for the editor. */
  variant?: 'card' | 'section';
  /** data-tour anchor for the guided tour. */
  tour?: string;
};

/**
 * Delete an invite with an inline "are you sure?" step (no browser pop-up).
 * The warning is stronger for live invites and ones that already have RSVPs,
 * because the guests' link stops working and the replies are deleted too.
 */
export function DeleteInvite({ id, published, rsvpCount = 0, onDeleted, variant = 'card', tour }: Props) {
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const del = useMutation({
    mutationFn: () => api.deleteInvite(id),
    onSuccess: () => {
      // Drop it from the list straight away, then refresh from the server.
      qc.setQueryData<InviteSummary[]>(queryKeys.invites, (list) => list?.filter((i) => i.id !== id));
      qc.removeQueries({ queryKey: queryKeys.invite(id) });
      qc.invalidateQueries({ queryKey: queryKeys.invites });
      onDeleted?.();
    },
  });

  if (!confirming) {
    return variant === 'card' ? (
      <button type="button" data-tour={tour} className="btn btn-ghost btn-sm ml-auto px-2.5 text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => setConfirming(true)} aria-label="Delete invite" title="Delete invite">
        <Trash2 className="h-4 w-4" />
      </button>
    ) : (
      <button type="button" className="btn btn-outline btn-sm border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50" onClick={() => setConfirming(true)}>
        <Trash2 className="h-4 w-4" /> Delete this invite
      </button>
    );
  }

  const warning = published
    ? `It’s live: the link you shared will stop working${rsvpCount ? ` and ${rsvpCount} RSVP${rsvpCount === 1 ? '' : 's'} will be deleted` : ''}.`
    : rsvpCount
      ? `${rsvpCount} RSVP${rsvpCount === 1 ? '' : 's'} will be deleted too.`
      : 'This draft will be removed.';

  return (
    <div role="alertdialog" aria-label="Confirm delete" className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
      <p><strong>Delete this invite?</strong> {warning} This can’t be undone.</p>
      {del.isError && <p className="mt-1 text-red-700" role="alert">{del.error.message}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button type="button" className="btn btn-sm bg-red-700 text-white hover:bg-red-800" disabled={del.isPending} onClick={() => del.mutate()}>
          {del.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Yes, delete
        </button>
        <button type="button" className="btn btn-ghost btn-sm" disabled={del.isPending} onClick={() => setConfirming(false)} autoFocus>
          Cancel
        </button>
      </div>
    </div>
  );
}
