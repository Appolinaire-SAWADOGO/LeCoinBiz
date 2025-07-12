import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";
import SettingsSectionContainer from "../SettingSectionContainer";

export default function SettingChangeThemeSection() {
  const { designSystem, setPrimary } = useAppTheme();

  const handleSelectThemeColor = (color: string) => {
    setPrimary(color);
  };

  return (
    <SettingsSectionContainer title="Thème">
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        {["#2e8b57", "#641BB4", "#0CA789"].map((color) => {
          const isSelected = color === designSystem.colors.primary;

          return (
            <TouchableOpacity
              onPress={() => handleSelectThemeColor(color)}
              activeOpacity={0.3}
              key={color}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: color,
                borderWidth: isSelected ? 3 : 0,
                borderColor: isSelected ? "#000" : "#fff",
              }}
            />
          );
        })}
      </View>
      <TouchableOpacity>
        <AppText
          color={designSystem.colors.primary}
          font="Medium"
          fontSize={14}
        >
          🎨 Personnaliser la couleur
        </AppText>
      </TouchableOpacity>
    </SettingsSectionContainer>
  );
}
