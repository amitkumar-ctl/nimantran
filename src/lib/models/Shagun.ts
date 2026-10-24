import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';
import { SHAGUN_METHODS } from '@/lib/validation';

/*
 * One entry in a couple's shagun register. UPI money goes straight from the
 * guest to the couple, so Nimantran never sees payments: entries are either
 * reported by the guest ("I've sent ₹1,100") or recorded by the couple
 * (incl. cash envelopes). The couple confirms what actually arrived.
 */
const shagunSchema = new Schema(
  {
    invite: { type: Schema.Types.ObjectId, ref: 'Invite', required: true, index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    method: { type: String, enum: SHAGUN_METHODS, default: 'upi' },
    note: { type: String, default: '' },
    source: { type: String, enum: ['guest', 'host'], required: true },
    confirmed: { type: Boolean, default: false },
    // The guest's RSVP, when known (same browser, or linked by the couple).
    rsvp: { type: Schema.Types.ObjectId, ref: 'Rsvp', default: null },
    // sha256 of the guest's private edit key, so they can correct their report.
    editTokenHash: { type: String, select: false, index: { sparse: true } },
  },
  { timestamps: true },
);

export type ShagunDoc = InferSchemaType<typeof shagunSchema>;
export const Shagun: Model<ShagunDoc> = models.Shagun ?? model<ShagunDoc>('Shagun', shagunSchema);
