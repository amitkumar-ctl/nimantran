'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { PageLink } from '@/components/ui/PageLink';
import { Check, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  CATEGORIES, COLOUR_FAMILIES, getTemplate, searchTemplates, templateCount,
  type TemplateFilters, type TemplateInfo, type Theme,
} from '@/lib/themes';
import { ORNAMENTS } from '@/lib/templates/parts';
import { LANGUAGES, scriptProps } from '@/lib/templates/languages';
import { LAYOUTS } from '@/lib/templates/styles';
import { ThemeSwatch } from '@/components/invite/ThemeSwatch';

type BrowseProps = { mode?: 'browse'; initialQuery?: string; syncUrl?: boolean };
type PickProps = { mode: 'pick'; selected: Theme; onSelect: (id: Theme) => void; names?: [string, string] };
type Props = (BrowseProps | PickProps) & { pageSize?: number; className?: string };

const SUGGESTIONS = ['envelope', 'bollywood', 'palace', 'tamil', 'bengali', 'nikah', 'punjabi', 'art deco', 'watercolour', 'red', 'pastel', 'haldi'];

/** Search + filter the whole catalogue (thousands of designs) instantly, in the browser. */
export function TemplateBrowser(props: Props) {
  const picking = props.mode === 'pick';
  const pageSize = props.pageSize ?? (picking ? 12 : 24);
  const [query, setQuery] = useState(props.mode !== 'pick' ? props.initialQuery ?? '' : '');
  const [filters, setFilters] = useState<TemplateFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const selectedId = props.mode === 'pick' ? props.selected : null;
  const results = useMemo(() => {
    const found = searchTemplates(deferredQuery, filters);
    // When picking, keep the current design first while nothing is searched.
    if (!selectedId || deferredQuery || Object.values(filters).some(Boolean)) return found;
    const sel = getTemplate(selectedId);
    return [sel, ...found.filter((t) => t.id !== sel.id)];
  }, [deferredQuery, filters, selectedId]);

  // "Show more" count resets whenever the search changes (no effect needed).
  const key = `${deferredQuery}|${JSON.stringify(filters)}`;
  const [shown, setShown] = useState({ key, n: pageSize });
  const visible = shown.key === key ? shown.n : pageSize;

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'lang').length;
  const anyFilter = activeFilters > 0 || !!filters.lang;
  const stale = query !== deferredQuery;

  function changeQuery(q: string) {
    setQuery(q);
    if (props.mode !== 'pick' && props.syncUrl) {
      const url = new URL(window.location.href);
      if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
      window.history.replaceState(null, '', url);
    }
  }
  const toggle = <K extends keyof TemplateFilters>(k: K, v: TemplateFilters[K]) =>
    setFilters((f) => ({ ...f, [k]: f[k] === v ? undefined : v }));

  return (
    <div className={props.className}>
      <div className="flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search designs</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search" className="input pl-10" value={query} autoComplete="off"
            placeholder={`Search ${templateCount().toLocaleString('en-IN')} designs: “tamil”, “envelope”, “red lotus”…`}
            onChange={(e) => changeQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          />
        </label>
        <button type="button" className={`btn btn-outline ${showFilters || activeFilters ? 'border-maroon' : ''}`} aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}>
          <SlidersHorizontal className="h-4 w-4" /> <span className="hidden sm:inline">Filters</span>
          {activeFilters > 0 && <span className="rounded-full bg-maroon px-1.5 text-[11px] text-white">{activeFilters}</span>}
        </button>
      </div>

      {/* Language is the first thing most families decide, so it's always on show. */}
      <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label="Language">
        <Chip on={!filters.lang} onClick={() => setFilters((f) => ({ ...f, lang: undefined }))}>All languages</Chip>
        {LANGUAGES.map((l) => {
          const sp = scriptProps(l.native);
          return (
            <Chip key={l.code} on={filters.lang === l.code} onClick={() => toggle('lang', l.code)}>
              {l.code === 'en' ? 'English' : <><span lang={sp.lang} dir={sp.dir} className={sp.className}>{l.native}</span><span className="text-xs text-muted">{l.name}</span></>}
            </Chip>
          );
        })}
      </div>

      {selectedId && (
        <p className="mt-3 text-sm">Selected: <strong className="text-maroon-900">{getTemplate(selectedId).name}</strong></p>
      )}

      {!query && !anyFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
          <span className="text-muted">Try:</span>
          {SUGGESTIONS.map((s) => <button key={s} type="button" className="chip bg-white hover:border-gold" onClick={() => changeQuery(s)}>{s}</button>)}
        </div>
      )}

      {showFilters && (
        <div className="mt-3 space-y-3 rounded-2xl border border-line bg-white p-4">
          <FilterRow label="Look">
            {LAYOUTS.map((l) => <Chip key={l.id} on={filters.layout === l.id} onClick={() => toggle('layout', l.id)}>{l.name}</Chip>)}
          </FilterRow>
          <FilterRow label="Style">
            {CATEGORIES.map((c) => <Chip key={c} on={filters.category === c} onClick={() => toggle('category', c)}>{c}</Chip>)}
          </FilterRow>
          <FilterRow label="Colour">
            {COLOUR_FAMILIES.map((c) => <Chip key={c} on={filters.family === c} onClick={() => toggle('family', c)}>{c}</Chip>)}
            <Chip on={filters.tone === 'light'} onClick={() => toggle('tone', 'light')}>Light background</Chip>
            <Chip on={filters.tone === 'dark'} onClick={() => toggle('tone', 'dark')}>Rich / dark</Chip>
          </FilterRow>
          <FilterRow label="Motif">
            {ORNAMENTS.map((o) => <Chip key={o.id} on={filters.ornament === o.id} onClick={() => toggle('ornament', o.id)}>{o.name}</Chip>)}
          </FilterRow>
          <FilterRow label="Names">
            <Chip on={filters.nameStyle === 'script'} onClick={() => toggle('nameStyle', 'script')}>Calligraphy</Chip>
            <Chip on={filters.nameStyle === 'serif'} onClick={() => toggle('nameStyle', 'serif')}>Engraved capitals</Chip>
          </FilterRow>
          {activeFilters > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFilters((f) => ({ lang: f.lang }))}><X className="h-3.5 w-3.5" /> Clear filters</button>}
        </div>
      )}

      <p className="mt-4 mb-3 text-sm text-muted" aria-live="polite">
        {results.length ? `${results.length.toLocaleString('en-IN')} design${results.length === 1 ? '' : 's'}` : 'No designs match.'}
        {filters.lang && <> in {LANGUAGES.find((l) => l.code === filters.lang)?.name}</>}
        {(query || anyFilter) && results.length > 0 && <> · <button type="button" className="underline" onClick={() => { changeQuery(''); setFilters({}); }}>show all</button></>}
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
          Try a colour (red, pastel, gold), a tradition (nikah, tamil, punjabi), a look (envelope, bollywood, palace) or another language.
        </div>
      ) : (
        <ul className={`grid gap-3 sm:gap-4 ${picking ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} ${stale ? 'opacity-60' : ''}`}>
          {results.slice(0, visible).map((t) => (
            <li key={t.id}>{picking ? <PickCard t={t} {...(props as PickProps)} /> : <BrowseCard t={t} />}</li>
          ))}
        </ul>
      )}

      {visible < results.length && (
        <div className="mt-6 text-center">
          <button type="button" className="btn btn-outline" onClick={() => setShown({ key, n: visible + pageSize * 2 })}>
            Show more ({(results.length - visible).toLocaleString('en-IN')} left)
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-16 flex-none text-xs font-semibold tracking-wide text-muted uppercase">{label}</span>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={on} onClick={onClick} className={`chip ${on ? 'chip-on' : 'bg-white hover:border-gold'}`}>{children}</button>;
}

export function BrowseCard({ t }: { t: TemplateInfo }) {
  return (
    // Prebuilt (featured) designs navigate in-app; generated ones use a normal page load (see PageLink).
    <DesignLink featured={t.featured} href={`/templates/${t.id}`} className="card group block overflow-hidden transition hover:-translate-y-1">
      <ThemeSwatch theme={t.id} size="lg" />
      <span className="block p-3 sm:p-4">
        <span className="block font-display text-lg leading-snug font-semibold text-maroon-900 group-hover:underline">{t.name}</span>
        <span className="block text-xs text-muted sm:text-sm">{t.featured || t.layout !== 'classic' ? t.tagline : t.category}</span>
      </span>
    </DesignLink>
  );
}

export function DesignLink({ featured, ...props }: { featured: boolean; href: string; className?: string; children: React.ReactNode }) {
  return featured ? <Link {...props} /> : <PageLink {...props} />;
}

function PickCard({ t, selected, onSelect, names }: { t: TemplateInfo } & PickProps) {
  const on = selected === t.id;
  return (
    <button type="button" onClick={() => onSelect(t.id)} aria-pressed={on}
      className={`relative block w-full overflow-hidden rounded-xl border-2 text-left transition ${on ? 'border-maroon shadow-md' : 'border-line hover:border-gold'}`}>
      <ThemeSwatch theme={t.id} size="sm" names={names} />
      {on && <span className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-maroon text-white"><Check className="h-3 w-3" /></span>}
      <span className="block bg-white px-2.5 py-2">
        <span className="block truncate text-xs font-semibold">{t.name}</span>
        <span className="block text-[11px] text-muted">{t.category}</span>
      </span>
    </button>
  );
}
