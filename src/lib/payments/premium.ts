import 'server-only';
import { revalidateTag } from 'next/cache';
import { Invite } from '@/lib/models/Invite';
import { Payment } from '@/lib/models/Payment';
import { inviteTag } from '@/lib/invites';

async function refreshPublic(inviteId: unknown) {
  const inv = await Invite.findById(inviteId, { slug: 1, customSlug: 1 }).lean();
  if (!inv) return;
  revalidateTag(inviteTag(inv.slug), { expire: 0 });
  if (inv.customSlug) revalidateTag(inviteTag(inv.customSlug), { expire: 0 });
}

/**
 * Mark an order paid and make its invite Premium. Safe to call twice (the
 * browser and the webhook usually both report the same payment).
 */
export async function markPaid(orderId: string, paymentId: string, method = '') {
  const pay = await Payment.findOneAndUpdate(
    { orderId, status: 'created' },
    { $set: { status: 'paid', paymentId, method, paidAt: new Date() } },
    { returnDocument: 'after' },
  );
  if (!pay) return Payment.findOne({ orderId }); // already paid (or refunded): nothing to do
  await Invite.updateOne({ _id: pay.invite }, { $set: { premium: true, premiumAt: new Date() } });
  await refreshPublic(pay.invite);
  return pay;
}

/**
 * Razorpay reported a refund. A full refund takes Premium away (the custom
 * link keeps redirecting so guests aren't stranded; it just isn't shared any more).
 */
export async function markRefunded(paymentId: string, refundedAmount: number) {
  const pay = await Payment.findOne({ paymentId, status: 'paid' });
  if (!pay) return null;
  pay.refundedAmount = Math.max(pay.refundedAmount ?? 0, refundedAmount);
  if (pay.refundedAmount < pay.amount) {
    await pay.save(); // partial refund: Premium stays
    return pay;
  }
  pay.status = 'refunded';
  pay.refundedAt = new Date();
  await pay.save();
  const stillPaid = await Payment.exists({ invite: pay.invite, status: 'paid' });
  if (!stillPaid) {
    await Invite.updateOne({ _id: pay.invite }, { $set: { premium: false } });
    await refreshPublic(pay.invite);
  }
  return pay;
}
