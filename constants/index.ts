import { AdOptionsType, FilterOptionsType } from "@/types";
import FlammeImage from "../assets/images/filter-options/Flamme.png";
import LivarisonGratuiteImage from "../assets/images/filter-options/FreeDelevery.png";
import NeufImage from "../assets/images/filter-options/Neuf.png";

export const FILTER_OPTIONS: FilterOptionsType = [
  {
    label: "Annonces Populaire",
    image: FlammeImage,
  },
  {
    label: "Livraison Gratuite",
    image: LivarisonGratuiteImage,
  },
  {
    label: "Neuf",
    image: NeufImage,
  },
];

export const AD_OPTIONS: AdOptionsType = [
  {
    label: "Livraison Gratuite",
    image: LivarisonGratuiteImage,
  },
  {
    label: "Neuf",
    image: NeufImage,
  },
];

export const APP_NAME = "LeCoinBiz";

export const APP_VERION = "1.0.9";

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
