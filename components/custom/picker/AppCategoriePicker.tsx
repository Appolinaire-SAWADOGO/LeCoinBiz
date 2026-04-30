import { CATEGORIES } from "@/constants/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import AppDropDownPicker from "./AppDropDownPicker";

export default function AppCategoriePicker({
  catPickerOpen,
  setCatPickerOpen,
  catValue,
  setCatValue,
  withAllCat = true,
  style,
  isSelected,
}: {
  catPickerOpen: boolean;
  setCatPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  catValue: string | null;
  setCatValue:
    | React.Dispatch<React.SetStateAction<string | null>>
    | ((value: string | null) => void);
  withAllCat?: boolean;
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
}) {
  const items = () => {
    if (withAllCat)
      return [
        {
          label: "Toutes les catégories",
          value: "Toutes les catégories",
          icon: () => (
            <MaterialCommunityIcons
              name="view-grid"
              size={20}
              style={{ marginRight: 10 }}
            />
          ),
        },
        ...CATEGORIES.map((category) => ({
          label: category.name,
          value: category.name,
          icon: () => (
            <MaterialCommunityIcons
              name={category.icon}
              size={20}
              style={{ marginRight: 10 }}
            />
          ),
        })),
      ];
    return [
      ...CATEGORIES.map((category) => ({
        label: category.name,
        value: category.name,
        icon: () => (
          <MaterialCommunityIcons
            name={category.icon}
            size={20}
            style={{ marginRight: 10 }}
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
      setValue={(callback: any) => {
        const newValue =
          typeof callback === "function" ? callback(catValue) : callback;
        setCatValue(newValue);
      }}
      style={style}
      isSelected={isSelected}
    />
  );
}
