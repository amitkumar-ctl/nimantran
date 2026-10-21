import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';
import { DEFAULT_THEME, isTheme } from '@/lib/themes';

const eventSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    emoji: { type: String, default: '✨' },
    date: { type: String, required: true }, // YYYY-MM-DD (venue-local date)
    time: { type: String, default: '' },
    venue: { type: String, default: '' },
    mapUrl: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { _id: false },
);

const inviteSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: false },
    theme: { type: String, default: DEFAULT_THEME, validate: { validator: isTheme, message: 'Unknown design' } },
    partner1: { type: String, required: true },
    partner2: { type: String, required: true },
    blessing: { type: String, default: '॥ शुभ विवाह ॥' },
    message: { type: String, default: '' },
    weddingDate: { type: String, required: true },
    weddingTime: { type: String, default: '18:00' },
    city: { type: String, default: '' },
    venue: { type: String, default: '' },
    events: { type: [eventSchema], default: [] },
    rsvpDeadline: { type: String, default: '' },
    upiId: { type: String, default: '' },
    upiName: { type: String, default: '' },
  },
  { timestamps: true },
);

export type InviteDoc = InferSchemaType<typeof inviteSchema>;
export const Invite: Model<InviteDoc> = models.Invite ?? model<InviteDoc>('Invite', inviteSchema);
