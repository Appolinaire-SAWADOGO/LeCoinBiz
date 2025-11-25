import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfileGenderSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={{ gap: 8 }}>
      <AppText font="Medium" fontSize={15}>
        Gender
      </AppText>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {["MAN", "WOMAN"].map((item) => {
          const isSelected = value === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => onChange(item)}
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
                  fontSize: 15,
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
