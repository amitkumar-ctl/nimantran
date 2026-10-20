import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createSession } from '@/lib/auth/session';
import { verifyGoogleIdToken } from '@/lib/auth/google';
import { error, json, parseBody } from '@/lib/api-helpers';

const bodySchema = z.object({ credential: z.string().min(20).max(5000) });

// POST /api/auth/google  { credential: <Google ID token> }
// Signs in, creates the account on first use, or links Google to an existing
// email/password account with the same (Google-verified) email.
export async function POST(req: Request) {
  const body = await parseBody(req, bodySchema);
  if ('response' in body) return body.response;

  let profile;
  try {
    profile = await verifyGoogleIdToken(body.data.credential);
  } catch (err) {
    console.error('Google token verification failed:', err instanceof Error ? err.message : err);
    return error('Google sign-in failed. Please try again.', 401);
  }
  if (!profile.sub || !profile.email || !profile.emailVerified) {
    return error('Your Google account email is not verified', 401);
  }

  try {
    return await signInWithGoogle(profile);
  } catch (err) {
    // Shows the real cause in Vercel → Logs (e.g. MongoDB network access, AUTH_SECRET).
    console.error('Google sign-in error:', err instanceof Error ? err.message : err);
    return error('Sign-in failed on our side. Please try again in a minute.', 500);
  }
}

async function signInWithGoogle(profile: Awaited<ReturnType<typeof verifyGoogleIdToken>>) {
  await connectDB();
  let user = await User.findOne({ googleId: profile.sub });
  if (!user) {
    user = await User.findOne({ email: profile.email });
    if (user) {
      // Same email, verified by Google → safe to link.
      user.googleId = profile.sub;
      if (!user.avatarUrl && profile.picture) user.avatarUrl = profile.picture;
      await user.save();
    } else {
      user = await User.create({
        name: (profile.name || profile.email.split('@')[0]).slice(0, 60),
        email: profile.email,
        googleId: profile.sub,
        avatarUrl: profile.picture,
      });
    }
  }

  await createSession(user._id.toString());
  return json({ user: { id: user._id.toString(), name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? '' } });
}
