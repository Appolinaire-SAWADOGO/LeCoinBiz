import AppCategoriePicker from "@/components/custom/AppCategoriePicker";
import AppText from "@/components/custom/AppText";
import { FilterModalUseCaseType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FilterModalFormCategorySection({
  useCase,
  category,
  setCategory,
}: {
  useCase: FilterModalUseCaseType;
  category: string | null;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [catPickerOpen, setCatPickerOpen] = React.useState(false);

  return (
    <>
      {useCase === "Home" && (
        <View>
          <AppText style={styles.label}>Catégorie</AppText>
          <AppCategoriePicker
            catPickerOpen={catPickerOpen}
            setCatPickerOpen={setCatPickerOpen}
            catValue={category}
            setCatValue={setCategory}
          />
        </View>
      )}
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
