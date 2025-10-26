import { UseFormReset } from "react-hook-form";
import { ImageSourcePropType } from "react-native";

export type CategoriesType = {
  id: number;
  name: string;
  icon: ImageSourcePropType;
}[];

export type AnnouncementsType = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
  userId: string;
  conditions: string[];
  options: {
    label: string;
    active: boolean;
  }[];
  images: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
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

export type FilterModalUseCaseType = "Home" | "Filter";

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
