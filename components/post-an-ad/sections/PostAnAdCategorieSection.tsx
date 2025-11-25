import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import AppCategoriePicker from "../../custom/picker/AppCategoriePicker";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdCategorieSection({
  onChangeText,
  value,
  style,
}: {
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  value: string;
}) {
  const [catPickerOpen, setCatPickerOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(value || "");

  React.useEffect(() => {
    if (category) {
      onChangeText(category);
    }
  }, [category]);

  return (
    <PostAnAdSection label="Categorie" placeholder="Sélectionnez la catégorie">
      <AppCategoriePicker
        style={style}
        withAllCat={false}
        catPickerOpen={catPickerOpen}
        setCatPickerOpen={setCatPickerOpen}
        catValue={category}
        setCatValue={setCategory}
      />
    </PostAnAdSection>
  );
}
