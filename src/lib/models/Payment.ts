import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

/*
 * One Razorpay order for upgrading one invite to Premium. Created when the
 * couple taps "Upgrade", marked paid after the signature (or webhook) checks
 * out, marked refunded when Razorpay reports a refund.
 */
const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    invite: { type: Schema.Types.ObjectId, ref: 'Invite', required: true, index: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: '' },
    amount: { type: Number, required: true }, // paise
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'refunded'], default: 'created' },
    method: { type: String, default: '' },
    paidAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
    refundedAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type PaymentDoc = InferSchemaType<typeof paymentSchema>;
export const Payment: Model<PaymentDoc> = models.Payment ?? model<PaymentDoc>('Payment', paymentSchema);
