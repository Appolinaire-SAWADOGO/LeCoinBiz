import { create } from "zustand";

type AddYourUsernameModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddYourUsernameModalStore = create<AddYourUsernameModalType>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
