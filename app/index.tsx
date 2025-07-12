import TopBottomBackground from "@/components/TopBottomBackground";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { designSystem } = useAppTheme();

  const [isLoading, setIsLoading] = useState(true);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    router.replace("/(tabs)/Home");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(designSystem.colors.primary); // ou toute autre couleur
  }, [designSystem.colors.primary]);

  if (isLoading) {
    return (
      <View
        // withBottom={false}
        style={{
          backgroundColor: designSystem.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 30, // couverture garantie
        }}
      >
        <TopBottomBackground withBottom />
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return null;
}
