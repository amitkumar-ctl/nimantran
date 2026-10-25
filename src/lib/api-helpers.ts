import 'server-only';
import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import type { z } from 'zod';
import { connectDB } from './db';
import { destroySession, getSession } from './auth/session';
import { issuedBeforePasswordChange } from './auth/token';
import { User } from './models/User';
import { fieldErrors } from './validation';

export const json = <T>(data: T, init?: number | ResponseInit) =>
  NextResponse.json(data, typeof init === 'number' ? { status: init } : init);

export const error = (message: string, status = 400, fields?: Record<string, string>) =>
  NextResponse.json({ message, ...(fields ? { fields } : {}) }, { status });

/** Parse + validate a JSON body. Returns data or a ready-made 400 response. */
export async function parseBody<S extends z.ZodType>(req: Request, schema: S) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { response: error('Invalid JSON body') } as const;
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    return { response: error('Please fix the highlighted fields', 422, fieldErrors(result.error)) } as const;
  }
  return { data: result.data as z.infer<S>, raw: raw as Record<string, unknown> } as const;
}

/** Connect to the DB and require a logged-in user. */
export async function requireUser() {
  const session = await getSession();
  if (!session) return { response: error('Please log in', 401) } as const;
  await connectDB();
  // After a password reset, sessions from before it (e.g. on a lost phone) stop working.
  const user = await User.findById(session.userId, { passwordChangedAt: 1 }).lean();
  if (!user || issuedBeforePasswordChange(session.iat, user.passwordChangedAt)) {
    await destroySession();
    return { response: error('Please log in', 401) } as const;
  }
  return { userId: session.userId } as const;
}

/**
 * Keep only the keys the client actually sent. Zod applies .default() values
 * even inside .partial(), which would silently reset fields on a PATCH.
 */
export function sentKeysOnly<T extends Record<string, unknown>>(data: T, raw: Record<string, unknown>): Partial<T> {
  return Object.fromEntries(Object.entries(data).filter(([k]) => Object.prototype.hasOwnProperty.call(raw, k))) as Partial<T>;
}

export const validId = (id: string) => isValidObjectId(id);
