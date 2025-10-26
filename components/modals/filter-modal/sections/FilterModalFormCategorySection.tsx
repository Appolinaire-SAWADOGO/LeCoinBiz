import AppText from "@/components/custom/AppText";
import AppCategoriePicker from "@/components/custom/picker/AppCategoriePicker";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FilterModalFormCategorySection({
  category,
  setCategory,
}: {
  category: string | null;
  setCategory: (value: string | null) => void;
}) {
  const [catPickerOpen, setCatPickerOpen] = React.useState(false);

  return (
    <>
      <View>
        <AppText style={styles.label}>Catégorie</AppText>
        <AppCategoriePicker
          catPickerOpen={catPickerOpen}
          setCatPickerOpen={setCatPickerOpen}
          catValue={category}
          setCatValue={setCategory}
          isSelected={category !== "Toutes les catégories"}
        />
      </View>
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
