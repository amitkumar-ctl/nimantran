import { site } from '@/config/site';
import { escapeHtml } from '../email';

/** The "reset your password" email (HTML + plain text). */
export function resetPasswordEmail({ name, link, googleOnly }: { name: string; link: string; googleOnly: boolean }) {
  const first = name.split(/\s+/)[0] || 'there';
  const lead = googleOnly
    ? `You usually sign in to ${site.name} with Google, so you can keep using “Continue with Google”. If you’d also like a password, set one with the button below.`
    : `We got a request to reset the password for your ${site.name} account. Choose a new one with the button below.`;
  const subject = googleOnly ? `Set a password for ${site.name}` : `Reset your ${site.name} password`;
  const button = googleOnly ? 'Set a password' : 'Choose a new password';
  const text = `Hi ${first},\n\n${lead}\n\n${link}\n\nThis link works once and expires in 1 hour. If you didn’t ask for this, ignore this email: your password won’t change.\n\n— ${site.name}`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbf5ea;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2b1d14">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf5ea;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #eadcc3;border-radius:16px;overflow:hidden">
<tr><td style="background:#6b0f1a;padding:20px 28px"><img src="${site.url}/brand/nimantran-mark-512.png" width="36" height="36" alt="" style="vertical-align:middle;border-radius:8px"> <span style="font-family:Georgia,serif;font-size:22px;color:#fbf5ea;vertical-align:middle;margin-left:8px">${site.name}</span></td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 12px;font-size:16px">Hi ${escapeHtml(first)},</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6">${escapeHtml(lead)}</p>
<p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;background:#6b0f1a;color:#ffffff;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:10px">${button}</a></p>
<p style="margin:0 0 8px;font-size:13px;color:#7d6a58">This link works once and expires in 1 hour. If you didn’t ask for this, ignore this email: your password won’t change.</p>
<p style="margin:0;font-size:12px;color:#7d6a58;word-break:break-all">Button not working? Paste this into your browser:<br>${link}</p>
</td></tr></table>
<p style="font-size:12px;color:#7d6a58;margin:16px 0 0">${site.name} · Wedding invitations with guest replies</p>
</td></tr></table></body></html>`;
  return { subject, text, html };
}
