import { SortByType } from "@/types";

export const sortBy: SortByType = [
  {
    name: "Most Popular",
    icon: "fire",
  },
  {
    name: "Ratings",
    icon: "star",
  },
  {
    name: "Price (Hight to Low)",
    icon: "fire", // la vrai valeur de l'icon est "money", mais comme on utilise les icons de MaterialCommunityIcons, il n'y a pas d'icon "money" dans cette librairie, du coup j'ai mis "fire" pour le moment
  },
  {
    name: "Price (Low to Hight)",
    icon: "fire",
  },
];
