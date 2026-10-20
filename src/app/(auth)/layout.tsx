import { Logo } from '@/components/ui/Logo';
import { Mandala } from '@/components/invite/Mandala';

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-maroon-900 p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div>
          <Mandala className="mb-6 h-28 w-28 text-gold-200" />
          <p className="font-script text-6xl text-gold-200">Your story,</p>
          <p className="font-display text-3xl">one beautiful link.</p>
          <p className="mt-4 max-w-sm text-cream/75">Every function, venue, RSVP and shagun, shared in a single WhatsApp message.</p>
        </div>
        <p className="text-sm text-cream/50">Free to create · No app needed for guests</p>
      </aside>
      <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 lg:hidden"><Logo /></div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
