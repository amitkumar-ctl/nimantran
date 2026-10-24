import { getTemplate, heroGradient, themeVars, type Theme } from '@/lib/themes';
import { Crest, HeroFrame, initialsOf, nameClass } from './Ornaments';
import { STYLE_VIEWS } from './styles';

/** Small, static preview of a design: its hero colours, border, crest and sample names. */
export function ThemeSwatch({ theme, size = 'md', names }: { theme: Theme; size?: 'sm' | 'md' | 'lg'; names?: [string, string] }) {
  const t = getTemplate(theme);
  const [a, b] = names ?? [t.sample.partner1, t.sample.partner2];
  if (t.layout !== 'classic') {
    const { Swatch } = STYLE_VIEWS[t.layout];
    return <span className="relative block w-full overflow-hidden"><Swatch design={t} names={[a, b]} blessing={t.sample.blessing} city={t.sample.city} size={size} /></span>;
  }
  const dims = { sm: 'h-20', md: 'h-28', lg: 'aspect-[4/5]' }[size];
  const crest = { sm: 'h-7 w-7 text-[7px]', md: 'h-10 w-10 text-[9px]', lg: 'h-16 w-16 text-[12px] sm:h-20 sm:w-20' }[size];
  const serif = t.nameStyle === 'serif';
  // Long names get smaller lettering so they stay inside the border.
  const len = a.length + b.length;
  const fit = len > 18 ? 2 : len > 13 ? 1 : 0;
  const text = (serif
    ? { sm: ['text-[10px]', 'text-[9px]', 'text-[8px]'], md: ['text-sm', 'text-xs', 'text-[11px]'], lg: ['text-lg sm:text-xl', 'text-base sm:text-lg', 'text-sm sm:text-base'] }
    : { sm: ['text-lg', 'text-base', 'text-sm'], md: ['text-2xl', 'text-xl', 'text-lg'], lg: ['text-[28px] sm:text-[34px]', 'text-2xl sm:text-[28px]', 'text-xl sm:text-2xl'] })[size][fit];
  return (
    <span style={{ ...themeVars(t.id), background: heroGradient(t.id) }} className={`relative flex ${dims} w-full flex-col items-center justify-center gap-0.5 overflow-hidden text-inv-accent`} aria-hidden="true">
      <HeroFrame frame={t.frame} compact={size !== 'lg'} />
      <Crest ornament={t.ornament} initials={initialsOf(a, b)} className={`relative ${crest} ${t.frame === 'toran' && size !== 'lg' ? 'mt-2' : ''}`} />
      <span className={`relative max-w-full px-4 text-center text-balance ${nameClass(t.nameStyle)} leading-tight ${text} ${serif ? 'mt-0.5' : ''}`}>{a}{'\u00a0'}&amp; {b}</span>
    </span>
  );
}
