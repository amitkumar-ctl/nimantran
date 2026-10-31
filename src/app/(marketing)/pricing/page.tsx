import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Crown } from 'lucide-react';
import { site } from '@/config/site';
import { paymentsEnabled, premiumMrp, premiumPrice } from '@/lib/payments/config';
import { FREE_FAMILY_CARDS, PREMIUM_PERKS, rupees } from '@/lib/payments/plan';
import { templateCount } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'Pricing',
  description: `${site.name} is free: every design, every language, guest replies and UPI shagun. Premium is a one-time upgrade for one wedding, with a short custom link and no footer.`,
  alternates: { canonical: '/pricing' },
};

const FREE = [
  `All ${templateCount().toLocaleString('en-IN')}+ designs, in 13 Indian languages`,
  'Every function: haldi, mehndi, sangeet, wedding, reception',
  'Venue maps, countdown and “save the date” to calendar',
  'Guest replies with headcount, and the guest list on your phone',
  'UPI shagun straight to your account, with a shagun register',
  `${FREE_FAMILY_CARDS} family cards with the family’s name`,
  'Change anything after sharing: the link stays the same',
];

const QA = [
  { q: 'Is it a subscription?', a: 'No. You pay once for one wedding’s invite. Nothing renews and there is nothing to cancel.' },
  { q: 'Can I start free and upgrade later?', a: 'Yes, at any time, even after you have shared the invite. Guests who already have your link keep using it; the short link is an extra.' },
  { q: 'How do I pay?', a: 'UPI, debit or credit card, netbanking or wallets, through Razorpay. We never see your card or UPI PIN.' },
  { q: 'What if I change my mind?', a: <>Write to us within 7 days of paying for a full refund. See the <Link href="/refund-policy" className="underline">refund policy</Link>.</> },
];

export default function PricingPage() {
  const price = premiumPrice();
  const mrp = premiumMrp();
  const onSale = paymentsEnabled();
  return (
    <main className="container-page py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › Pricing</nav>
      <h1 className="max-w-2xl font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Free to invite everyone. Premium if you want it to be all yours.</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/80">Everything you need to invite guests and collect replies is free, with no time limit. Premium is one payment for one wedding.</p>
      {!onSale && <p className="mt-4 inline-block rounded-xl bg-cream px-4 py-2.5 text-sm text-ink">Premium is launching soon. Until then, every invite is free with no limits.</p>}

      <div className="mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <section aria-labelledby="free-title" className="card p-6 sm:p-7">
          <h2 id="free-title" className="font-display text-2xl font-semibold text-maroon-900">Free</h2>
          <p className="mt-1"><span className="font-display text-4xl font-semibold text-maroon-900">₹0</span> <span className="text-sm text-muted">for as long as you need</span></p>
          <ul className="mt-5 space-y-2.5">
            {FREE.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 flex-none text-green-700" />{f}</li>)}
          </ul>
          <Link href="/signup" className="btn btn-outline mt-6 w-full">Create your invite</Link>
        </section>

        <section aria-labelledby="premium-title" className="relative rounded-2xl border-2 border-gold bg-gradient-to-b from-[#fff8e8] to-white p-6 shadow-[0_10px_30px_rgba(201,162,75,0.18)] sm:p-7">
          <h2 id="premium-title" className="flex items-center gap-2 font-display text-2xl font-semibold text-maroon-900"><Crown className="h-5 w-5 text-gold" /> Premium</h2>
          <p className="mt-1">
            <span className="font-display text-4xl font-semibold text-maroon-900">{rupees(price)}</span>
            {mrp > 0 && <s className="ml-2 text-lg text-muted">{rupees(mrp)}</s>}
            <span className="ml-2 text-sm text-muted">once, per wedding</span>
          </p>
          {mrp > 0 && <p className="mt-1 text-sm font-semibold text-[#7a5410]">Launch price</p>}
          <p className="mt-4 text-sm font-semibold text-ink">Everything in Free, plus:</p>
          <ul className="mt-2.5 space-y-3">
            {PREMIUM_PERKS.map((p) => (
              <li key={p.key} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 flex-none text-green-700" /><span><b className="font-semibold">{p.title}</b><span className="block text-sm text-muted">{p.detail}</span></span></li>
            ))}
          </ul>
          <Link href="/signup" className="btn btn-primary mt-6 w-full">{onSale ? 'Start free, upgrade from your invite' : 'Start free'}</Link>
          <p className="mt-2 text-center text-xs text-muted">Upgrade from the invite editor. Full refund within 7 days.</p>
        </section>
      </div>

      <section aria-labelledby="qa-title" className="mt-14 max-w-3xl">
        <h2 id="qa-title" className="font-display text-3xl font-semibold text-maroon-900">Questions about paying</h2>
        <dl className="mt-4 divide-y divide-line">
          {QA.map((x) => (
            <div key={x.q} className="py-4">
              <dt className="font-semibold text-ink">{x.q}</dt>
              <dd className="mt-1 text-ink/80">{x.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-muted">Prices are in Indian rupees and include applicable taxes. Payments are processed securely by Razorpay. Questions? <Link href="/contact" className="underline">Contact us</Link>.</p>
      </section>
    </main>
  );
}
