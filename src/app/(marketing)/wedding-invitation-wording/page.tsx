import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl, site } from '@/config/site';
import { JsonLd } from '@/components/marketing/JsonLd';

export const metadata: Metadata = {
  title: 'Wedding Invitation Wording in Hindi & English (Copy-Paste Samples)',
  description:
    'Ready-to-use wedding invitation wording in Hindi and English: traditional, modern and WhatsApp messages, plus wording for haldi, mehndi, sangeet, reception, and lines asking guests to reply (RSVP).',
  alternates: { canonical: '/wedding-invitation-wording' },
  openGraph: { type: 'article' },
};

type Sample = { label: string; text: string; lang?: 'hi' };

const SECTIONS: { id: string; title: string; intro: string; samples: Sample[] }[] = [
  {
    id: 'traditional-hindi',
    title: 'Traditional Hindi wedding invitation wording',
    intro: 'Formal wording works best when the invitation comes from parents or grandparents. Start with a blessing, then name the hosts, the couple and the main ceremony.',
    samples: [
      { label: 'Classic (from parents)', lang: 'hi', text: '॥ श्री गणेशाय नमः ॥\n\nसादर आमंत्रण\n\nश्रीमती एवं श्री राजेश शर्मा\nअपने सुपुत्र आरव\nके शुभ विवाह के पावन अवसर पर\nआपकी गरिमामयी उपस्थिति की कामना करते हैं।\n\nदिनांक: 12 दिसंबर 2026\nस्थान: द लीला पैलेस, जयपुर' },
      { label: 'Short & warm', lang: 'hi', text: '॥ शुभ विवाह ॥\n\nदो दिलों के पवित्र बंधन के साक्षी बनने के लिए\nआप सपरिवार सादर आमंत्रित हैं।\n\nआरव संग मीरा' },
    ],
  },
  {
    id: 'english-formal',
    title: 'Formal English wedding invitation wording',
    intro: 'English wording is popular for mixed-language families and guests from outside the community. Keep the hosts first and the couple’s names prominent.',
    samples: [
      { label: 'From the families', text: 'With the blessings of the Almighty and our elders,\nMrs. & Mr. Rajesh Sharma\nrequest the pleasure of your company\nat the wedding of their son\n\nAarav\nwith\nMeera\n\non Saturday, 12 December 2026\nat The Leela Palace, Jaipur' },
      { label: 'From the couple', text: 'Together with our families,\nwe joyfully invite you to celebrate our wedding.\n\nAarav & Meera\nSaturday, 12 December 2026 · Jaipur' },
    ],
  },
  {
    id: 'modern',
    title: 'Modern & fun wedding invite wording',
    intro: 'For friends and colleagues, a lighter tone feels personal. Mention the dress code or the mood of the celebration.',
    samples: [
      { label: 'Casual', text: 'We’re getting married! 💍\nThree days of haldi, music, dancing and way too much food.\nCome celebrate with us. It won’t be the same without you.\n\nAarav & Meera · 10–13 Dec 2026 · Jaipur' },
      { label: 'Destination wedding', text: 'Pack your bags! ✈️\nWe’re saying “I do” in Jaipur and we want you there.\nAll the functions, venues and stay details are in our invite below.' },
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp wedding invitation message',
    intro: 'Most invitations are now sent on WhatsApp. Keep the message short, put the link at the end, and let the invitation page hold all the details.',
    samples: [
      { label: 'English', text: 'Namaste 🙏\nWith great joy, we invite you and your family to the wedding of Aarav & Meera on 12 December 2026 in Jaipur.\nSee all functions and venues, and let us know if you’re coming:\n[your invite link]' },
      { label: 'Hindi', lang: 'hi', text: 'नमस्ते 🙏\nआरव और मीरा के शुभ विवाह (12 दिसंबर 2026, जयपुर) में आप सपरिवार सादर आमंत्रित हैं।\nसभी कार्यक्रम और स्थान इस लिंक पर देखें और बताएं कि आप आ रहे हैं:\n[आपका इनवाइट लिंक]' },
    ],
  },
  {
    id: 'functions',
    title: 'Wording for haldi, mehndi, sangeet and reception',
    intro: 'Each function deserves a line of its own. Add the time, venue and any dress code so guests can plan their outfits.',
    samples: [
      { label: 'Haldi', text: 'Join us for a morning of turmeric, laughter and marigolds.\nDress code: shades of yellow 🌼' },
      { label: 'Mehndi', text: 'An afternoon of henna, music and dholki. Come with empty hands, leave with beautiful ones 🌿' },
      { label: 'Sangeet', text: 'Bring your dancing shoes! An evening of performances, music and celebration 🎶\nDress code: Indo-western' },
      { label: 'Reception', text: 'Celebrate the newlyweds with us over dinner and dancing ✨' },
    ],
  },
  {
    id: 'rsvp',
    title: 'Asking guests to reply (RSVP lines)',
    intro: 'Ask guests to tell you by a clear date whether they’re coming, so you can confirm numbers with caterers and hotels. (“RSVP” on a card means exactly this: “please reply”.)',
    samples: [
      { label: 'Polite', text: 'Kindly let us know by 25 November if you’ll be joining us, so we can make arrangements for you.' },
      { label: 'Classic (RSVP)', text: 'RSVP (please reply) by 25 November.' },
      { label: 'Hindi', lang: 'hi', text: 'कृपया 25 नवंबर तक अपनी उपस्थिति की पुष्टि करें।' },
    ],
  },
];

export default function WordingPage() {
  return (
    <main className="container-page max-w-3xl py-12 sm:py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org', '@type': 'Article',
          headline: 'Wedding Invitation Wording in Hindi & English',
          description: 'Copy-paste wedding invitation wording in Hindi and English for every function and for WhatsApp.',
          inLanguage: ['en-IN', 'hi-IN'],
          author: { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.svg') } },
          mainEntityOfPage: absoluteUrl('/wedding-invitation-wording'),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> › Wedding invitation wording</nav>
      <article className="prose-page">
        <h1 className="font-display text-5xl font-semibold leading-tight text-maroon-900">Wedding invitation wording in Hindi &amp; English</h1>
        <p className="mt-4 text-lg">
          Finding the right words for your wedding card is harder than it looks. Below are ready-to-use samples, traditional and modern, in
          Hindi and English, plus short WhatsApp messages and lines for every function. Copy them, change the names and dates, and they’re ready.
        </p>

        <nav aria-label="On this page" className="card my-8 p-5">
          <p className="label">On this page</p>
          <ul className="!mb-0 !list-none !pl-0">
            {SECTIONS.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-maroon hover:underline">{s.title}</a></li>)}
          </ul>
        </nav>

        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2>{s.title}</h2>
            <p>{s.intro}</p>
            {s.samples.map((sample) => (
              <figure key={sample.label} className="card my-4 p-5">
                <figcaption className="label">{sample.label}</figcaption>
                <blockquote lang={sample.lang} className={`whitespace-pre-line text-[15px] leading-relaxed ${sample.lang === 'hi' ? 'font-hindi text-[17px]' : ''}`}>{sample.text}</blockquote>
              </figure>
            ))}
          </section>
        ))}

        <h2>Tips for writing your invitation</h2>
        <ul>
          <li>Put the most important details first: names, date and city.</li>
          <li>Give every function its own date, time and venue, because guests often attend only some of them.</li>
          <li>Include a dress code if you have one; guests appreciate knowing early.</li>
          <li>Add a “please reply by” date 2–3 weeks before the wedding so you can confirm catering numbers.</li>
          <li>Send one link instead of many PDFs and location pins, so you can update timings without resending.</li>
        </ul>
      </article>

      <div className="mt-12 rounded-3xl bg-maroon-900 p-8 text-center text-cream">
        <p className="font-display text-3xl font-semibold text-gold-200">Turn your wording into a beautiful invite</p>
        <p className="mt-2 text-cream/80">Paste your message into {site.name}, add your functions and share one link on WhatsApp.</p>
        <Link href="/signup" className="btn mt-6 bg-gold-200 text-maroon-900">Create your invite free</Link>
      </div>
    </main>
  );
}
