'use client';

import { useSearchParams } from 'next/navigation';
import { TemplateBrowser } from '@/components/templates/TemplateBrowser';

/** Reads ?q= so searches can be linked and shared (rendered inside <Suspense>). */
export function TemplateSearch() {
  const q = useSearchParams().get('q') ?? '';
  return <TemplateBrowser initialQuery={q} syncUrl />;
}
