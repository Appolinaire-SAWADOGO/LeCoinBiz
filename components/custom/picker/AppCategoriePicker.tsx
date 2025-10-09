import AllCategoriesImage from "@/assets/images/categories/Menu.png";
import React from "react";
import {Image, StyleProp, ViewStyle} from "react-native";
import AppDropDownPicker from "./AppDropDownPicker";
import {CATEGORIES} from "@/constants/categories";

export default function AppCategoriePicker({
    catPickerOpen,
    setCatPickerOpen,
    catValue,
    setCatValue,
    withAllCat = true,
    style,
}: {
  catPickerOpen: boolean;
  setCatPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  catValue: string | null;
  setCatValue: React.Dispatch<React.SetStateAction<string | null>>  ;
  withAllCat?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const items = () => {
    if (withAllCat)
      return [
        {
          label: "Toutes les catégories",
          value: "Toutes les catégories",
          icon: () => (
            <Image
              source={AllCategoriesImage}
              style={{ width: 20, height: 20, marginRight: 10 }}
              resizeMode="contain"
            />
          ),
        },
        ...CATEGORIES.map((category) => ({
          label: category.name,
          value: category.name,
          icon: () => (
            <Image
              source={category.icon}
              style={{ width: 20, height: 20, marginRight: 10 }}
              resizeMode="contain"
            />
          ),
        })),
      ];
    return [
      ...CATEGORIES.map((category) => ({
        label: category.name,
        value: category.name,
        icon: () => (
          <Image
            source={category.icon}
            style={{ width: 20, height: 20, marginRight: 10 }}
            resizeMode="contain"
          />
        ),
      })),
    ];
  };

  return (
    <AppDropDownPicker
      placeholder="Choisissez une catégorie"
      items={items()}
      open={catPickerOpen}
      setOpen={setCatPickerOpen}
      value={catValue as string}
      setValue={
        setCatValue as React.Dispatch<React.SetStateAction<string | null>>
      }
      style={style}
    />
  );
}
