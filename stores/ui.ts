import { create } from 'zustand';

type ViewState = 'desk' | 'stacks';

type UIState = {
  view: ViewState;
  isCatalogOpen: boolean;
  isCreatorOpen: boolean;
  isSettingsOpen: boolean;
  isShelfEditorOpen: boolean;
  creatorShelfId: string | null;
  editingShelfId: string | null;
  setView: (v: ViewState) => void;
  setCatalogOpen: (isOpen: boolean) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  openCreator: (shelfId: string) => void;
  closeCreator: () => void;
  openShelfEditor: (shelfId: string) => void;
  closeShelfEditor: () => void;
};

export const useUI = create<UIState>((set) => ({
  view: 'stacks', // CHANGED: Spawn directly in portal
  isCatalogOpen: false,
  isCreatorOpen: false,
  isSettingsOpen: false,
  isShelfEditorOpen: false,
  creatorShelfId: null,
  editingShelfId: null,
  setView: (view) => set({ view }),
  setCatalogOpen: (isCatalogOpen) => set({ isCatalogOpen }),
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  openCreator: (shelfId) => set({ isCreatorOpen: true, creatorShelfId: shelfId }),
  closeCreator: () => set({ isCreatorOpen: false, creatorShelfId: null }),
  openShelfEditor: (shelfId) => set({ isShelfEditorOpen: true, editingShelfId: shelfId }),
  closeShelfEditor: () => set({ isShelfEditorOpen: false, editingShelfId: null }),
}));