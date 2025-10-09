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
