import { connectDB } from '@/lib/db';
import { json } from '@/lib/api-helpers';
import { webhookSignatureValid } from '@/lib/payments/razorpay';
import { markPaid, markRefunded } from '@/lib/payments/premium';

/*
 * POST /api/payments/webhook ← Razorpay (Dashboard → Webhooks).
 * Subscribe to: payment.captured, order.paid, refund.processed.
 * This is the backup for couples who close the tab mid-payment, and how refunds
 * made in the Razorpay dashboard reach us. Signed with RAZORPAY_WEBHOOK_SECRET.
 */

type Entity = { id?: string; order_id?: string; method?: string; amount?: number; amount_refunded?: number; payment_id?: string };
type Event = { event?: string; payload?: { payment?: { entity?: Entity }; refund?: { entity?: Entity }; order?: { entity?: Entity } } };

export async function POST(req: Request) {
  const raw = await req.text(); // the signature covers the exact bytes
  if (!webhookSignatureValid(raw, req.headers.get('x-razorpay-signature') ?? '')) {
    return json({ message: 'Bad signature' }, 400);
  }
  let evt: Event;
  try {
    evt = JSON.parse(raw);
  } catch {
    return json({ message: 'Bad JSON' }, 400);
  }
  await connectDB();
  const payment = evt.payload?.payment?.entity;
  switch (evt.event) {
    case 'payment.captured':
    case 'order.paid':
      if (payment?.order_id && payment.id) await markPaid(payment.order_id, payment.id, payment.method ?? '');
      break;
    case 'refund.processed':
    case 'payment.refunded': {
      const paymentId = payment?.id ?? evt.payload?.refund?.entity?.payment_id;
      if (paymentId) await markRefunded(paymentId, payment?.amount_refunded ?? evt.payload?.refund?.entity?.amount ?? 0);
      break;
    }
  }
  // Always 200 for events we don't handle, or Razorpay keeps retrying.
  return json({ ok: true });
}
