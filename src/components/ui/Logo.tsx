import Link from 'next/link';
import { site } from '@/config/site';
import { BrandMark } from './BrandMark';

/** Header/footer lockup: the envelope mark + "Nimantran" (links home). */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <BrandMark className={`h-9 w-9 flex-none ${light ? 'drop-shadow-[0_0_0_1px_rgba(255,255,255,.15)]' : ''}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[25px] font-semibold tracking-[0.01em] ${light ? 'text-cream' : 'text-maroon-900'}`}>{site.name}</span>
        <span lang="hi" className={`mt-0.5 font-hindi text-[11px] tracking-[0.12em] ${light ? 'text-gold-200/80' : 'text-gold'}`}>निमंत्रण</span>
      </span>
    </Link>
  );
}
