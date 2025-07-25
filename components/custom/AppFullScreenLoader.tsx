// components/FullScreenLoader.tsx
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function AppFullScreenLoader() {
  const { designSystem } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff", // ou "transparent" selon le cas
      }}
    >
      <ActivityIndicator size="large" color={designSystem.colors.primary} />
    </View>
  );
}
