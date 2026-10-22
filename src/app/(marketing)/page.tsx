import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarHeart, IndianRupee, MapPin, MessageCircleHeart, Pencil, Share2, Sparkles, Timer, Users } from 'lucide-react';
import { site, absoluteUrl } from '@/config/site';
import { FEATURED_IDS, getTemplate, templateCount } from '@/lib/themes';
import { ThemeSwatch } from '@/components/invite/ThemeSwatch';
import { HeroPhone } from '@/components/marketing/HeroPhone';
import { Diya, Garland, Petals } from '@/components/marketing/Festive';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { JsonLd } from '@/components/marketing/JsonLd';

export const metadata: Metadata = {
  title: { absolute: `Digital Wedding Invitation Website with RSVP | ${site.name}` },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { title: `Digital Wedding Invitation Website with RSVP | ${site.name}`, description: site.description, url: '/' },
};

const FEATURES = [
  { icon: CalendarHeart, title: 'Every function, one link', text: 'Haldi, mehndi, sangeet, wedding and reception: dates, times and venues in one beautiful page.' },
  { icon: Users, title: 'RSVP & live guest list', text: 'Guests reply in seconds. See who is coming, headcount per function and dietary needs, and export to Excel.' },
  { icon: MapPin, title: 'Venue maps', text: 'One tap opens Google Maps for each venue, so no more "bhaiya, location bhejo" calls.' },
  { icon: IndianRupee, title: 'UPI shagun', text: 'Relatives who can’t attend can bless you through any UPI app, straight from the invite.' },
  { icon: Timer, title: 'Live countdown', text: 'A countdown to your muhurat builds excitement every time guests open the link.' },
  { icon: Share2, title: 'Made for WhatsApp', text: 'A rich preview card with your names and date appears when you share the link.' },
];

const STEPS = [
  { icon: Pencil, title: 'Add your details', text: 'Names, wedding date and your functions. We pre-fill the usual ceremonies so you just edit.' },
  { icon: Sparkles, title: 'Pick a design', text: 'Royal maroon, marigold, mehndi garden or midnight: switch anytime, see changes live.' },
  { icon: MessageCircleHeart, title: 'Share & track RSVPs', text: 'Publish, send one WhatsApp message to everyone, and watch responses come in.' },
];

const FAQ = [
  { q: 'What is a digital wedding invitation website?', a: 'It is a single web page for your wedding that guests open from a link. It shows your names, every function with date, time and venue, a map link for each venue, a live countdown and an RSVP form, and it works on any phone without installing an app.' },
  { q: 'How do I share my wedding invitation on WhatsApp?', a: 'After you publish, tap the WhatsApp button in your dashboard or copy your invite link and paste it into any chat or group. WhatsApp shows a preview card with your names and wedding date.' },
  { q: 'How does RSVP work for guests?', a: 'Guests open your link, enter their name, choose whether they are attending, how many people are coming and which functions they will join. You see every response instantly in your guest list and can download it as an Excel-compatible CSV file.' },
  { q: 'Can I edit the invitation after sharing it?', a: 'Yes. Change venues, timings or add a function anytime. Everyone who opens the same link sees the latest details, with no need to resend anything.' },
  { q: 'Is my wedding invitation private?', a: 'Your invite is only visible to people who have the link. Invitation pages are hidden from Google and other search engines, and the link contains a random code so it cannot be guessed.' },
  { q: 'Can guests send shagun online?', a: 'Yes. Add your UPI ID and guests get a “Send Shagun” button that opens Google Pay, PhonePe, Paytm or any UPI app on their phone. Money goes directly to your account; we never touch it.' },
];

export default function HomePage() {
  return (
    <main>
      <JsonLd
        data={[
          { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: absoluteUrl('/'), logo: absoluteUrl('/icon.svg') },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: absoluteUrl('/'), inLanguage: 'en-IN' },
          {
            '@context': 'https://schema.org', '@type': 'WebApplication', name: site.name, url: absoluteUrl('/'),
            applicationCategory: 'LifestyleApplication', operatingSystem: 'Any',
            description: site.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          },
          {
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]}
      />

      <RevealOnScroll />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-gold-200/30 blur-3xl" />
        <Garland />
        <Petals />
        <div className="container-page relative grid items-center gap-12 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:grid-cols-[1.1fr_1fr] lg:pt-28 lg:pb-24">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-maroon">
              <Diya className="h-4 w-4" /> Free to create · Ready in 5 minutes
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-maroon-900 sm:text-6xl lg:text-7xl">
              Your wedding invitation, <span className="font-script font-normal text-gold">beautifully</span> online
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Create a wedding invitation website with every function, venue maps, a live countdown, RSVP and UPI shagun. Then share it
              in one WhatsApp message.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary btn-shine animate-glow px-7 py-4 text-base">Create your invite free</Link>
              <Link href="/templates" className="btn btn-outline px-7 py-4 text-base">See designs</Link>
            </div>
            <p className="mt-4 text-sm text-muted">No app for guests · Edit anytime · Works on every phone</p>
          </div>
          <HeroPhone total={templateCount().toLocaleString('en-IN')} />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container-page py-16 sm:py-20" aria-labelledby="features-title">
        <h2 id="features-title" className="text-center font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Everything guests ask you, answered</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">Replace the PDF card, the location pins and the endless “kab hai, kahan hai?” messages with one link.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <div key={title} data-reveal data-reveal-delay={(i % 3) * 110} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-cream-2 text-maroon group-hover:animate-wiggle"><Icon className="h-5 w-5" /></span>
              <h3 className="font-display text-2xl font-semibold text-maroon-900">{title}</h3>
              <p className="mt-1 text-[15px] text-ink/75">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-maroon-900 py-16 text-cream sm:py-20" aria-labelledby="how-title">
        <div className="container-page">
          <h2 id="how-title" className="text-center font-display text-4xl font-semibold text-gold-200 sm:text-5xl">How it works</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} data-reveal data-reveal-delay={i * 150} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                <span className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-200 font-display text-xl font-bold text-maroon-900">{i + 1}</span>
                  <Icon className="h-5 w-5 text-gold-200" />
                </span>
                <h3 className="font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-1 text-cream/75">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Templates ── */}
      <section className="container-page py-16 sm:py-20" aria-labelledby="designs-title">
        <h2 id="designs-title" className="text-center font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Designs for every ceremony</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">{templateCount().toLocaleString('en-IN')}+ designs: traditional, regional, pastel and destination. Search by colour, tradition or motif, and switch anytime, even after sharing.</p>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FEATURED_IDS.slice(0, 8).map((t, i) => (
            <Link key={t} href={`/templates/${t}`} data-reveal data-reveal-delay={(i % 4) * 90} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <ThemeSwatch theme={t} size="lg" />
              <div className="p-4">
                <h3 className="font-display text-xl font-semibold text-maroon-900 group-hover:underline">{getTemplate(t).name}</h3>
                <p className="text-sm text-muted">{getTemplate(t).tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/templates" className="btn btn-outline">Search all {templateCount().toLocaleString('en-IN')} designs</Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="container-page max-w-3xl py-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-center font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">Questions couples ask</h2>
        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} data-reveal className="card group p-5 open:shadow-md">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold text-maroon-900">
                {f.q}
                <span className="text-2xl text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container-page">
        <div data-reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-maroon-600 to-maroon-900 px-6 py-16 text-center text-cream sm:px-12">
          <Garland swags={6} className="opacity-90" />
          <Petals count={10} />
          <h2 className="relative mt-4 font-display text-4xl font-semibold text-gold-200 sm:text-5xl">Start your invitation today</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-cream/80">It’s free to create and takes about five minutes. Your guests will love it.</p>
          <Link href="/signup" className="btn btn-shine animate-glow relative mt-8 bg-gold-200 px-8 py-4 text-base text-maroon-900 hover:bg-gold">Create your invite free</Link>
        </div>
      </section>
    </main>
  );
}
