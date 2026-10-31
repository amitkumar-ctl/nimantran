'use client';

import { useSyncExternalStore } from 'react';
import { getLanguage, scriptProps } from '@/lib/templates/languages';

/*
 * The family an invite link is addressed to: /i/aarav-weds-meera?to=Sharma%20Parivar
 * Read in the browser (the page itself stays cached and identical for everyone).
 */
const subscribe = () => () => {};
const read = () => {
  const to = new URLSearchParams(window.location.search).get('to')?.trim().slice(0, 40);
  return to || null;
};
const server = () => null;

/** Whether the link names a family (so the "With love, for" line can show). */
export function useGuestName() {
  return useSyncExternalStore(subscribe, read, server);
}

/**
 * The address on the envelope design: the respectful form in the invite's
 * language above the family's name ("आदरणीय / Sharma Parivar"), or
 * "With love, for / You & your family" when the link names nobody.
 */
export function EnvelopeAddress({ lang, kickerClass, nameClass }: { lang: string; kickerClass: string; nameClass: string }) {
  const to = useSyncExternalStore(subscribe, read, server);
  if (!to) {
    return <><span className={kickerClass}>WITH LOVE, FOR</span><span className={nameClass}>You &amp; your family</span></>;
  }
  const sal = scriptProps(getLanguage(lang).salutation, lang);
  const who = scriptProps(to, lang);
  return (
    <>
      <span lang={sal.lang} dir={sal.dir} className={`${kickerClass} ${sal.script === 'latin' ? '' : `${sal.className} !tracking-normal text-base`}`}>
        {sal.script === 'latin' ? getLanguage(lang).salutation.toUpperCase() : getLanguage(lang).salutation}
      </span>
      <bdi lang={who.lang} className={`${nameClass} ${who.script === 'latin' ? '' : `${who.className} !text-[32px]`}`}>{to}</bdi>
    </>
  );
}
