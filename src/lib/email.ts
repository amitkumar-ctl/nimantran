import 'server-only';


/*
 * Transactional email through Resend (https://resend.com), called over its
 * HTTP API so no SDK is needed.
 *
 * Env:
 *   RESEND_API_KEY      re_… key from resend.com/api-keys
 *   CONTACT_FROM_EMAIL  sender on a domain verified in Resend,
 *                       e.g. "Nimantran <hello@getnimantran.com>"
 *   CONTACT_TO_EMAIL    where contact-form messages arrive (comma-separated for several)
 */

export type Email = { to: string[]; subject: string; html: string; text: string; replyTo?: string; idempotencyKey?: string };

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL);

export const contactRecipients = () => (process.env.CONTACT_TO_EMAIL ?? '').split(',').map((s) => s.trim()).filter(Boolean);

export async function sendEmail(mail: Email): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return { ok: false, error: 'Email is not configured (RESEND_API_KEY / CONTACT_FROM_EMAIL).' };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(mail.idempotencyKey ? { 'Idempotency-Key': mail.idempotencyKey } : {}),
      },
      body: JSON.stringify({ from, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text, ...(mail.replyTo ? { reply_to: mail.replyTo } : {}) }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${body.message ?? body.name ?? 'request failed'}` };
    return { ok: true, id: body.id };
  } catch (e) {
    return { ok: false, error: `Resend request failed: ${(e as Error).message}` };
  }
}

/** Escape user text for an HTML email. */
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
