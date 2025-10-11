import { UseFormReset } from "react-hook-form";
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

export type BurkinaCitiesType = string[];

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

export type ResetFormType = UseFormReset<{
  title: string;
  price: number;
  category: string;
  description: string;
  conditions: string[];
  images: string[];
  options: {
    label: string;
    active: boolean;
  }[];
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
}>;
