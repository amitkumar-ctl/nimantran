import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { error, json, parseBody } from '@/lib/api-helpers';
import { forgotSchema } from '@/lib/validation';
import { hashKey, makeLimiter, newKey } from '@/lib/guest-keys';
import { canSendEmail, sendEmail } from '@/lib/email';
import { resetPasswordEmail } from '@/lib/emails/reset-password';
import { absoluteUrl } from '@/config/site';

const RESET_TTL_MS = 60 * 60_000; // 1 hour
const byIp = makeLimiter(8, 15 * 60_000);
const byEmail = makeLimiter(3, 60 * 60_000);

// POST /api/auth/forgot: email a one-time reset link.
// Always answers the same way, so nobody can find out which emails have accounts.
export async function POST(req: Request) {
  const body = await parseBody(req, forgotSchema);
  if ('response' in body) return body.response;
  const { email } = body.data;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (byIp(ip)) return error('Too many requests. Please wait a few minutes and try again.', 429);
  const done = json({ ok: true });
  if (byEmail(email)) return done; // quietly: don't flood someone's inbox

  await connectDB();
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) return done;

  const token = newKey();
  user.resetTokenHash = hashKey(token);
  user.resetTokenExpires = new Date(Date.now() + RESET_TTL_MS);
  await user.save();

  const link = absoluteUrl(`/reset-password?token=${token}`);
  const mail = resetPasswordEmail({ name: user.name, link, googleOnly: !user.passwordHash && !!user.googleId });

  if (!canSendEmail()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[forgot] Email not configured. Reset link for ${email}:\n${link}`);
      return done;
    }
    console.error('[forgot] RESEND_API_KEY / CONTACT_FROM_EMAIL missing; reset email not sent');
    return done;
  }
  const sent = await sendEmail({ to: [user.email], ...mail });
  if (!sent.ok) console.error('[forgot]', sent.error);
  return done;
}
