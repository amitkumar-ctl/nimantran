import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createSession } from '@/lib/auth/session';
import { error, json, parseBody } from '@/lib/api-helpers';
import { signupSchema } from '@/lib/validation';

export async function POST(req: Request) {
  const body = await parseBody(req, signupSchema);
  if ('response' in body) return body.response;
  const { name, email, password } = body.data;

  await connectDB();
  const existing = await User.findOne({ email }, { googleId: 1 }).lean();
  if (existing) {
    return existing.googleId
      ? error('This email is registered with Google', 409, { email: 'Registered with Google. Use “Continue with Google”.' })
      : error('An account with this email already exists', 409, { email: 'Already registered. Log in instead.' });
  }
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  await createSession(user._id.toString());
  return json({ user: { id: user._id.toString(), name: user.name, email: user.email } }, 201);
}
