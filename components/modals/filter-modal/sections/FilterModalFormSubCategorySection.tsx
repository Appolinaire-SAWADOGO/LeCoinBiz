import AppText from "@/components/custom/AppText";
import AppSubCategoriePicker from "@/components/custom/picker/AppSubCategoriePicker";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FilterModalFormSubCategorySection({
  subCategory,
  setSubCategory,
  category,
}: {
  subCategory: string | null;
  setSubCategory: (value: string | null) => void;
  category: string | null;
}) {
  const [subCatPickerOpen, setSubCatPickerOpen] = React.useState(false);

  return (
    <>
      <View>
        <AppText style={styles.label}>Sous catégorie</AppText>
        <AppSubCategoriePicker
          subCatPickerOpen={subCatPickerOpen}
          setSubCatPickerOpen={setSubCatPickerOpen}
          subCatValue={subCategory}
          setSubCatValue={setSubCategory}
          isSelected={!!subCategory}
          category={category}
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
