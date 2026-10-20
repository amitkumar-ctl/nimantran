import { z } from 'zod';
import { TEMPLATE_IDS, type Theme } from './themes';

// Shared by the API (server-side validation) and the forms (client-side).

export const THEMES = TEMPLATE_IDS;
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
  theme: z.enum(THEMES).default('royal'),
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

export const signupSchema = z.object({
  name: trimmed(60).min(2, 'Enter your name'),
  email: z.email('Enter a valid email').trim().toLowerCase(),
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
