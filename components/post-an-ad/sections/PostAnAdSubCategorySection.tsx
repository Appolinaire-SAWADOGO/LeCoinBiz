import AppSubCategoriePicker from "@/components/custom/picker/AppSubCategoriePicker";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdSubCategorySection({
  subCategory,
  setSubCategory,
  category,
  style,
}: {
  subCategory: string | null;
  setSubCategory: (value: string | null) => void;
  category: string | null;
  style?: StyleProp<ViewStyle>;
}) {
  const [subCatPickerOpen, setSubCatPickerOpen] = React.useState(false);

  return (
    <>
      <PostAnAdSection
        label="Sous catégorie"
        placeholder="Sélectionnez la sous-catégorie"
      >
        <AppSubCategoriePicker
          subCatPickerOpen={subCatPickerOpen}
          setSubCatPickerOpen={setSubCatPickerOpen}
          subCatValue={subCategory}
          setSubCatValue={setSubCategory}
          isSelected={!!subCategory}
          category={category}
          style={style}
        />
      </PostAnAdSection>
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
