import type { InviteContent } from './validation';

// Plain, serialisable shapes shared by server and client (no Mongoose types).

export type InviteData = InviteContent & {
  id: string;
  slug: string;
  published: boolean;
  updatedAt: string;
};

export type InviteSummary = Pick<InviteData, 'id' | 'slug' | 'published' | 'partner1' | 'partner2' | 'weddingDate' | 'theme' | 'updatedAt' | 'rsvpEnabled'> & {
  rsvpCount: number;
};

export type RsvpData = {
  id: string;
  name: string;
  phone: string;
  attending: boolean;
  guests: number;
  events: string[];
  dietary: string;
  message: string;
  createdAt: string;
};

/** A family invited personally (their link and card carry their name). */
export type PersonalInviteData = { id: string; name: string; phone: string; sent: boolean; createdAt: string };

export type SessionUser = { id: string; name: string; email: string; avatarUrl?: string };

export type ShagunData = {
  id: string;
  name: string;
  amount: number;
  method: 'upi' | 'cash' | 'gift' | 'other';
  note: string;
  source: 'guest' | 'host';
  confirmed: boolean;
  rsvpId: string | null;
  createdAt: string;
};
