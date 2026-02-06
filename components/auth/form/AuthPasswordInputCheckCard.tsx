import { useAppTheme } from "@/hooks/useAppTheme";
import { CircleCheck } from "lucide-react-native";
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
      <CircleCheck height={19} width={19} color={color} />
      <AppText fontSize={12} color={color}>
        {label}
      </AppText>
    </View>
  );
}
