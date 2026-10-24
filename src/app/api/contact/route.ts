import { createHash } from 'node:crypto';
import { error, json, parseBody } from '@/lib/api-helpers';
import { contactSchema } from '@/lib/validation';
import { CONTACT_TOPIC_LABELS } from '@/lib/contact';
import { contactRecipients, emailConfigured, escapeHtml, sendEmail } from '@/lib/email';
import { makeLimiter } from '@/lib/guest-keys';
import { getSession } from '@/lib/auth/session';
import { site } from '@/config/site';

// A few messages per sender per 15 minutes is plenty for real people.
const byIp = makeLimiter(5, 15 * 60_000);
const byEmail = makeLimiter(3, 15 * 60_000);

// POST /api/contact: the Help & contact form → an email to the team (via Resend)
export async function POST(req: Request) {
  const body = await parseBody(req, contactSchema);
  if ('response' in body) return body.response;
  const m = body.data;

  // Bots fill the hidden field or submit instantly; pretend it worked.
  if (m.website || (m.startedAt && Date.now() - m.startedAt < 2500)) return json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (byIp(ip) || byEmail(m.email)) return error('Too many messages. Please wait a few minutes and try again.', 429);

  const session = await getSession();
  const topic = CONTACT_TOPIC_LABELS[m.topic];
  const subject = `[${site.name}] ${topic}: ${m.name}`;
  const rows: [string, string][] = [
    ['Name', m.name], ['Email', m.email], ['Topic', topic],
    ...(m.inviteLink ? [['Invite', m.inviteLink] as [string, string]] : []),
    ['Logged in', session ? `yes (user ${session.userId})` : 'no'],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${m.message}\n\nReply to this email to answer ${m.name}.`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#2b1d14">
<table style="border-collapse:collapse;margin-bottom:16px">${rows.map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#7d6a58">${k}</td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>
<div style="white-space:pre-wrap;border-left:3px solid #c9a24b;padding:8px 14px;background:#fbf5ea">${escapeHtml(m.message)}</div>
<p style="color:#7d6a58;font-size:13px">Reply to this email to answer ${escapeHtml(m.name)} directly.</p></div>`;

  if (!emailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] Email not configured; message would be sent:\n' + text);
      return json({ ok: true, dev: true });
    }
    console.error('[contact] RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL missing');
    return error(`Our contact form is down right now. Please email us at ${site.supportEmail}.`, 503);
  }

  const sent = await sendEmail({
    to: contactRecipients(), subject, text, html, replyTo: m.email,
    // The same message submitted twice (double tap, retry) is only emailed once.
    idempotencyKey: createHash('sha256').update(`${m.email}|${m.message}`).digest('hex').slice(0, 64),
  });
  if (!sent.ok) {
    console.error('[contact]', sent.error);
    return error(`We couldn't send your message. Please try again, or email us at ${site.supportEmail}.`, 502);
  }
  return json({ ok: true });
}
