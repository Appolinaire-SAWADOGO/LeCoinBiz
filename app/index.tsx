import TopBottomBackground from "@/components/TopBottomBackground";
import { useAppTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { designSystem } = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const localisation = await AsyncStorage.getItem("user_location");

        if (localisation) {
          console.log("Data getted successfully!", localisation);
          router.replace("/(tabs)/Home");
        } else {
          router.replace("/(root)/ChooseCity");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: designSystem.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 30,
        }}
      >
        <TopBottomBackground withBottom />
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return null;
}
