import { create } from "zustand";

interface ScrollState {
  homeScrollOffset: number;
  setHomeScrollOffset: (offset: number) => void;
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  homeScrollOffset: 0,
  setHomeScrollOffset: (offset) => {
    const currentOffset = get().homeScrollOffset;

    // Ne mettre à jour que si la différence est significative (>10px)
    // Cela évite les re-renders inutiles pour de petits mouvements
    if (Math.abs(currentOffset - offset) < 10) {
      return;
    }

    set({ homeScrollOffset: offset });
  },
}));
