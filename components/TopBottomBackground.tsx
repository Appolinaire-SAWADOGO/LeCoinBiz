import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopBottomBackground({
  withBottom,
  bgColor,
}: {
  withBottom: boolean;
  bgColor?: string;
}) {
  const insets = useSafeAreaInsets();

  const { designSystem } = useAppTheme();

  return (
    <>
      {/* {Top */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          zIndex: 20,
          backgroundColor: bgColor || designSystem.colors.primary,
        }}
      />

      {/* {Bottom */}
      {withBottom && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: insets.bottom,
            backgroundColor: bgColor || designSystem.colors.primary,
          }}
        />
      )}
    </>
  );
}
