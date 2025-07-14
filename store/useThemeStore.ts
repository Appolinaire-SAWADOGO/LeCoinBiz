import { create } from "zustand";

type Theme = {
  primary: string;
  setPrimary: (color: string) => void;
};

export const useThemeStore = create<Theme>((set) => ({
  primary: "#641BB4",
  setPrimary: (color: string) => set({ primary: color }),
}));
