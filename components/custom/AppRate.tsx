import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import StarRating from "react-native-star-rating-widget";

const AppRate = ({
  rateColor,
  rating,
  setRating,
}: {
  rateColor?: string;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { designSystem } = useAppTheme();

  return (
    <StarRating
      enableHalfStar={false}
      enableSwiping={false}
      rating={rating}
      onChange={setRating}
      starSize={28}
      color={rateColor ? rateColor : designSystem.colors.bigText} // marche très bien ici
    />
  );
};

export default AppRate;
