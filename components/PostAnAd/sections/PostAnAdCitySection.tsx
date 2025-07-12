import React from "react";
import AppCityPicker from "../../custom/AppCityPicker";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdCitySection() {
  const [cityPickerOpen, setCityPickerOpen] = React.useState(false);
  const [cityValue, setCityValue] = React.useState<string>("");
  return (
    <PostAnAdSection label="Ville" placeholder="Selectionnez la ville">
      <AppCityPicker
        withAllCity={false}
        cityPickerOpen={cityPickerOpen}
        setCityPickerOpen={setCityPickerOpen}
        cityValue={cityValue}
        setCityValue={setCityValue}
      />
    </PostAnAdSection>
  );
}
