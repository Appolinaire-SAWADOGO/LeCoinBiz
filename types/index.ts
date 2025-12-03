import { Timestamp } from "@react-native-firebase/firestore";
import { UseFormReset } from "react-hook-form";
import { ImageSourcePropType } from "react-native";

export type CategoriesType = {
  id: number;
  name: string;
  icon: ImageSourcePropType;
}[];

export type AdStatusType = "ACTIVATED" | "PENDING" | "DISABLED";

export type AnnouncementType = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
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
  stats: {
    clicks: number;
    favorites: number;
    views: number;
  };
  status: AdStatusType;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type AlgoliaAnnouncementType = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
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
  stats: {
    clicks: number;
    favorites: number;
    views: number;
  };
  status: AdStatusType;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type AuthMethodType = "EMAIL_PASSWORD" | "PHONE_NUMBER" | "GOOGLE";

export type UserType = {
  id: string;
  userName: string;
  firstAndLastName: string;
  gender: "MAN" | "WOMAN";
  dateOfBirth: Timestamp;
  image: string;
  location: {
    city: string;
    country: string;
  };
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  authMethod: AuthMethodType;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type FavoriteType = {
  id: string;
  adId: string;
  userId: string;
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
  | "signUpWithEmail";

export type ResetFormType = UseFormReset<{
  title: string;
  price: number;
  category: string;
  subCategory: string;
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
