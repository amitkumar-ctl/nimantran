import Link from 'next/link';
import { Mandala } from '@/components/invite/Mandala';

export default function InviteNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-maroon-900 px-6 text-center text-cream">
      <div>
        <Mandala className="mx-auto mb-4 h-24 w-24 text-gold-200" />
        <h1 className="font-display text-4xl font-semibold text-gold-200">Invitation not found</h1>
        <p className="mx-auto mt-2 max-w-sm opacity-80">
          This link may be mistyped, or the couple hasn&apos;t published their invitation yet. Please check the link they sent you.
        </p>
        <Link href="/" className="btn mt-6 bg-gold-200 text-maroon-900">Create your own invite</Link>
      </div>
    </main>
  );
}
