'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Crown, Loader2 } from 'lucide-react';
import { api, ApiError, queryKeys, type CheckoutSuccess, type UpgradeOrder } from '@/lib/api-client';
import { canShareWith, PREMIUM_PERKS, rupees } from '@/lib/payments/plan';
import type { InviteData } from '@/lib/types';
import { useEditorStore } from '@/stores/editor-store';

/** Is Premium on sale, and its price. Undefined while loading. */
export function usePlan() {
  return useQuery({ queryKey: queryKeys.plan, queryFn: api.plan, staleTime: 10 * 60_000 }).data;
}

/** Can this invite go live? undefined while the plan is loading. */
export function useCanShare(inv: { premium?: boolean; createdAt?: string } | undefined) {
  const plan = usePlan();
  return plan && inv ? canShareWith(inv, plan) : undefined;
}

// ---- Razorpay Checkout (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/) ----

type RazorpayInstance = { open: () => void; on: (event: 'payment.failed', cb: (r: { error?: { description?: string } }) => void) => void };
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;
declare global { interface Window { Razorpay?: RazorpayCtor } }

let loader: Promise<RazorpayCtor> | null = null;
function loadCheckout(): Promise<RazorpayCtor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  loader ??= new Promise<RazorpayCtor>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('no Razorpay')));
    s.onerror = () => { loader = null; reject(new Error('blocked')); };
    document.head.appendChild(s);
  });
  return loader;
}

type Stage = 'idle' | 'starting' | 'paying' | 'confirming';

/**
 * "Upgrade" button: creates the order on our server, opens Razorpay Checkout
 * (UPI, cards, netbanking, wallets), then confirms the payment with our server.
 */
export function UpgradeButton({ inviteId, className = 'btn btn-primary', children, onPaid }: {
  inviteId: string; className?: string; children?: React.ReactNode;
  /** After paying. Default: publish the invite (that's what Premium is bought for). */
  onPaid?: (invite: InviteData) => unknown;
}) {
  const qc = useQueryClient();
  const plan = usePlan();
  const [stage, setStage] = useState<Stage>('idle');
  const [err, setErr] = useState('');

  const done = async (paid: InviteData | null) => {
    let invite = paid;
    if (invite) {
      if (useEditorStore.getState().draft?.id === inviteId) useEditorStore.getState().patchSaved({ premium: invite.premium, customSlug: invite.customSlug });
      if (onPaid) await Promise.resolve(onPaid(invite)).catch(() => {});
      else if (!invite.published) invite = await api.updateInvite(inviteId, { published: true }).catch(() => invite);
      if (invite && useEditorStore.getState().draft?.id === inviteId) useEditorStore.getState().patchSaved({ published: invite.published });
      if (invite) qc.setQueryData(queryKeys.invite(inviteId), invite);
    }
    qc.invalidateQueries({ queryKey: queryKeys.invites });
    qc.invalidateQueries({ queryKey: queryKeys.invite(inviteId) });
    setStage('idle');
  };

  async function start() {
    setErr('');
    setStage('starting');
    let order: UpgradeOrder;
    let Razorpay: RazorpayCtor;
    try {
      [order, Razorpay] = await Promise.all([api.upgrade(inviteId), loadCheckout()]);
    } catch (e) {
      setStage('idle');
      if (e instanceof ApiError && e.status === 409) return void done(null); // already Premium (e.g. paid in another tab)
      return setErr(e instanceof ApiError ? e.message : 'The payment window could not load. Check your internet connection, or turn off an ad blocker, and try again.');
    }
    const rzp = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      theme: { color: '#6b0f1a' },
      handler: async (res: CheckoutSuccess) => {
        setStage('confirming');
        try {
          await done(await api.verifyPayment(res));
        } catch (e) {
          setStage('idle');
          setErr(e instanceof Error ? e.message : 'We could not confirm the payment yet. Refresh in a minute.');
        }
      },
      modal: { ondismiss: () => setStage((s) => (s === 'paying' ? 'idle' : s)), confirm_close: true },
    });
    rzp.on('payment.failed', (r) => setErr(`Payment failed${r.error?.description ? `: ${r.error.description}` : ''}. No money was taken; you can try again.`));
    setStage('paying');
    rzp.open();
  }

  if (!plan?.enabled) return null;
  const busy = stage !== 'idle';
  return (
    <span className={`inline-flex flex-col items-start ${className.includes('w-full') ? 'w-full' : ''}`}>
      <button type="button" className={className} onClick={start} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
        {stage === 'confirming' ? 'Confirming payment…' : children ?? <>Publish with Premium · {rupees(plan.price)}</>}
      </button>
      {err && <span className="mt-2 block max-w-xs text-sm text-red-700" role="alert">{err}</span>}
    </span>
  );
}

/** Price line: "₹299 once for this wedding" with the launch "was" price struck through. */
export function PriceLine({ className = '' }: { className?: string }) {
  const plan = usePlan();
  if (!plan) return null;
  return (
    <p className={className}>
      <span className="font-display text-3xl font-semibold text-maroon-900">{rupees(plan.price)}</span>
      {plan.mrp > 0 && <s className="ml-2 text-muted">{rupees(plan.mrp)}</s>}
      <span className="ml-2 text-sm text-muted">once, for your wedding</span>
    </p>
  );
}

/** What Premium adds, with the buy button. `reason` explains why it's being shown here. */
export function PremiumOffer({ inviteId, reason, compact = false }: { inviteId: string; reason?: string; compact?: boolean }) {
  const plan = usePlan();
  if (!plan?.enabled) return null;
  return (
    <div className={`rounded-2xl border border-gold/60 bg-gradient-to-b from-[#fff8e8] to-white ${compact ? 'p-4' : 'p-5'}`}>
      {reason && <p className="mb-3 font-semibold text-ink">{reason}</p>}
      {!compact && <PriceLine />}
      <ul className={`space-y-2 text-sm ${compact ? '' : 'mt-3'}`}>
        {PREMIUM_PERKS.map((p) => (
          <li key={p.key} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-none text-green-700" />
            <span><b className="font-semibold text-ink">{p.title}.</b> {!compact && <span className="text-muted">{p.detail}</span>}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <UpgradeButton inviteId={inviteId} />
        <a href="/pricing" target="_blank" className="text-sm text-muted underline underline-offset-2 hover:text-ink">Pricing and refunds</a>
      </div>
    </div>
  );
}
