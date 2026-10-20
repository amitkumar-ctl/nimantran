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
  },
  { timestamps: true },
);

export type RsvpDoc = InferSchemaType<typeof rsvpSchema>;
export const Rsvp: Model<RsvpDoc> = models.Rsvp ?? model<RsvpDoc>('Rsvp', rsvpSchema);
