import { create } from "zustand";

type VerifyEmailStoreType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useVerifyEmailStore = create<VerifyEmailStoreType>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
