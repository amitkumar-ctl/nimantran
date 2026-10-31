import { z } from 'zod';
import { DEFAULT_THEME, isTheme, type Theme } from './themes';

// Shared by the API (server-side validation) and the forms (client-side).

export type { Theme };

const trimmed = (max: number) => z.string().trim().max(max);

export const eventSchema = z.object({
  id: z.string().min(1).max(40),
  name: trimmed(40).min(1, 'Event name is required'),
  emoji: trimmed(8).default('✨'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
  time: trimmed(20).default(''),
  venue: trimmed(120).default(''),
  mapUrl: z.union([z.literal(''), z.url().max(500)]).default(''),
  note: trimmed(160).default(''),
});

export const inviteContentSchema = z.object({
  theme: z.string().max(60).refine(isTheme, 'Pick a design').default(DEFAULT_THEME),
  partner1: trimmed(40).min(1, 'Name is required'),
  partner2: trimmed(40).min(1, 'Name is required'),
  blessing: trimmed(60).default('॥ शुभ विवाह ॥'),
  message: trimmed(300).default(''),
  weddingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick the wedding date'),
  weddingTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default('18:00'),
  city: trimmed(60).default(''),
  venue: trimmed(120).default(''),
  events: z.array(eventSchema).max(10).default([]),
  rsvpDeadline: z.union([z.literal(''), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).default(''),
  upiId: z.union([z.literal(''), z.string().trim().regex(/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/, 'Enter a valid UPI ID (name@bank)')]).default(''),
  upiName: trimmed(60).default(''),
  /** Show the reply (RSVP) form. Off = an invitation card only. */
  rsvpEnabled: z.boolean().default(true),
});

export const createInviteSchema = inviteContentSchema.pick({ partner1: true, partner2: true, weddingDate: true, theme: true });
export const updateInviteSchema = inviteContentSchema.partial().extend({ published: z.boolean().optional() });

export type InviteEvent = z.infer<typeof eventSchema>;
export type InviteContent = z.infer<typeof inviteContentSchema>;

export const rsvpSchema = z.object({
  name: trimmed(80).min(2, 'Please enter your name'),
  phone: z.union([z.literal(''), z.string().trim().regex(/^[+\d][\d\s-]{6,18}$/, 'Enter a valid phone number')]).default(''),
  attending: z.boolean(),
  guests: z.number().int().min(1).max(20).default(1),
  events: z.array(z.string().max(40)).max(10).default([]),
  dietary: trimmed(200).default(''),
  message: trimmed(500).default(''),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(500).optional().default(''),
});
export type RsvpInput = z.infer<typeof rsvpSchema>;

// ── Shagun ──
const rupees = z.coerce.number({ error: 'Enter the amount in ₹' }).int('Whole rupees only').min(1, 'Enter the amount in ₹').max(10_00_000, 'That seems too large');
export const SHAGUN_METHODS = ['upi', 'cash', 'gift', 'other'] as const;
export type ShagunMethod = (typeof SHAGUN_METHODS)[number];

/** A guest telling the couple "I've sent shagun" (from the invite page). */
export const shagunReportSchema = z.object({
  name: trimmed(80).min(2, 'Please enter your name'),
  amount: rupees,
  message: trimmed(200).default(''),
  website: z.string().max(500).optional().default(''), // honeypot
});
export type ShagunReport = z.infer<typeof shagunReportSchema>;

/** The couple recording or correcting an entry in their shagun register. */
export const shagunEntrySchema = z.object({
  name: trimmed(80).min(1, 'Enter a name'),
  amount: rupees,
  method: z.enum(SHAGUN_METHODS).default('upi'),
  note: trimmed(200).default(''),
  rsvpId: z.string().max(40).nullable().optional(),
  confirmed: z.boolean().optional(),
});
export const shagunUpdateSchema = shagunEntrySchema.partial();

export const signupSchema = z.object({
  name: trimmed(60).min(2, 'Enter your name'),
  email: z.email('Enter a valid email').trim().toLowerCase(),
  password: z.string().min(8, 'At least 8 characters').max(100),
});
export const forgotSchema = z.object({ email: z.email('Enter a valid email').trim().toLowerCase() });
export const resetSchema = z.object({
  token: z.string().min(20, 'This reset link is incomplete').max(200),
  password: z.string().min(8, 'At least 8 characters').max(100),
});
export const loginSchema = z.object({
  email: z.email('Enter a valid email').trim().toLowerCase(),
  password: z.string().min(1, 'Enter your password').max(100),
});

/** First error message per field, for showing next to inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/* ------------------------------ contact ------------------------------ */

import { CONTACT_TOPICS } from './contact';
export { CONTACT_TOPICS, CONTACT_TOPIC_LABELS } from './contact';
export const contactSchema = z.object({
  name: trimmed(80).min(2, 'Enter your name'),
  email: z.email('Enter a valid email').trim().toLowerCase().max(120),
  topic: z.enum(CONTACT_TOPICS).default('help'),
  message: z.string().trim().min(10, 'Tell us a little more (10+ characters)').max(3000, 'Please keep it under 3,000 characters'),
  inviteLink: trimmed(200).default(''),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(200).default(''),
  /** When the form was shown (ms since epoch), to catch instant bot submits. */
  startedAt: z.number().int().nonnegative().default(0),
});
export type ContactInput = z.infer<typeof contactSchema>;

/* --------------------------- personal invites --------------------------- */

const familyPhone = z.union([z.literal(''), z.string().trim().regex(/^[+\d][\d\s-]{6,18}$/, 'Enter a valid phone number')]).default('');
export const personalEntrySchema = z.object({ name: trimmed(40).min(2, 'Enter a name'), phone: familyPhone });
export const personalAddSchema = z.object({ entries: z.array(personalEntrySchema).min(1).max(200) });
export const personalUpdateSchema = z.object({ name: trimmed(40).min(2, 'Enter a name').optional(), phone: familyPhone.optional(), sent: z.boolean().optional() });
export type PersonalEntry = z.infer<typeof personalEntrySchema>;

// ---- Payments (Premium) ----
const rzpId = (prefix: string) => z.string().trim().regex(new RegExp(`^${prefix}_[A-Za-z0-9]{6,40}$`), 'Invalid payment reference');
export const paymentVerifySchema = z.object({
  razorpay_order_id: rzpId('order'),
  razorpay_payment_id: rzpId('pay'),
  razorpay_signature: z.string().trim().regex(/^[0-9a-f]{64}$/i, 'Invalid payment signature'),
});
export const customLinkSchema = z.object({ customSlug: z.string().trim().toLowerCase().max(60) });
