import { subCategories } from "@/constants/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import AppDropDownPicker from "./AppDropDownPicker";

export default function AppSubCategoriePicker({
  subCatPickerOpen,
  setSubCatPickerOpen,
  subCatValue,
  setSubCatValue,
  style,
  isSelected,
  category,
}: {
  subCatPickerOpen: boolean;
  setSubCatPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subCatValue: string | null;
  setSubCatValue:
    | React.Dispatch<React.SetStateAction<string | null>>
    | ((value: string | null) => void);
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
  category: string | null;
}) {
  const items = subCategories(category as string).map(({ name, icon }) => ({
    label: name,
    value: name,
    icon: () => (
      <MaterialCommunityIcons
        name={icon}
        size={20}
        style={{ marginRight: 10 }}
      />
    ),
  }));

  return (
    <AppDropDownPicker
      placeholder="Choisissez une sous-catégorie"
      items={items}
      open={subCatPickerOpen}
      setOpen={setSubCatPickerOpen}
      value={subCatValue as string}
      setValue={(callback: any) => {
        const newValue =
          typeof callback === "function" ? callback(subCatValue) : callback;
        setSubCatValue(newValue);
      }}
      style={style}
      isSelected={isSelected}
    />
  );
}
