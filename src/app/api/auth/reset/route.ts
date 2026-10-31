import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createSession } from '@/lib/auth/session';
import { error, json, parseBody } from '@/lib/api-helpers';
import { resetSchema } from '@/lib/validation';
import { hashKey, makeLimiter } from '@/lib/guest-keys';

const byIp = makeLimiter(10, 15 * 60_000);

// POST /api/auth/reset: set a new password with the emailed token, then sign in.
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (byIp(ip)) return error('Too many attempts. Please wait a few minutes and try again.', 429);
  const body = await parseBody(req, resetSchema);
  if ('response' in body) return body.response;
  const { token, password } = body.data;

  await connectDB();
  const user = await User.findOne({ resetTokenHash: hashKey(token), resetTokenExpires: { $gt: new Date() } }).select('+resetTokenHash');
  if (!user) return error('This reset link has expired or was already used. Please ask for a new one.', 400, { token: 'expired' });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordChangedAt = new Date(); // signs out every other device
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  await createSession(user._id.toString());
  return json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
}
