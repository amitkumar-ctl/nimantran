// Date helpers that give identical output on server and browser (no
// time-zone drift → no hydration mismatches). Dates are stored as the
// venue-local calendar day "YYYY-MM-DD".

const toUTC = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
};

export const formatLongDate = (ymd: string) =>
  ymd ? new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(toUTC(ymd)) : '';

export const formatShortDate = (ymd: string) =>
  ymd ? new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(toUTC(ymd)) : '';

export const formatHeroDate = (ymd: string) =>
  ymd ? new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(toUTC(ymd)).replace(/,/g, ' ·') : '';

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
