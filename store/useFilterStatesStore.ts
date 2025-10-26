import { AdOptionsPickerType } from "@/types";
import { create } from "zustand";

type FilterStates = {
  isOpen: boolean;
  search: string;
  category: string;
  subCategory: string;
  city: string;
  min: string;
  max: string;
  tempPub: string;
  options: AdOptionsPickerType;
  isFiltered: boolean;

  open: () => void;
  close: () => void;
  setSeach: (value: string | void) => void;
  setCategory: (value: string | null) => void;
  setCity: (value: string) => void;
  setMin: (value: string) => void;
  setMax: (value: string) => void;
  setTempPub: (value: string) => void;
  setOptions: (value: AdOptionsPickerType) => void;
  updateIsFiltered: () => void;
  resetFilters: () => void;
};

export const useFilterStatesStore = create<FilterStates>((set, get) => ({
  isOpen: false,
  search: "",
  category: "Toutes les catégories",
  subCategory: "",
  city: "Toutes les villes",
  min: "",
  max: "",
  tempPub: "Toutes les annonces",
  options: [
    { label: "Annonces Populaire", active: false },
    { label: "Livraison Gratuite", active: false },
    { label: "Neuf", active: false },
  ],
  isFiltered: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setSeach(value) {
    set({ search: value as string });
    get().updateIsFiltered();
  },
  setCategory: (value) => {
    set({ category: value as string });
    get().updateIsFiltered();
  },
  setCity: (value) => {
    set({ city: value });
    get().updateIsFiltered();
  },
  setMin: (value) => {
    set({ min: value });
    get().updateIsFiltered();
  },
  setMax: (value) => {
    set({ max: value });
    get().updateIsFiltered();
  },
  setTempPub: (value) => {
    set({ tempPub: value });
    get().updateIsFiltered();
  },
  setOptions: (value) => {
    set({ options: value });
    get().updateIsFiltered();
  },

  updateIsFiltered: () => {
    const { search, category, subCategory, city, min, max, tempPub, options } =
      get();
    const isFiltered =
      search !== "" ||
      category !== "Toutes les catégories" ||
      subCategory !== "" ||
      city !== "Toutes les villes" ||
      min !== "" ||
      max !== "" ||
      tempPub !== "Toutes les annonces" ||
      options.some((option) => option.active);
    set({ isFiltered });
  },

  resetFilters: () =>
    set({
      search: "",
      category: "Toutes les catégories",
      subCategory: "",
      city: "Toutes les villes",
      min: "",
      max: "",
      tempPub: "Toutes les annonces",
      options: [
        { label: "Annonces Populaire", active: false },
        { label: "Livraison Gratuite", active: false },
        { label: "Neuf", active: false },
      ],
      isFiltered: false,
    }),
}));
