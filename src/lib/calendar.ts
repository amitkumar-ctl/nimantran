import type { InviteData } from './types';
import type { InviteEvent } from './validation';

/*
 * "Add to calendar" for each function: a Google Calendar link and an .ics
 * file (Apple Calendar, Outlook, most Android calendars). Times on invites
 * are free text ("7:30 PM", "11 am", "19:30"); anything else becomes an
 * all-day event. Wedding times are India time (IST, UTC+5:30).
 */

const IST_OFFSET_MIN = 330;
const DEFAULT_HOURS = 3;

/** "7:30 PM" / "7 pm" / "19:30" / "7.30pm" → minutes after midnight, or null. */
export function parseTime(text: string): number | null {
  const m = /^\s*(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\s*$/i.exec(text || '');
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const ap = m[3]?.toLowerCase().replace(/\./g, '');
  if (min > 59 || h > 23 || (ap && (h < 1 || h > 12))) return null;
  if (!ap && !m[2]) return null; // a bare "7" is too ambiguous
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

type Window = { allDay: true; date: string } | { allDay: false; start: Date; end: Date };

export function eventWindow(ev: Pick<InviteEvent, 'date' | 'time'>): Window {
  const minutes = parseTime(ev.time);
  if (minutes === null) return { allDay: true, date: ev.date };
  const [y, mo, d] = ev.date.split('-').map(Number);
  const start = new Date(Date.UTC(y, mo - 1, d, 0, minutes - IST_OFFSET_MIN));
  return { allDay: false, start, end: new Date(start.getTime() + DEFAULT_HOURS * 3_600_000) };
}

const ymd = (date: string) => date.replace(/-/g, '');
const nextDay = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '');
};
const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); // 20261210T060000Z

const titleOf = (ev: InviteEvent, invite: Pick<InviteData, 'partner1' | 'partner2'>) => `${ev.name}: ${invite.partner1} & ${invite.partner2}`;
const placeOf = (ev: InviteEvent, invite: Pick<InviteData, 'venue' | 'city'>) =>
  [ev.venue || invite.venue, invite.city].filter(Boolean).join(', ');
const detailsOf = (ev: InviteEvent, link: string) => [ev.note, `Invitation, RSVP and map: ${link}`].filter(Boolean).join('\n\n');

/** Opens Google Calendar with the function filled in. */
export function googleCalendarUrl(ev: InviteEvent, invite: Pick<InviteData, 'partner1' | 'partner2' | 'venue' | 'city'>, link: string) {
  const w = eventWindow(ev);
  const dates = w.allDay ? `${ymd(w.date)}/${nextDay(w.date)}` : `${utcStamp(w.start)}/${utcStamp(w.end)}`;
  const p = new URLSearchParams({ action: 'TEMPLATE', text: titleOf(ev, invite), dates, details: detailsOf(ev, link), location: placeOf(ev, invite), ctz: 'Asia/Kolkata' });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

// ── .ics (RFC 5545) ──
const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
/** Lines longer than 75 bytes are folded (continuation lines start with a space). */
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = '';
  let curBytes = 0;
  for (const ch of line) {
    const b = new TextEncoder().encode(ch).length;
    if (curBytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; curBytes = 0; }
    cur += ch;
    curBytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function buildIcs(invite: InviteData, events: InviteEvent[], link: string, now = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nimantran//Wedding invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(`${invite.partner1} & ${invite.partner2} wedding`)}`];
  for (const ev of events) {
    const w = eventWindow(ev);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${invite.id}-${ev.id}@nimantran`,
      `DTSTAMP:${utcStamp(now)}`,
      ...(w.allDay
        ? [`DTSTART;VALUE=DATE:${ymd(w.date)}`, `DTEND;VALUE=DATE:${nextDay(w.date)}`]
        : [`DTSTART:${utcStamp(w.start)}`, `DTEND:${utcStamp(w.end)}`]),
      `SUMMARY:${escapeText(titleOf(ev, invite))}`,
      `LOCATION:${escapeText(placeOf(ev, invite))}`,
      `DESCRIPTION:${escapeText(detailsOf(ev, link))}`,
      `URL:${link}`,
      // Reminder the day before.
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapeText(`${ev.name} tomorrow`)}`, 'TRIGGER:-P1D', 'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
