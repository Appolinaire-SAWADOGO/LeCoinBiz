import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { Button, View } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import CircleCheckDynSvg from "../svg/CircleCheckDynSvg";
import AppText from "./AppText";

export default function AppToast() {
  const { designSystem } = useAppTheme();
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
        }}
      >
        <CircleCheckDynSvg />
        <AppText color="#fff" font="Medium" fontSize={13.5}>
          {text1}
        </AppText>
      </View>
    ),

    // Type error
  };

  const showToast = () => {
    Toast.show({
      type: "success", // success, error, info, custom
      text1: "Ceci est un toast personnalisé",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Show Toast" onPress={showToast} />
      <Toast config={toastConfig} />
    </View>
  );
}
