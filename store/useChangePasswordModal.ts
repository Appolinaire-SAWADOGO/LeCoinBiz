import { create } from "zustand";

type ChangePasswordStoreType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useChangePasswordStore = create<ChangePasswordStoreType>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
