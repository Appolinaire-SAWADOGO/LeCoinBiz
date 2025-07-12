import Fire from "../assets/images/Fire.png";
import Star from "../assets/images/Star.png";
import Money from "../assets/images/Money.png";
import { SortByType } from "@/types";

export const sortBy: SortByType = [
  {
    name: "Most Popular",
    icon: Fire,
  },
  {
    name: "Ratings",
    icon: Star,
  },
  {
    name: "Price (Hight to Low)",
    icon: Money,
  },
  {
    name: "Price (Low to Hight)",
    icon: Money,
  },
];
