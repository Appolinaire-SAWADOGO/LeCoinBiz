import AppText from "@/components/custom/AppText";
import AppCityPicker from "@/components/custom/picker/AppCityPicker";
import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import React from "react";
import { View } from "react-native";

export default function EditProfileCitySection({ city }: { city?: string }) {
  const [value, setValue] = React.useState<string>(city || "");
  const [lastValue, setLastValue] = React.useState<string>(city || "");
  const [cityPickerOpen, setCityPickerOpen] = React.useState(false);

  const { editCity } = useEditProfile();

  React.useEffect(() => {
    const nextValue = city || "";

    if (nextValue !== value) {
      setValue(nextValue);
      setLastValue(nextValue);
    }
  }, [city]);

  const handleSelectCity = async (newCity: string) => {
    const trimmed = newCity.trim();

    if (!trimmed || trimmed === lastValue.trim()) return;

    setValue(trimmed);
    await editCity(trimmed, setValue);
    setLastValue(trimmed);
  };

  return (
    <View style={{ gap: 8 }}>
      <AppText font="Medium">Ville</AppText>

      <AppCityPicker
        cityPickerOpen={cityPickerOpen}
        setCityPickerOpen={setCityPickerOpen}
        cityValue={value || null}
        setCityValue={(newValue: string) => {
          handleSelectCity(newValue);
        }}
        withAllCity={false}
        style={{ borderWidth: 0, borderBottomWidth: 1 }}
      />
    </View>
  );
}
