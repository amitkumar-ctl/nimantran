'use client';

import { getLanguage, scriptProps } from '@/lib/templates/languages';
import { useGuestName } from './styles/GuestName';

/** "Respected Sharma Parivar", "आदरणीय शर्मा परिवार"… with the right font for each part. */
export function Salutation({ lang, name, className = '', nameClass = '' }: { lang: string; name: string; className?: string; nameClass?: string }) {
  const sal = scriptProps(getLanguage(lang).salutation, lang);
  const who = scriptProps(name, lang);
  return (
    <span className={className}>
      <span lang={sal.lang} dir={sal.dir} className={sal.className}>{getLanguage(lang).salutation}</span>{' '}
      <bdi lang={who.lang} className={who.script === 'latin' ? nameClass : who.className}>{name}</bdi>
    </span>
  );
}

/**
 * Shown at the top of the invite when it is opened from a family's personal
 * link (?to=…): a respectful address and "you and your family are cordially
 * invited", in the invite's language. The page itself stays the same cached
 * page for everyone; the name is read in the browser.
 */
export function ForFamily({ lang }: { lang: string }) {
  const name = useGuestName();
  if (!name) return null;
  const invited = scriptProps(getLanguage(lang).invited, lang);
  return (
    <div className="relative z-20 border-b border-inv-accent/30 bg-inv-surface px-4 py-3 text-center">
      <p className="text-lg leading-snug text-inv-heading">
        <Salutation lang={lang} name={name} nameClass="font-script text-[28px] leading-none text-inv-primary" />
      </p>
      <p lang={invited.lang} dir={invited.dir} className={`mt-0.5 text-sm text-muted ${invited.className || 'font-display text-base italic'}`}>{getLanguage(lang).invited}</p>
    </div>
  );
}
