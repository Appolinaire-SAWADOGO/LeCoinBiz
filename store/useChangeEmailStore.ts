import { create } from "zustand";

type ChangeEmailStoreType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useChangeEmailStore = create<ChangeEmailStoreType>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
