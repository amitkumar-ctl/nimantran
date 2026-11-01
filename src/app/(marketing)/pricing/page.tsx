import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import Link from 'next/link';
import { Check, Crown } from 'lucide-react';
import { site } from '@/config/site';
import { paymentsEnabled, premiumMrp, premiumPrice } from '@/lib/payments/config';
import { FREE_FAMILY_CARDS, PREMIUM_PERKS, rupees } from '@/lib/payments/plan';
import { templateCount } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'Pricing',
  description: `Design and preview your wedding invitation on ${site.name} free. Publish it for guests with Premium: one payment per wedding, with guest replies, UPI shagun, family cards and your own short link.`,
  alternates: { canonical: '/pricing' },
};

const FREE = [
  `All ${templateCount().toLocaleString('en-IN')}+ designs, in 13 Indian languages`,
  'Every function: haldi, mehndi, sangeet, wedding, reception',
  'Venues, maps, timings, blessing and message',
  'Live preview: see your invite exactly as guests will',
  `${FREE_FAMILY_CARDS === 1 ? 'One sample family card' : `${FREE_FAMILY_CARDS} sample family cards`}`,
];

/** What guests get once it's published (on top of the Premium perks). */
const LIVE = ['Guest replies with headcount per function', 'UPI shagun straight to your account', 'Countdown and “save the date” to calendar', 'Edit anytime after sharing: the link stays the same'];

const QA = [
  { q: 'Is it a subscription?', a: 'No. You pay once for one wedding’s invite. Nothing renews and there is nothing to cancel.' },
  { q: 'Do I have to pay before I see anything?', a: 'No. Sign up, pick a design and fill in everything. You see the finished invite in the live preview before you pay. You pay only when you want to share it.' },
  { q: 'Can I make more than one invite?', a: 'Each account has one invite. You can change its names, date, design and functions as often as you like.' },
  { q: 'How do I pay?', a: 'UPI, debit or credit card, netbanking or wallets, through Razorpay. We never see your card or UPI PIN.' },
  { q: 'What if I change my mind?', a: <>Write to us within 7 days of paying for a full refund. See the <Link href="/refund-policy" className="underline">refund policy</Link>.</> },
];

export default function PricingPage() {
  return <Suspense fallback={<main className="container-page min-h-screen py-12 sm:py-16" />}><Pricing /></Suspense>;
}

// Price and "on sale" are read per request, so dashboard env changes show without a rebuild.
async function Pricing() {
  await connection();
  const price = premiumPrice();
  const mrp = premiumMrp();
  const onSale = paymentsEnabled();
  return (
    <main className="container-page py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › Pricing</nav>
      <h1 className="max-w-2xl font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Design it free. Pay once when you share it.</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/80">Try every design and build your whole invite without paying. When it’s ready, one payment publishes it for your wedding, with everything guests need.</p>
      {!onSale && <p className="mt-4 inline-block rounded-xl bg-cream px-4 py-2.5 text-sm text-ink">Premium is launching soon. Until then, every invite can be published free, with no limits.</p>}

      <div className="mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <section aria-labelledby="free-title" className="card p-6 sm:p-7">
          <h2 id="free-title" className="font-display text-2xl font-semibold text-maroon-900">Free</h2>
          <p className="mt-1"><span className="font-display text-4xl font-semibold text-maroon-900">₹0</span> <span className="text-sm text-muted">design and preview</span></p>
          <ul className="mt-5 space-y-2.5">
            {FREE.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 flex-none text-green-700" />{f}</li>)}
          </ul>
          <p className="mt-5 text-sm text-muted">Only you can see your invite until you publish it.</p>
          <Link href="/signup" className="btn btn-outline mt-4 w-full">Start designing free</Link>
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
          <p className="mt-4 text-sm font-semibold text-ink">And for your guests:</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink/85">
            {LIVE.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 flex-none text-green-700" />{f}</li>)}
          </ul>
          <Link href="/signup" className="btn btn-primary mt-6 w-full">Start designing free</Link>
          <p className="mt-2 text-center text-xs text-muted">Pay when you publish, from your invite. Full refund within 7 days.</p>
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
