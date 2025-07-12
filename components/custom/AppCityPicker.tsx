import { burkinaCity } from "@/constants/burkina-city";
import React from "react";
import AppDropDownPicker from "./AppDropDownPicker";

export default function AppCityPicker({
  cityPickerOpen,
  setCityPickerOpen,
  cityValue,
  setCityValue,
  withAllCity = true,
}: {
  cityPickerOpen: boolean;
  setCityPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cityValue: string | null;
  setCityValue: React.Dispatch<React.SetStateAction<string>>;
  withAllCity?: boolean;
}) {
  return (
    <AppDropDownPicker
      withSearch
      placeholder="Choisissez une Ville"
      items={burkinaCity(withAllCity).map((city) => ({
        label: city,
        value: city,
      }))}
      open={cityPickerOpen}
      setOpen={setCityPickerOpen}
      value={cityValue as string}
      setValue={
        setCityValue as React.Dispatch<React.SetStateAction<string | null>>
      }
    />
  );
}
