import { CalendarPlus } from 'lucide-react';
import { googleCalendarUrl } from '@/lib/calendar';
import type { InviteData } from '@/lib/types';
import type { InviteEvent } from '@/lib/validation';

/*
 * "Add to calendar" menu: Google Calendar link + .ics download (Apple,
 * Outlook, most Android calendars). Built on <details>, so it works without
 * JavaScript. In the editor's preview (`disabled`) it's shown but inert,
 * because a draft's calendar file isn't public yet.
 */
export function AddToCalendar({ invite, event, link, disabled = false, label = 'Calendar', className = '' }: {
  invite: Pick<InviteData, 'slug' | 'partner1' | 'partner2' | 'venue' | 'city'>;
  /** One function, or omit for "all functions". */
  event?: InviteEvent;
  link: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const ics = `/i/${invite.slug}/calendar${event ? `?event=${encodeURIComponent(event.id)}` : ''}`;
  const button = (
    <>
      <CalendarPlus className="h-3.5 w-3.5" /> {label}
    </>
  );
  if (disabled) {
    return <span data-tour={event ? undefined : 'ed-calendar'} className={`btn btn-outline btn-sm rounded-full text-inv-primary ${className}`} aria-hidden="true">{button}</span>;
  }
  return (
    <details className={`group relative ${className}`}>
      <summary className="btn btn-outline btn-sm list-none rounded-full text-inv-primary [&::-webkit-details-marker]:hidden" aria-label={event ? `Add ${event.name} to your calendar` : 'Add all functions to your calendar'}>
        {button}
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-56 animate-pop overflow-hidden rounded-xl border border-line bg-white text-left text-sm shadow-xl">
        {event && (
          <a className="block px-4 py-3 hover:bg-cream" href={googleCalendarUrl(event, invite, link)} target="_blank" rel="noopener noreferrer">
            <b className="block">Google Calendar</b>
            <span className="text-xs text-muted">Android & web</span>
          </a>
        )}
        <a className="block border-t border-line px-4 py-3 first:border-t-0 hover:bg-cream" href={ics} download>
          <b className="block">{event ? 'Apple / Outlook' : 'All functions (.ics)'}</b>
          <span className="text-xs text-muted">{event ? 'iPhone, Mac, Outlook' : 'iPhone, Google, Outlook, Mac'}</span>
        </a>
      </div>
    </details>
  );
}
