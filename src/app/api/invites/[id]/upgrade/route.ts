import { error, json, requireUser, validId } from '@/lib/api-helpers';
import { Invite } from '@/lib/models/Invite';
import { Payment } from '@/lib/models/Payment';
import { User } from '@/lib/models/User';
import { paymentsEnabled, premiumPrice, razorpayConfig } from '@/lib/payments/config';
import { createOrder, RazorpayError } from '@/lib/payments/razorpay';
import { site } from '@/config/site';

// POST /api/invites/:id/upgrade → a Razorpay order for Premium on this invite.
// The amount is set here on the server; the browser only opens Checkout with the order id.
export async function POST(_req: Request, ctx: RouteContext<'/api/invites/[id]/upgrade'>) {
  if (!paymentsEnabled()) return error('Premium is not available yet.', 404);
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const { id } = await ctx.params;
  if (!validId(id)) return error('Invite not found', 404);
  const invite = await Invite.findOne({ _id: id, owner: auth.userId }, { premium: 1, partner1: 1, partner2: 1 }).lean();
  if (!invite) return error('Invite not found', 404);
  if (invite.premium) return error('This invite is already Premium.', 409);

  const amount = premiumPrice();
  try {
    const order = await createOrder({
      amount,
      receipt: `inv_${id}_${Date.now().toString(36)}`.slice(0, 40),
      notes: { invite: id, user: auth.userId, product: 'premium' },
    });
    if (order.amount !== amount) throw new RazorpayError('Razorpay returned a different amount.');
    await Payment.create({ user: auth.userId, invite: invite._id, orderId: order.id, amount });
    const user = await User.findById(auth.userId, { name: 1, email: 1 }).lean();
    return json({
      keyId: razorpayConfig().keyId,
      orderId: order.id,
      amount,
      currency: 'INR',
      name: site.name,
      description: `Premium for ${invite.partner1} & ${invite.partner2}`,
      prefill: { name: user?.name ?? '', email: user?.email ?? '' },
    }, 201);
  } catch (e) {
    if (e instanceof RazorpayError) return error(e.message, e.status);
    throw e;
  }
}
