import Link from 'next/link';
import { connection } from 'next/server';
import { Check, Crown } from 'lucide-react';
import { paymentsEnabled, premiumMrp, premiumPrice } from '@/lib/payments/config';
import { PREMIUM_PERKS, rupees } from '@/lib/payments/plan';

// Price-dependent bits of static marketing pages, read per request (wrap in <Suspense>),
// so changing the price or switching payments on never needs a rebuild.

/** Hero chip: "Free to design · ₹299 to publish". */
export async function HeroPlanChip() {
  await connection();
  return <>{paymentsEnabled() ? `Free to design · ${rupees(premiumPrice())} to publish` : 'Free to create · Ready in 5 minutes'}</>;
}

/** Home page "Free vs Premium" section. Nothing while payments are off. */
export async function HomePricing() {
  await connection();
  if (!paymentsEnabled()) return null;
  const price = premiumPrice(), mrp = premiumMrp();
  return (
    <section id="pricing" className="container-page py-16 sm:py-20" aria-labelledby="home-pricing-title">
      <h2 id="home-pricing-title" className="text-center font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Design free. Pay once to share.</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-ink/80">Try every design and see your invite exactly as guests will, without paying anything. When it’s ready, one payment publishes it for your wedding.</p>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="card p-6 sm:p-7">
          <h3 className="font-display text-2xl font-semibold text-maroon-900">Free</h3>
          <p className="mt-1 font-display text-4xl font-semibold text-maroon-900">₹0</p>
          <ul className="mt-5 space-y-2.5 text-ink/85">
            {['Every design, in 13 Indian languages', 'All your functions, venues and maps', 'Live preview of your invite on a phone', 'One sample family card'].map((f) => (
              <li key={f} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 flex-none text-green-700" />{f}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">Only you can see the invite until you publish it.</p>
        </div>
        <div className="rounded-2xl border-2 border-gold bg-gradient-to-b from-[#fff8e8] to-white p-6 shadow-[0_10px_30px_rgba(201,162,75,0.18)] sm:p-7">
          <h3 className="flex items-center gap-2 font-display text-2xl font-semibold text-maroon-900"><Crown className="h-5 w-5 text-gold" /> Premium</h3>
          <p className="mt-1">
            <span className="font-display text-4xl font-semibold text-maroon-900">{rupees(price)}</span>
            {mrp > 0 && <s className="ml-2 text-lg text-muted">{rupees(mrp)}</s>}
            <span className="ml-2 text-sm text-muted">once, per wedding</span>
          </p>
          <ul className="mt-5 space-y-2.5">
            {PREMIUM_PERKS.map((p) => <li key={p.key} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 flex-none text-green-700" /><b className="font-semibold">{p.title}</b></li>)}
            <li className="flex gap-2.5"><Check className="mt-1 h-4 w-4 flex-none text-green-700" />Guest replies, UPI shagun and edits anytime</li>
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/signup" className="btn btn-primary">Start designing free</Link>
            <Link href="/pricing" className="text-sm text-muted underline underline-offset-2 hover:text-ink">Full details · 7-day refund</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
