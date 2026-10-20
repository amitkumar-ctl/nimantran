import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const rsvpSchema = new Schema(
  {
    invite: { type: Schema.Types.ObjectId, ref: 'Invite', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    attending: { type: Boolean, required: true },
    guests: { type: Number, default: 1 },
    events: { type: [String], default: [] },
    dietary: { type: String, default: '' },
    message: { type: String, default: '' },
    // sha256 of the guest's private edit key (the key itself lives only in
    // the guest's browser cookie), so they can update instead of re-submitting.
    editTokenHash: { type: String, select: false, index: { sparse: true } },
  },
  { timestamps: true },
);

export type RsvpDoc = InferSchemaType<typeof rsvpSchema>;
export const Rsvp: Model<RsvpDoc> = models.Rsvp ?? model<RsvpDoc>('Rsvp', rsvpSchema);
