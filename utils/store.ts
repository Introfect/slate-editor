import { create } from "zustand";

type Store = {
  toolbar: boolean;
  hideToolbar: () => void;
  toggleToolbar: () => void;
};

type SelectedToolbarStore = {
  selectedToolbar: number;
  increaseSelectedToolbar: () => void;
  decreaseSelectedToolbar: () => void;
};
export const useToolbarStore = create<Store>((set) => ({
  toolbar: false,
  hideToolbar: () => set((state) => ({ toolbar: (state.toolbar = false) })),
  toggleToolbar: () =>
    set((state) => ({ toolbar: (state.toolbar = !state.toolbar) })),
}));

export const useSelectedToolStore = create<SelectedToolbarStore>((set) => ({
  selectedToolbar: 1,
  increaseSelectedToolbar: () =>
    set((state) => ({
      selectedToolbar: (state.selectedToolbar = state.selectedToolbar + 1),
    })),
  decreaseSelectedToolbar: () => {
    set((state) => ({
      selectedToolbar: (state.selectedToolbar = state.selectedToolbar - 1),
    }));
  },
}));
