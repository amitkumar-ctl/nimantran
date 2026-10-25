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
    // Forgot password: sha256 of the emailed one-time token, and when it expires.
    resetTokenHash: { type: String, select: false, index: { sparse: true } },
    resetTokenExpires: { type: Date, select: false },
    // Sessions issued before this moment stop working (set on password reset).
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User: Model<UserDoc> = models.User ?? model<UserDoc>('User', userSchema);
