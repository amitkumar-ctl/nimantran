import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createSession } from '@/lib/auth/session';
import { error, json, parseBody } from '@/lib/api-helpers';
import { loginSchema } from '@/lib/validation';

// Compared against when the email doesn't exist, so response time doesn't
// reveal which emails are registered.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash('not-a-real-password', 12));

export async function POST(req: Request) {
  const body = await parseBody(req, loginSchema);
  if ('response' in body) return body.response;
  const { email, password } = body.data;

  await connectDB();
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = await bcrypt.compare(password, user?.passwordHash ?? (await getDummyHash()));
  if (user && !user.passwordHash && user.googleId) {
    return error('This account uses Google. Please continue with Google.', 401);
  }
  if (!user || !ok) return error('Incorrect email or password', 401);

  await createSession(user._id.toString());
  return json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
}
