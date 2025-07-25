import { ImageSourcePropType } from "react-native";

export type CategoriesType = {
  id: number;
  name: string;
  icon: ImageSourcePropType;
  subcategories: string[];
}[];

export type AnnouncementsType = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  condition: string;
  freeDelivery: boolean;
  subPhotos: string[];
  location: {
    city: string;
    district: string;
    distance: string;
    pays: string;
  };
};

export type SortByType = {
  name: string;
  icon: ImageSourcePropType;
}[];

export type BurkinaCitiesByRegionType = {
  region: string;
  cities: string[];
}[];

export type FilterOptionsType = {
  label: "Annonces Populaire" | "Livraison Gratuite" | "Neuf";
  image: ImageSourcePropType;
}[];

export type AdOptionsType = {
  label: "Livraison Gratuite" | "Neuf";
  image: ImageSourcePropType;
}[];

export type AdOptionsPickerType = {
  label: string;
  active: boolean;
}[];

export type FilterModalUseCaseType = "Home" | "Search" | "Category";

export type ContinousWithPhomeNumberStepType =
  | "enterPhoneNumber"
  | "enterOTP"
  | "addUserName";

export type AuthModalType =
  | "Index"
  | "continousWithPhoneNumber"
  | "signInWithEmail"
  | "signUpWithEmail"
  | "continousWithGoogle";
