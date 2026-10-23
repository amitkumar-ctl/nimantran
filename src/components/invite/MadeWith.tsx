import Link from 'next/link';
import { site } from '@/config/site';
import { Diya } from '@/components/marketing/Festive';
import { templateCount } from '@/lib/themes';

// Tagged so Vercel Analytics shows how many visitors came from guests' invites.
const UTM = 'utm_source=invite&utm_medium=footer&utm_campaign=made_with';

/** "Made with Nimantran" footer on public invites: every guest is a potential couple. */
export function MadeWith() {
  return (
    <footer className="bg-maroon-900 px-5 py-10 text-center text-cream">
      <Link href={`/?${UTM}`} className="inline-flex items-center gap-2 font-display text-xl text-gold-200 hover:underline">
        <Diya className="h-6 w-6" /> Made with love on <b className="font-semibold">{site.name}</b>
      </Link>
      <p className="mx-auto mt-2 max-w-sm text-sm text-cream/75">
        Planning a wedding or a family function? Create an invitation website like this one, free, in about 5 minutes.
      </p>
      <Link href={`/signup?${UTM}`} className="btn btn-shine mt-5 bg-gold-200 text-maroon-900 hover:bg-gold">
        Create your own invite
      </Link>
      <p className="mt-4 text-xs text-cream/50">RSVP · Venue maps · Countdown · UPI shagun · {templateCount().toLocaleString('en-IN')}+ designs</p>
    </footer>
  );
}
