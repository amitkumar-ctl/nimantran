import { heroGradient, TEMPLATES, themeVars, type Theme } from '@/lib/themes';
import { Crest, initialsOf } from './Ornaments';

/** Small, static preview of a design: its hero colours, crest and sample names. */
export function ThemeSwatch({ theme, size = 'md', names }: { theme: Theme; size?: 'sm' | 'md' | 'lg'; names?: [string, string] }) {
  const t = TEMPLATES[theme];
  const [a, b] = names ?? [t.sample.partner1, t.sample.partner2];
  const dims = { sm: 'h-20', md: 'h-28', lg: 'aspect-[4/5]' }[size];
  const crest = { sm: 'h-7 w-7 text-[7px]', md: 'h-10 w-10 text-[9px]', lg: 'h-16 w-16 text-[12px] sm:h-20 sm:w-20' }[size];
  const script = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl sm:text-5xl' }[size];
  return (
    <span style={{ ...themeVars(theme), background: heroGradient(theme) }} className={`flex ${dims} w-full flex-col items-center justify-center gap-0.5 text-inv-accent`} aria-hidden="true">
      <Crest ornament={t.ornament} initials={initialsOf(a, b)} className={crest} />
      <span className={`font-script leading-tight ${script}`}>{a} &amp; {b}</span>
    </span>
  );
}
