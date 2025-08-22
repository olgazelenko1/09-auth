import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NewNoteData } from '../../types/note';


const initialDraft: NewNoteData = {
  title: '',
  content: '',
  tag: 'Todo', 
};

type NoteDraftStore = {
  draft: NewNoteData;
  setDraft: (note: Partial<NewNoteData>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set(() => ({ draft: { ...initialDraft } })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
