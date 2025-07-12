import { AdOptionsPickerType } from "@/types";
import React, { useEffect } from "react";

export const useFilterState = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(
    "Toutes les categories"
  );
  const [city, setCity] = React.useState("Tout le Burkina Faso");
  const [min, setMin] = React.useState("");
  const [max, setMax] = React.useState("");
  const [tempPub, setTempPub] = React.useState("Toutes les annonces");
  const [options, setOptions] = React.useState<AdOptionsPickerType>([
    {
      label: "Annonces Populaire",
      active: true,
    },
    {
      label: "Livraison Gratuite",
      active: false,
    },
    {
      label: "Neuf",
      active: false,
    },
  ]);

  const [isFiltered, setIsFiltered] = React.useState(false);

  useEffect(() => {
    if (
      category !== "Toutes les categories" ||
      city !== "Tout le Burkina Faso" ||
      min !== "" ||
      max !== "" ||
      tempPub !== "Toutes les annonces" ||
      options.some((option) => option.active)
    )
      setIsFiltered(true);
    else setIsFiltered(false);
  }, [category, city, min, max, tempPub, options]);

  return {
    isOpen,
    setIsOpen,
    category,
    setCategory,
    city,
    setCity,
    min,
    setMin,
    max,
    setMax,
    tempPub,
    setTempPub,
    options,
    setOptions,
    isFiltered,
  };
};
