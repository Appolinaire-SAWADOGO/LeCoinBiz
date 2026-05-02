import { AdOptionsType, FilterOptionsType } from "@/types";

export const FILTER_OPTIONS: FilterOptionsType = [
  {
    label: "Annonces Populaire",
    icon: "fire",
  },
  {
    label: "Livraison Gratuite",
    icon: "package-variant-closed",
  },
  {
    label: "Neuf",
    icon: "new-box",
  },
];

export const AD_OPTIONS: AdOptionsType = [
  {
    label: "Livraison Gratuite",
    icon: "package-variant-closed",
  },
  {
    label: "Neuf",
    icon: "new-box",
  },
];

export const APP_NAME = "LeCoinBiz";

export const APP_VERION = "1.0.15";

export const DEFAULT_PROFILE_IMG =
  "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";

export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "moderator",
  "support",
  "help",
  "api",
  "root",
  "system",
  "null",
  "undefined",
  "test",
  "demo",
  "official",
  "staff",
  "lecoinbiz",
];

export const TEMP_PUB_OPTIONS = {
  ALL: "Toutes les annonces",
  TODAY: "Aujourd'hui",
  THREE_DAYS: "Moins de 3 jours",
  SEVEN_DAYS: "Moins de 7 jours",
} as const;
