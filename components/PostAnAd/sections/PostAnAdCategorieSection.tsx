import React from "react";
import AppCategoriePicker from "../../custom/AppCategoriePicker";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdCategorieSection() {
  const [catPickerOpen, setCatPickerOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>("");

  return (
    <PostAnAdSection label="Categorie" placeholder="Sélectionnez la catégorie">
      <AppCategoriePicker
        withAllCat={false}
        catPickerOpen={catPickerOpen}
        setCatPickerOpen={setCatPickerOpen}
        catValue={category}
        setCatValue={setCategory}
      />
    </PostAnAdSection>
  );
}
