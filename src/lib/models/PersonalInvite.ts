import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

/*
 * A family the couple is inviting personally. Their link (/i/<slug>?to=Name)
 * greets them by name, and they get a card with their name on it.
 */
const personalInviteSchema = new Schema(
  {
    invite: { type: Schema.Types.ObjectId, ref: 'Invite', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type PersonalInviteDoc = InferSchemaType<typeof personalInviteSchema>;
export const PersonalInvite: Model<PersonalInviteDoc> = models.PersonalInvite ?? model<PersonalInviteDoc>('PersonalInvite', personalInviteSchema);
