import { error, json, parseBody, requireUser } from '@/lib/api-helpers';
import { Payment } from '@/lib/models/Payment';
import { Invite } from '@/lib/models/Invite';
import { toInviteData } from '@/lib/invites';
import { paymentVerifySchema } from '@/lib/validation';
import { checkoutSignatureValid } from '@/lib/payments/razorpay';
import { markPaid } from '@/lib/payments/premium';

// POST /api/payments/verify ← what Razorpay Checkout hands the browser after paying.
// Premium is switched on only if the signature (made with our secret key) matches.
export async function POST(req: Request) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const body = await parseBody(req, paymentVerifySchema);
  if ('response' in body) return body.response;
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body.data;

  const pay = await Payment.findOne({ orderId, user: auth.userId }).lean();
  if (!pay) return error('Payment not found', 404);
  if (!checkoutSignatureValid(orderId, paymentId, signature)) {
    console.warn('[payments] bad checkout signature', orderId);
    return error('We could not confirm this payment. If money was taken, it will be confirmed automatically in a few minutes, or refunded.', 400);
  }
  await markPaid(orderId, paymentId);
  const invite = await Invite.findById(pay.invite).lean();
  return json({ invite: invite ? toInviteData(invite as never) : null });
}
