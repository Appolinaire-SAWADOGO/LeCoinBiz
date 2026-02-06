import { useEditProfile } from "@/hooks/services/user/useEditProfile";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfileGenderSection({
  gender,
}: {
  gender: string;
}) {
  const { designSystem } = useAppTheme();

  const [value, setValue] = React.useState<string>(gender);
  const [lastValue, setLastValue] = React.useState<string>(gender);

  const { editGender } = useEditProfile();

  return (
    <View style={{ gap: 8 }}>
      <AppText font="Medium">Gender</AppText>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {["MAN", "WOMAN"].map((item) => {
          const isSelected = value === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={async () => {
                if (isSelected) return;
                await editGender(item, setValue);
              }}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                borderWidth: 1,
                borderColor: isSelected
                  ? designSystem.colors.primary
                  : designSystem.colors.inputBorder,
                backgroundColor: isSelected
                  ? designSystem.colors.primaryLight
                  : "#fff",
              }}
            >
              <AppText
                style={{
                  color: isSelected ? designSystem.colors.primary : "#333",
                }}
                font={isSelected ? "Medium" : "Regular"}
              >
                {item === "MAN" ? "Homme" : "Femme"}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
