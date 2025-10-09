import React from "react";
import AppCategoriePicker from "../../custom/picker/AppCategoriePicker";
import PostAnAdSection from "../PostAnAdSection";
import {StyleProp, ViewStyle} from "react-native";

export default function PostAnAdCategorieSection({
    onChangeText,
    style                                             }:{
    onChangeText: (text: string )=>void,
    style?: StyleProp<ViewStyle>
}) {
  const [catPickerOpen, setCatPickerOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>("");

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
