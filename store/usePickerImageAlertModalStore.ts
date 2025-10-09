import { create } from "zustand";

type PickerImageAlertModalType = {
  isOpen: boolean;
  alertMsg: string;
  open: (msg: string) => void;
  close: () => void;
};

export const usePickerImageAlertModalStore = create<PickerImageAlertModalType>(
  (set) => ({
    isOpen: false,
    alertMsg: "",
    open: (msg: string) => set({ isOpen: true, alertMsg: msg }),
    close: () => set({ isOpen: false, alertMsg: "" }),
    setAlertMsg: (msg: string) => set({ alertMsg: msg }),
  })
);
