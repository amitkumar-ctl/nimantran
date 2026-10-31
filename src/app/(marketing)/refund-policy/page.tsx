import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/config/site';
import { H2, LegalPage } from '@/components/marketing/LegalPage';
import { premiumPrice } from '@/lib/payments/config';
import { rupees } from '@/lib/payments/plan';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: `Full refund within 7 days of paying for ${site.name} Premium. How to ask for one and how long it takes.`,
  alternates: { canonical: '/refund-policy' },
};

const SECTIONS = [
  { id: 'what', title: 'What you pay for' },
  { id: 'refund', title: '7-day full refund' },
  { id: 'how', title: 'How to ask' },
  { id: 'when', title: 'When the money arrives' },
  { id: 'after', title: 'What happens to your invite' },
  { id: 'cancel', title: 'Cancellations' },
  { id: 'failed', title: 'Failed or double payments' },
  { id: 'shagun', title: 'Shagun is not covered' },
  { id: 'contact', title: 'Contact' },
];

export default function RefundPolicyPage() {
  const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;
  return (
    <LegalPage title="Refund & Cancellation Policy" sections={SECTIONS} intro={
      <p>Creating and sharing an invite on {site.name} is free. This policy covers the optional one-time Premium upgrade. In short: if you are not happy, write to us within 7 days of paying and we refund the full amount.</p>
    }>
      <H2 id="what">1. What you pay for</H2>
      <p>Premium is a one-time payment (currently {rupees(premiumPrice())}, including any taxes shown at checkout) for one invitation. It adds a short custom link, removes the “Made with {site.name}” footer, allows unlimited family cards and lets you download the guest list. It is not a subscription and nothing renews. See <Link href="/pricing">Pricing</Link> for details.</p>
      <p>Payments are processed by Razorpay. {site.name} never sees or stores your card, UPI PIN or bank login.</p>

      <H2 id="refund">2. 7-day full refund</H2>
      <p>You can ask for a full refund for any reason within 7 days of the payment. No questions beyond what we need to find the payment.</p>
      <p>After 7 days we don’t normally give refunds, because by then the invite has usually been shared with guests. If something on our side stopped Premium working, write to us anyway and we will make it right.</p>

      <H2 id="how">3. How to ask</H2>
      <p>Email {mail} or use the <Link href="/contact">contact form</Link> from the email address on your account. Include the couple’s names on the invite, and the payment ID from Razorpay’s receipt email if you have it.</p>

      <H2 id="when">4. When the money arrives</H2>
      <p>We start the refund within 2 working days of your request. It goes back to the same UPI account, card or bank you paid with. Banks usually show it within 5–7 working days after that (UPI refunds are often faster).</p>

      <H2 id="after">5. What happens to your invite</H2>
      <p>Your invite, guest replies and family cards stay exactly as they are. The Premium extras switch off: the footer returns, new family cards beyond the free limit and the guest list download need Premium again. Your short link keeps opening the invite, so guests who already have it are not stranded, but the editor goes back to sharing the standard link.</p>

      <H2 id="cancel">6. Cancellations</H2>
      <p>There is nothing to cancel: Premium is a one-time payment, not a plan. You can delete your invite or account at any time from the dashboard. If you do that within 7 days of paying, ask us for the refund before deleting so we can find the payment easily.</p>

      <H2 id="failed">7. Failed or double payments</H2>
      <p>If money left your account but the invite didn’t become Premium, it usually updates by itself within a few minutes. If it hasn’t after an hour, write to us. If you were charged twice for the same invite, we refund the extra payment in full, at any time.</p>

      <H2 id="shagun">8. Shagun is not covered</H2>
      <p>Shagun that guests send by UPI goes directly to the couple’s UPI ID. {site.name} never receives it, so we cannot refund or reverse it. See section 6 of our <Link href="/terms#shagun">Terms of Service</Link>.</p>

      <H2 id="contact">9. Contact</H2>
      <p>{site.legal.operator}, {site.legal.jurisdiction}. Email: {mail}.</p>
    </LegalPage>
  );
}
