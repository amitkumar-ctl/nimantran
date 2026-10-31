import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { razorpayConfig } from './config';

/*
 * The three things we need from Razorpay, over its REST API (no SDK):
 *  1. create an order on our server, so the amount can't be changed in the browser
 *  2. check the signature Checkout returns after payment
 *  3. check the signature on webhooks (payment captured, refund processed)
 * Docs: https://razorpay.com/docs/payments/server-integration/
 */

// RAZORPAY_API_BASE exists only so tests can point at a local fake; never set it in production.
const API = process.env.RAZORPAY_API_BASE || 'https://api.razorpay.com/v1';

export type RazorpayOrder = { id: string; amount: number; currency: string; receipt?: string; status: string };

export class RazorpayError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

export async function createOrder(input: { amount: number; receipt: string; notes: Record<string, string> }): Promise<RazorpayOrder> {
  const { keyId, keySecret, problem } = razorpayConfig();
  if (problem) throw new RazorpayError(`Payments are not set up: ${problem}`, 503);
  let res: Response;
  try {
    res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
      body: JSON.stringify({ amount: input.amount, currency: 'INR', receipt: input.receipt, notes: input.notes }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new RazorpayError('Could not reach Razorpay. Please try again in a minute.');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[razorpay] order failed', res.status, body?.error?.description ?? body);
    throw new RazorpayError(res.status === 401 ? 'Payments are not set up correctly (Razorpay keys rejected).' : 'Razorpay could not start the payment. Please try again.');
  }
  return body as RazorpayOrder;
}

const hmac = (secret: string, data: string) => createHmac('sha256', secret).update(data).digest('hex');

/** Constant-time compare of two hex strings. */
function sameHex(a: string, b: string) {
  if (!/^[0-9a-f]+$/i.test(a) || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

/** Checkout's success signature: HMAC-SHA256(order_id + "|" + payment_id, key secret). */
export function checkoutSignatureValid(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = razorpayConfig();
  return !!keySecret && sameHex(signature, hmac(keySecret, `${orderId}|${paymentId}`));
}

/** Webhook signature: HMAC-SHA256(raw body, webhook secret). */
export function webhookSignatureValid(rawBody: string, signature: string) {
  const { webhookSecret } = razorpayConfig();
  return !!webhookSecret && sameHex(signature, hmac(webhookSecret, rawBody));
}
