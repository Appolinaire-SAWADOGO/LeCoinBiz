import { create } from "zustand";

type AuthModalStoreType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAuthModalStore = create<AuthModalStoreType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
