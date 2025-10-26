import AppText from "@/components/custom/AppText";
import AppCityPicker from "@/components/custom/picker/AppCityPicker";
import React from "react";
import { StyleSheet } from "react-native";

export default function FilterModalFormLocSection({
  city,
  setCity,
}: {
  city: string;
  setCity: (value: string) => void;
}) {
  const [cityPickerOpen, setCityPickerOpen] = React.useState(false);

  return (
    <>
      <AppText style={styles.label}>Région / Ville</AppText>
      <AppCityPicker
        withAllCity
        cityPickerOpen={cityPickerOpen}
        setCityPickerOpen={setCityPickerOpen}
        cityValue={city}
        setCityValue={setCity}
        isSelected={city !== "Toutes les villes"}
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
