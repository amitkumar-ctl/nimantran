import { create } from 'zustand';
import type { InviteData } from '@/lib/types';
import type { InviteEvent } from '@/lib/validation';

// Draft state for the invite editor. Every keystroke updates the draft and
// the live preview re-renders from it; the server copy (TanStack Query) only
// changes when the couple presses Save.

type EditorState = {
  draft: InviteData | null;
  dirty: boolean;
  load: (invite: InviteData) => void;
  update: (patch: Partial<InviteData>) => void;
  updateEvent: (id: string, patch: Partial<InviteEvent>) => void;
  addEvent: (event: Omit<InviteEvent, 'id'>) => void;
  removeEvent: (id: string) => void;
  moveEvent: (id: string, dir: -1 | 1) => void;
  markSaved: (invite: InviteData) => void;
  /** Server-side changes (Premium, custom link) merged in without touching unsaved edits. */
  patchSaved: (patch: Partial<InviteData>) => void;
};

const newId = () => Math.random().toString(36).slice(2, 10);

export const useEditorStore = create<EditorState>((set) => ({
  draft: null,
  dirty: false,
  load: (invite) => set({ draft: invite, dirty: false }),
  update: (patch) => set((s) => (s.draft ? { draft: { ...s.draft, ...patch }, dirty: true } : s)),
  updateEvent: (id, patch) =>
    set((s) =>
      s.draft ? { draft: { ...s.draft, events: s.draft.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) }, dirty: true } : s,
    ),
  addEvent: (event) =>
    set((s) => (s.draft ? { draft: { ...s.draft, events: [...s.draft.events, { ...event, id: newId() }] }, dirty: true } : s)),
  removeEvent: (id) =>
    set((s) => (s.draft ? { draft: { ...s.draft, events: s.draft.events.filter((e) => e.id !== id) }, dirty: true } : s)),
  moveEvent: (id, dir) =>
    set((s) => {
      if (!s.draft) return s;
      const events = [...s.draft.events];
      const i = events.findIndex((e) => e.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= events.length) return s;
      [events[i], events[j]] = [events[j], events[i]];
      return { draft: { ...s.draft, events }, dirty: true };
    }),
  markSaved: (invite) => set({ draft: invite, dirty: false }),
  patchSaved: (patch) => set((s) => (s.draft ? { draft: { ...s.draft, ...patch } } : s)),
}));
