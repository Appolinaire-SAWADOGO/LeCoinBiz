import { create } from "zustand";

type Theme = {
  primary: string;
  setPrimary: (color: string) => void;
};

export const useThemeStore = create<Theme>((set) => ({
  primary: "#2e8b57",
  setPrimary: (color: string) => set({ primary: color }),
}));
