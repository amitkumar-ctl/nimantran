import { getTemplate, heroGradient, themeVars, type Theme } from '@/lib/themes';
import { Crest, HeroFrame, initialsOf, nameClass } from './Ornaments';

/** Small, static preview of a design: its hero colours, border, crest and sample names. */
export function ThemeSwatch({ theme, size = 'md', names }: { theme: Theme; size?: 'sm' | 'md' | 'lg'; names?: [string, string] }) {
  const t = getTemplate(theme);
  const [a, b] = names ?? [t.sample.partner1, t.sample.partner2];
  const dims = { sm: 'h-20', md: 'h-28', lg: 'aspect-[4/5]' }[size];
  const crest = { sm: 'h-7 w-7 text-[7px]', md: 'h-10 w-10 text-[9px]', lg: 'h-16 w-16 text-[12px] sm:h-20 sm:w-20' }[size];
  const serif = t.nameStyle === 'serif';
  const text = serif
    ? { sm: 'text-[10px]', md: 'text-sm', lg: 'text-lg sm:text-xl' }[size]
    : { sm: 'text-lg', md: 'text-2xl', lg: 'text-[28px] sm:text-[34px]' }[size];
  return (
    <span style={{ ...themeVars(t.id), background: heroGradient(t.id) }} className={`relative flex ${dims} w-full flex-col items-center justify-center gap-0.5 overflow-hidden text-inv-accent`} aria-hidden="true">
      <HeroFrame frame={t.frame} compact={size !== 'lg'} />
      <Crest ornament={t.ornament} initials={initialsOf(a, b)} className={`relative ${crest} ${t.frame === 'toran' && size !== 'lg' ? 'mt-2' : ''}`} />
      <span className={`relative max-w-full px-3 text-center ${nameClass(t.nameStyle)} leading-tight ${text} ${serif ? 'mt-0.5' : ''}`}>{a} &amp; {b}</span>
    </span>
  );
}
