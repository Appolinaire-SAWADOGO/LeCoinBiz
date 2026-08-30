import AppText from "@/components/custom/AppText";
import AppAdOptionsPicker from "@/components/custom/picker/AppAdOptionsPicker";
import { FILTER_OPTIONS } from "@/constants";
import { AdOptionsPickerType } from "@/types";
import React from "react";
import { StyleSheet } from "react-native";

export default function FilterModalFormOptionsSection({
  onChange,
}: {
  onChange: (options: AdOptionsPickerType) => void;
}) {
  const [options, setOptions] = React.useState<AdOptionsPickerType>([
    { label: "Annonces Populaire", active: false },
    { label: "Livraison Gratuite", active: false },
    { label: "Neuf", active: false },
    { label: "A la une", active: false },
  ]);

  React.useEffect(() => {
    onChange(options);
  }, [onChange, options]);

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
