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
  const lg = size === 'lg';
  const serif = t.nameStyle === 'serif';
  // Long names get smaller lettering so they stay inside the border.
  const len = a.length + b.length;
  const fit = len > 18 ? 2 : len > 13 ? 1 : 0;
  // Small cards are 5:3 and size their lettering to the card's own width
  // (container units), so they look the same in a 2-column phone grid or a wide picker.
  const dims = lg ? 'aspect-[4/5]' : 'aspect-[5/3] @container';
  const crest = lg ? 'h-16 w-16 text-[12px] sm:h-20 sm:w-20' : 'h-[17cqw] w-[17cqw] text-[3.4cqw]';
  const text = lg
    ? (serif ? ['text-lg sm:text-xl', 'text-base sm:text-lg', 'text-sm sm:text-base'] : ['text-[28px] sm:text-[34px]', 'text-2xl sm:text-[28px]', 'text-xl sm:text-2xl'])[fit]
    : (serif ? ['text-[6.4cqw]', 'text-[5.4cqw]', 'text-[4.6cqw]'] : ['text-[11cqw]', 'text-[9cqw]', 'text-[7.6cqw]'])[fit];
  return (
    <span style={{ ...themeVars(t.id), background: heroGradient(t.id) }} className={`relative flex ${dims} w-full flex-col items-center justify-center gap-0.5 overflow-hidden text-inv-accent`} aria-hidden="true">
      <HeroFrame frame={t.frame} compact={!lg} />
      <Crest ornament={t.ornament} initials={initialsOf(a, b)} className={`relative ${crest} ${t.frame === 'toran' && !lg ? 'mt-[4cqw]' : ''}`} />
      <span className={`relative max-w-full px-[7cqw] text-center text-balance ${nameClass(t.nameStyle)} leading-tight ${text} ${serif ? 'mt-0.5' : ''}`}>{a}{'\u00a0'}&amp; {b}</span>
    </span>
  );
}
