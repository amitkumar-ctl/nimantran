import { User } from '@/lib/models/User';
import { connectDB } from '@/lib/db';
import { json } from '@/lib/api-helpers';
import { destroySession, getSession } from '@/lib/auth/session';
import { issuedBeforePasswordChange } from '@/lib/auth/token';

// GET /api/auth/me: who is signed in. Being signed out is a normal answer
// ({ user: null }, 200), not an error, so the browser console stays clean
// after logging out or when an old session has expired.
export async function GET() {
  const session = await getSession();
  if (!session) {
    await destroySession(); // drop a stale "logged in" hint cookie, if any
    return json({ user: null });
  }
  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user || issuedBeforePasswordChange(session.iat, user.passwordChangedAt)) {
    await destroySession();
    return json({ user: null });
  }
  return json({ user: { id: user._id.toString(), name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? '' } });
}
