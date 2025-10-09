import AppText from "@/components/custom/AppText";
import AppAdOptionsPicker from "@/components/custom/picker/AppAdOptionsPicker";
import { AdOptionsPickerType } from "@/types";
import React from "react";
import { StyleSheet } from "react-native";
import {FILTER_OPTIONS} from "@/constants";

export default function FilterModalFormOptionsSection({
  options,
  setOptions,
}: {
  options: AdOptionsPickerType;
  setOptions: React.Dispatch<React.SetStateAction<AdOptionsPickerType>>;
}) {
  return (
    <>
      <AppText style={styles.label}>Options</AppText>
      <AppAdOptionsPicker
        options={options}
        setOptions={setOptions}
        items={FILTER_OPTIONS}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    marginTop: 14,
  },
});
