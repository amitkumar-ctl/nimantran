import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { site } from '@/config/site';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Help & contact',
  description: `Get help with your ${site.name} wedding invitation: editing, sharing, RSVPs, shagun and privacy. Send us a message and we reply within one working day.`,
  alternates: { canonical: '/contact' },
};

const HELP: { q: string; a: React.ReactNode }[] = [
  { q: 'I changed something. Do I need to send the link again?', a: 'No. Save your changes and everyone who opens the same link sees the latest version, including venue and time changes.' },
  { q: 'Why can’t guests pay shagun from the button?', a: 'UPI apps block “pay” links to personal UPI IDs for safety. Guests copy your UPI ID or scan the QR code instead, then pay in their own app. Money goes straight to you; we never touch it.' },
  { q: 'A guest says their RSVP didn’t go through.', a: 'Ask them to open the invite again in the same phone browser: their reply is remembered there and they can edit it. Every RSVP appears instantly on your Guests page.' },
  { q: 'How do I remove an invite I made by mistake?', a: <>Open the invite in your dashboard and use <b>Delete invite</b> at the bottom. This also deletes its RSVPs and shagun register, permanently.</> },
  { q: 'Can I change the language or design after sharing?', a: <>Yes. Pick any design in the editor; your link stays the same. Use the language row in <Link href="/templates" className="underline">Templates</Link> to find designs in Hindi, Tamil, Bengali, Urdu and more.</> },
  { q: 'How do I delete my account and data?', a: <>Choose “Privacy or delete my data” below and tell us your account email. See the <Link href="/privacy" className="underline">Privacy Policy</Link> for what we keep and why.</> },
];

export default function ContactPage() {
  return (
    <main className="container-page py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › Help &amp; contact</nav>
      <h1 className="font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Help &amp; contact</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/80">Stuck on something, found a bug or have an idea? Write to us. A real person reads every message, usually within one working day.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
        <section aria-labelledby="quick-title">
          <h2 id="quick-title" className="font-display text-2xl font-semibold text-maroon-900">Quick answers</h2>
          <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
            {HELP.map((h) => (
              <details key={h.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">{h.q}<span className="text-gold transition group-open:rotate-45" aria-hidden="true">+</span></span>
                </summary>
                <p className="mt-2 text-ink/75">{h.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-ink/75">
            <Mail className="h-4 w-4 text-gold" /> Prefer email? <a className="font-semibold text-maroon underline" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
          </p>
        </section>

        <section aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">Send us a message</h2>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
