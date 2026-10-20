import Link from 'next/link';
import { site } from '@/config/site';
import { Mandala } from '@/components/invite/Mandala';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white/10 text-gold-200' : 'bg-maroon text-gold-200'}`}>
        <Mandala className="h-6 w-6" />
      </span>
      <span className={`font-display text-2xl font-semibold ${light ? 'text-cream' : 'text-maroon-900'}`}>{site.name}</span>
    </Link>
  );
}
