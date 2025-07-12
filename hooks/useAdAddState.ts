import { AdOptionsPickerType } from "@/types";
import React from "react";

export const useAdAddState = () => {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<string | null>(
    "Toutes les categories"
  );
  const [price, setPrice] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [options, setOptions] = React.useState<AdOptionsPickerType>([
    {
      label: "Livraison Gratuite",
      active: false,
    },
    {
      label: "Neuf",
      active: false,
    },
  ]);
  const [city, setCity] = React.useState("");
  const [number, setNumber] = React.useState("");

  const data = {
    title,
    category,
    price,
    desc,
    options,
    city,
    number,
  };

  console.log("data", JSON.stringify(data, null, 2));

  return {
    title,
    setTitle,
    category,
    setCategory,
    price,
    setPrice,
    desc,
    setDesc,
    options,
    setOptions,
    city,
    setCity,
    number,
    setNumber,
  };
};
