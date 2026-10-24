import type { InviteData, InviteSummary, RsvpData, SessionUser, ShagunData } from './types';
import type { InviteContent, Theme } from './validation';

// Typed browser-side API calls + TanStack Query keys, in one place.

export class ApiError extends Error {
  constructor(message: string, public status: number, public fields?: Record<string, string>) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined' && !url.startsWith('/api/auth/')) {
      // Session expired mid-use: a full reload to login also clears client state.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(body.message ?? 'Something went wrong', res.status, body.fields);
  }
  return body as T;
}

export type ShagunInput = { name: string; amount: number; method: ShagunData['method']; note: string; rsvpId?: string | null; confirmed?: boolean };

export const queryKeys = {
  me: ['me'] as const,
  invites: ['invites'] as const,
  invite: (id: string) => ['invites', id] as const,
  rsvps: (id: string) => ['invites', id, 'rsvps'] as const,
  shagun: (id: string) => ['invites', id, 'shagun'] as const,
};

export const api = {
  signup: (data: { name: string; email: string; password: string }) =>
    request<{ user: SessionUser }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ user: SessionUser }>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  google: (credential: string) =>
    request<{ user: SessionUser }>('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: SessionUser }>('/api/auth/me').then((r) => r.user),

  listInvites: () => request<{ invites: InviteSummary[] }>('/api/invites').then((r) => r.invites),
  createInvite: (data: { partner1: string; partner2: string; weddingDate: string; theme: Theme }) =>
    request<{ invite: InviteData }>('/api/invites', { method: 'POST', body: JSON.stringify(data) }).then((r) => r.invite),
  getInvite: (id: string) => request<{ invite: InviteData }>(`/api/invites/${id}`).then((r) => r.invite),
  updateInvite: (id: string, data: Partial<InviteContent> & { published?: boolean }) =>
    request<{ invite: InviteData }>(`/api/invites/${id}`, { method: 'PATCH', body: JSON.stringify(data) }).then((r) => r.invite),
  deleteInvite: (id: string) => request<{ ok: true }>(`/api/invites/${id}`, { method: 'DELETE' }),
  listRsvps: (id: string) => request<{ rsvps: RsvpData[] }>(`/api/invites/${id}/rsvps`).then((r) => r.rsvps),
  listShagun: (id: string) => request<{ entries: ShagunData[] }>(`/api/invites/${id}/shagun`).then((r) => r.entries),
  addShagun: (id: string, data: ShagunInput) =>
    request<{ entry: ShagunData }>(`/api/invites/${id}/shagun`, { method: 'POST', body: JSON.stringify(data) }).then((r) => r.entry),
  updateShagun: (id: string, entryId: string, data: Partial<ShagunInput> & { confirmed?: boolean }) =>
    request<{ entry: ShagunData }>(`/api/invites/${id}/shagun/${entryId}`, { method: 'PATCH', body: JSON.stringify(data) }).then((r) => r.entry),
  deleteShagun: (id: string, entryId: string) => request<{ ok: true }>(`/api/invites/${id}/shagun/${entryId}`, { method: 'DELETE' }),
};

/** Only allow same-site paths after login ("/dashboard"), never "//evil.com". */
export function safeNext(next: string | null, fallback = '/dashboard') {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : fallback;
}
