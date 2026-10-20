import { User } from '@/lib/models/User';
import { error, json, requireUser } from '@/lib/api-helpers';

export async function GET() {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const user = await User.findById(auth.userId).lean();
  if (!user) return error('Please log in', 401);
  return json({ user: { id: user._id.toString(), name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? '' } });
}
