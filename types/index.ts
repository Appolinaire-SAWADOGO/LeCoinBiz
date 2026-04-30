import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LucideIcon } from "lucide-react-native";
import { UseFormReset } from "react-hook-form";

export type MaterialCommunityIconsNameType = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

export type CategoriesType = {
  id: number;
  name: string;
  icon: MaterialCommunityIconsNameType;
}[];

export type SubCategoriesType = {
  id: number;
  categoryId: number;
  name: string;
  icon: MaterialCommunityIconsNameType;
}[];

export type AdStatusType = "ACTIVATED" | "PENDING" | "DISABLED";

export type AnnouncementType = {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  subCategory: string;
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
  userId: string;
  options: {
    label: string;
    active: boolean;
  }[];
  images: string[];
  video?: string;
  stats: {
    clicks: number;
    favorites: number;
    views: number;
  };
  status: AdStatusType;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type AuthMethodType = "EMAIL_PASSWORD" | "PHONE_NUMBER" | "GOOGLE";

export type UserType = {
  id: string;
  userName: string;
  firstAndLastName: string;
  gender: "MAN" | "WOMAN";
  dateOfBirth: {
    _seconds: number;
    _nanoseconds: number;
  };
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
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type FavoriteType = {
  id: string;
  adId: string;
  userId: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type NotificationType = {
  id: string;
  title: string;
  body: string;
  type: "USER_NOTIFICATION" | "GENERAL_NOTIFICATION";
  userId?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type SortByType = {
  name: string;
  icon: LucideIcon;
}[];

export type BurkinaCitiesType = string[];

export type FilterOptionsType = {
  label: "Annonces Populaire" | "Livraison Gratuite" | "Neuf";
  icon: MaterialCommunityIconsNameType;
}[];

export type AdOptionsType = {
  label: "Livraison Gratuite" | "Neuf";
  icon: MaterialCommunityIconsNameType;
}[];

export type AdOptionsPickerType = {
  label: string;
  active: boolean;
}[];

export type FilterModalUseCaseType = "Home" | "Filter";

export type ContinousWithPhomeNumberStepType = "enterPhoneNumber" | "enterOTP";

export type SignInWithEmailStepType = "signin" | "forgotPassword";

export type AuthModalStepType =
  | "Index"
  | "continousWithPhoneNumber"
  | "signInWithEmail"
  | "signUpWithEmail";

export type ResetFormType = UseFormReset<{
  title: string;
  price: number;
  description?: string;
  images: string[];
  video?: string;
  options: {
    label: string;
    active: boolean;
  }[];
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
}>;
