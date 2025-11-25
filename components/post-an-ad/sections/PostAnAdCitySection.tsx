import { ViewStyle } from "@expo/html-elements/build/primitives/View";
import React from "react";
import { StyleProp } from "react-native";
import AppCityPicker from "../../custom/picker/AppCityPicker";
import PostAnAdSection from "../PostAnAdSection";

export default function PostAnAdCitySection({
  value,
  onChange,
  style,
}: {
  value: string;
  onChange: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [cityPickerOpen, setCityPickerOpen] = React.useState(false);
  const [cityValue, setCityValue] = React.useState<string>(value || "");

  React.useEffect(() => {
    if (cityValue) onChange(cityValue);
  }, [cityValue, onChange]);

  return (
    <PostAnAdSection label="Ville" placeholder="Selectionnez la ville">
      <AppCityPicker
        withAllCity={false}
        cityPickerOpen={cityPickerOpen}
        setCityPickerOpen={setCityPickerOpen}
        cityValue={cityValue}
        setCityValue={setCityValue}
        style={style}
      />
    </PostAnAdSection>
  );
}
