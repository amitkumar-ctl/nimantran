// Date helpers that give identical output on server and browser (no
// time-zone drift → no hydration mismatches). Dates are stored as the
// venue-local calendar day "YYYY-MM-DD".

// Built by hand rather than with Intl: Node and browsers ship different
// locale data (e.g. "Thursday, 10 December 2026" vs "Thursday 10 December,
// 2026", "Sep" vs "Sept"), and any difference breaks hydration.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parts(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return { day: date.getUTCDate(), month: MONTHS[date.getUTCMonth()], year: date.getUTCFullYear(), weekday: DAYS[date.getUTCDay()] };
}

/** "2026-12-10" → "Thursday, 10 December 2026" */
export function formatLongDate(ymd: string) {
  if (!ymd) return '';
  const p = parts(ymd);
  return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
}

/** "2026-12-10" → "Thu, 10 Dec" */
export function formatShortDate(ymd: string) {
  if (!ymd) return '';
  const p = parts(ymd);
  return `${p.weekday.slice(0, 3)}, ${p.day} ${p.month.slice(0, 3)}`;
}

/** "2026-12-10" → "Thu · 10 Dec · 2026" */
export function formatHeroDate(ymd: string) {
  if (!ymd) return '';
  const p = parts(ymd);
  return `${p.weekday.slice(0, 3)} · ${String(p.day).padStart(2, '0')} ${p.month.slice(0, 3)} · ${p.year}`;
}

/** "18:30" → "6:30 PM" */
export function formatTime(hhmm: string) {
  if (!/^\d{2}:\d{2}$/.test(hhmm)) return hhmm;
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Wedding moment in India time (IST, UTC+5:30) as epoch ms. */
export function weddingTimestamp(ymd: string, hhmm = '18:00') {
  if (!ymd) return 0;
  return Date.parse(`${ymd}T${/^\d{2}:\d{2}$/.test(hhmm) ? hhmm : '18:00'}:00+05:30`);
}

export const mapsSearchUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export function upiLink(upiId: string, payee: string, note: string) {
  const p = new URLSearchParams({ pa: upiId, pn: payee, cu: 'INR', tn: note });
  return `upi://pay?${p.toString()}`;
}
