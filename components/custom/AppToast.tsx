import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { ToastConfig } from "react-native-toast-message";
import CircleCheckDynSvg from "../svg/CircleCheckDynSvg";
import XDynSvg from "../svg/XDynSvg";
import AppText from "./AppText";

export default function AppToast() {
  const { designSystem } = useAppTheme();
  const inset = useSafeAreaInsets();

  // Définir la config personnalisée
  const toastConfig: ToastConfig = {
    // Type success
    success: ({ text1, ...rest }) => (
      <View
        style={{
          height: 36,
          backgroundColor: designSystem.colors.primary,
          paddingVertical: 8,
          paddingHorizontal: 20,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 0.15,
          // shadowRadius: 2,
          // elevation: 2,
          marginBottom: inset.bottom + 30,
        }}
      >
        <CircleCheckDynSvg />
        <AppText color="#fff" font="Medium" fontSize={13.5}>
          {text1}
        </AppText>
      </View>
    ),
    // Type error
    error: ({ text1, ...rest }) => (
      <View
        style={{
          height: 36,
          backgroundColor: "red",
          paddingVertical: 8,
          paddingHorizontal: 20,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 0.15,
          // shadowRadius: 2,
          // elevation: 2,
          marginBottom: inset.bottom + 20,
        }}
      >
        <XDynSvg fill="#fff" width={16} height={16} />
        <AppText color="#fff" font="Medium" fontSize={13.5}>
          {text1}
        </AppText>
      </View>
    ),
  };

  return <Toast config={toastConfig} />;
}
