import { AdOptionsPickerType, AdOptionsType, FilterOptionsType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppCheckbox from "../AppCheckbox";

export default function AppAdOptionsPicker({
  options,
  setOptions,
  items,
}: {
  options: AdOptionsPickerType;
  setOptions: React.Dispatch<React.SetStateAction<AdOptionsPickerType>>;
  items: FilterOptionsType | AdOptionsType;
}) {
  return (
    <View style={styles.optionscontainer}>
      {items.map(({ label, image }, id) => (
        <AppCheckbox
          key={id}
          isChecked={() => {
            const finded = options.find((item) => item.label === label);
            return finded!.active;
          }}
          setOptions={setOptions}
          image={image}
          label={label}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionscontainer: {
    gap: 10,
  },
});
