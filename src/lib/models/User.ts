import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Absent for accounts created with Google (they have no password).
    passwordHash: { type: String, select: false },
    // Google account id ("sub"); sparse so many users can have none.
    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User: Model<UserDoc> = models.User ?? model<UserDoc>('User', userSchema);
