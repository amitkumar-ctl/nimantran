import 'server-only';


/*
 * Transactional email through Resend (https://resend.com), called over its
 * HTTP API so no SDK is needed.
 *
 * Env:
 *   RESEND_API_KEY      re_… key from resend.com/api-keys
 *   CONTACT_FROM_EMAIL  sender for all emails (contact form, password reset), on a domain verified in Resend,
 *                       e.g. "Nimantran <hello@getnimantran.com>"
 *   CONTACT_TO_EMAIL    where contact-form messages arrive (comma-separated for several)
 */

const FREE_MAIL = /@(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|icloud|me|rediffmail|proton|protonmail|aol|zoho)\.[a-z.]+>?$/i;

/**
 * Problems with the email settings that Resend would reject anyway, in
 * plain words for the server log (or null if they look fine).
 */
export function emailConfigProblem(): string | null {
  const from = process.env.CONTACT_FROM_EMAIL?.trim() ?? '';
  if (!process.env.RESEND_API_KEY) return 'RESEND_API_KEY is not set.';
  if (!process.env.RESEND_API_KEY.startsWith('re_')) return 'RESEND_API_KEY does not look like a Resend key (it should start with "re_").';
  if (!from) return 'CONTACT_FROM_EMAIL is not set.';
  if (!/^([^<>]+<)?[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>?$/.test(from)) return `CONTACT_FROM_EMAIL "${from}" is not a valid address. Use "Nimantran <hello@yourdomain.com>".`;
  if (FREE_MAIL.test(from)) return `CONTACT_FROM_EMAIL "${from}" is a personal mailbox. Resend can only send from a domain you have verified (e.g. hello@getnimantran.com). Put your Gmail in CONTACT_TO_EMAIL instead.`;
  return null;
}

/** What to do about a Resend error, for the server log. */
export function explainResendError(status: number, name: string, message: string): string {
  const m = `${name} ${message}`.toLowerCase();
  if (status === 401 || (status === 403 && m.includes('api key'))) return 'The API key is wrong or was deleted: create a new one at resend.com/api-keys and update RESEND_API_KEY, then redeploy.';
  if (m.includes('not verified') || m.includes('verify a domain')) return 'The sender domain is not verified: open resend.com/domains, add the DNS records it shows at your domain registrar, wait until it says "Verified", and make sure CONTACT_FROM_EMAIL uses exactly that domain.';
  if (m.includes('testing emails') || m.includes('own email')) return 'Your Resend account can only email its own address until you verify a domain (resend.com/domains). Either verify your domain or set CONTACT_TO_EMAIL to the email you signed up to Resend with.';
  if (m.includes('restricted') || m.includes('permission')) return 'The API key is limited to another domain or to read-only: create a key with "Sending access" for your domain.';
  if (status === 409) return 'Duplicate request (idempotency): the same message was sent twice quickly. Safe to ignore.';
  if (status === 429) return 'Resend rate limit or daily quota reached.';
  return 'See the Resend dashboard → Logs for details.';
}

export type Email = { to: string[]; subject: string; html: string; text: string; replyTo?: string; idempotencyKey?: string };

/** Can we send email at all (API key + sender)? */
export const canSendEmail = () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
/** …and is there an inbox for contact-form messages? */
export const emailConfigured = () => canSendEmail() && contactRecipients().length > 0;

export const contactRecipients = () => (process.env.CONTACT_TO_EMAIL ?? '').split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);

export async function sendEmail(mail: Email): Promise<{ ok: true; id?: string } | { ok: false; error: string; code?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const problem = emailConfigProblem();
  if (problem || !key || !from) return { ok: false, error: `Email settings: ${problem ?? 'missing'}`, code: 'config' };

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
    if (!res.ok) {
      const name = body.name ?? 'error', message = (body.message ?? 'request failed').replace(/\.\s*$/, '');
      return { ok: false, error: `Resend ${res.status} ${name}: ${message}. Fix: ${explainResendError(res.status, name, message)}`, code: name };
    }
    return { ok: true, id: body.id };
  } catch (e) {
    return { ok: false, error: `Resend request failed: ${(e as Error).message}` };
  }
}

/** Escape user text for an HTML email. */
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
