import { BURKINA_CITIES } from "@/constants/burkinaCities";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import AppDropDownPicker from "./AppDropDownPicker";

export default function AppCityPicker({
  cityPickerOpen,
  setCityPickerOpen,
  cityValue,
  setCityValue,
  withAllCity = true,
  style,
  isSelected,
}: {
  cityPickerOpen: boolean;
  setCityPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cityValue: string | null;
  setCityValue:
    | React.Dispatch<React.SetStateAction<string>>
    | ((value: string) => void);
  withAllCity?: boolean;
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
}) {
  const itemsWithAllCity = () => {
    const items = BURKINA_CITIES.map((city) => ({
      label: city,
      value: city,
    }));

    if (withAllCity)
      items.unshift({ label: "Toutes les villes", value: "Toutes les villes" });
    return items;
  };

  return (
    <AppDropDownPicker
      withSearch={true}
      placeholder="Choisissez une Ville"
      items={itemsWithAllCity()}
      open={cityPickerOpen}
      setOpen={setCityPickerOpen}
      value={cityValue as string}
      setValue={(callback: any) => {
        const newValue =
          typeof callback === "function" ? callback(cityValue) : callback;
        setCityValue(newValue);
      }}
      style={style}
      isSelected={isSelected}
    />
  );
}
