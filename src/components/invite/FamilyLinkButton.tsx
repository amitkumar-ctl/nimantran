'use client';

import { useState } from 'react';
import { Check, Copy, Mail, Share2 } from 'lucide-react';

/*
 * Personal links for the envelope (Lifafa) designs: the envelope is addressed
 * to whoever is named in ?to=, e.g. "With love, for The Sharma Parivar".
 */
export function FamilyLinkButton({ link, couple }: { link: string; couple: string }) {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const to = name.trim().slice(0, 40);
  const personal = to ? `${link}?to=${encodeURIComponent(to)}` : link;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Dear ${to || 'family'}, you're invited to the wedding of ${couple} 💌\n${personal}`)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(personal).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <details className="group relative" data-tour="ed-family-link">
      <summary className="btn btn-outline btn-sm list-none [&::-webkit-details-marker]:hidden"><Mail className="h-4 w-4" /> Family link</summary>
      <div className="absolute right-0 z-30 mt-2 w-[min(88vw,320px)] animate-pop rounded-2xl border border-line bg-white p-4 text-left shadow-xl">
        <label htmlFor="family-name" className="label">Address the envelope to</label>
        <input id="family-name" className="input" value={name} maxLength={40} placeholder="The Sharma Parivar" onChange={(e) => setName(e.target.value)} />
        <p className="mt-2 text-xs text-muted">Their envelope will read “With love, for {to || '…'}”. Make one link per family.</p>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn btn-outline btn-sm flex-1" onClick={copy} disabled={!to}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}</button>
          <a href={to ? whatsapp : undefined} aria-disabled={!to} target="_blank" rel="noopener noreferrer" className={`btn btn-sm flex-1 bg-[#25D366] text-white ${to ? '' : 'pointer-events-none opacity-50'}`}><Share2 className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
    </details>
  );
}
