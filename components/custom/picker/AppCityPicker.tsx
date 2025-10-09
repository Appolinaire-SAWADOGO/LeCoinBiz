import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import AppDropDownPicker from "./AppDropDownPicker";
import {BURKINA_CITIES} from "@/constants/burkinaCities";

export default function AppCityPicker({
  cityPickerOpen,
  setCityPickerOpen,
  cityValue,
  setCityValue,
  withAllCity = true,
  style,
}: {
  cityPickerOpen: boolean;
  setCityPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cityValue: string | null;
  setCityValue: React.Dispatch<React.SetStateAction<string>>;
  withAllCity?: boolean;
  style?: StyleProp<ViewStyle>;
}) {

  return (
    <AppDropDownPicker
      withSearch={false}
      placeholder="Choisissez une Ville"
      items={BURKINA_CITIES.map((city) => ({
        label: city,
        value: city,
      }))}
      open={cityPickerOpen}
      setOpen={setCityPickerOpen}
      value={cityValue as string}
      setValue={
        setCityValue as React.Dispatch<React.SetStateAction<string | null>>
      }
      style={style}
    />
  );
}
