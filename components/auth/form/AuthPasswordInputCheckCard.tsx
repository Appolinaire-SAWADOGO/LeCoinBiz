import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import AppText from "../../custom/AppText";

export default function AuthPasswordInputCheckCard({
  label,
  isvalided,
}: {
  label: string;
  isvalided: boolean;
}) {
  const { designSystem } = useAppTheme();

  const color = isvalided
    ? designSystem.colors.completed
    : designSystem.colors.subText;

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={19}
        color={color}
      />
      <AppText fontSize={12} color={color}>
        {label}
      </AppText>
    </View>
  );
}
