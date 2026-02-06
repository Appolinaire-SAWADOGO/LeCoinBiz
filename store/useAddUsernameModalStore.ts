import { create } from "zustand";

type AddUsernameModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddUsernameModalStore = create<AddUsernameModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
