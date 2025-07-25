import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import AppText from "../../custom/AppText";

export default function AuthFormInputSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View>
      <AppText
        fontSize={12}
        font="Medium"
        color={designSystem.colors.smallText}
        style={{ marginBottom: 8 }}
      >
        {label}
      </AppText>

      {children}
    </View>
  );
}
