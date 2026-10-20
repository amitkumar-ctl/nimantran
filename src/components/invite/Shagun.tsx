'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { upiLink } from '@/lib/format';

/** UPI shagun: "Pay" opens any UPI app on phones; the ID can be copied on desktop. */
export function Shagun({ upiId, upiName, couple }: { upiId: string; upiName: string; couple: string }) {
  const [copied, setCopied] = useState(false);
  if (!upiId) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the ID is visible to copy by hand */
    }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-gold bg-white p-4">
      <span className="text-3xl" aria-hidden="true">🪔</span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-xl font-semibold text-inv-heading">Send Shagun</p>
        <p className="truncate text-xs text-muted">Bless the couple via UPI · {upiId}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={copy} className="btn btn-outline btn-sm rounded-full" aria-label="Copy UPI ID">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a href={upiLink(upiId, upiName || couple, `Shagun for ${couple}`)} className="btn btn-sm rounded-full bg-cream-2 text-inv-primary">
          Pay ₹
        </a>
      </div>
    </div>
  );
}
