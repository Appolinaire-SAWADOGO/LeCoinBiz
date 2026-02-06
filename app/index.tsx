import TopBottomBackground from "@/components/TopBottomBackground";
import { useGetAdsByUserId } from "@/hooks/services/ads/useGetAdsByUserId";
import { useGetHomeAds } from "@/hooks/services/ads/useGetHomeAds";
import { useGetUserAdsCount } from "@/hooks/services/ads/useGetUserAdsCount";
import { useGetFavoriteAdsByUserId } from "@/hooks/services/favorites/useGetFavoritesAdsByUserId";
import { useGetNotifications } from "@/hooks/services/notifications/useGetNotifications";
import { useGetUserById } from "@/hooks/services/user/useGetUserById";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppNotificationStore } from "@/store/useNotificationStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { designSystem } = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const queryClient = useQueryClient();
  const { getHomeAds } = useGetHomeAds();
  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();
  const { getNotifications } = useGetNotifications();

  const { isAppNotificationClosed, setIsAppNotificationClosed } =
    useAppNotificationStore();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const location = await AsyncStorage.getItem("user_location");

        if (location) {
          console.log("Data getted successfully!", location);

          if (isAppNotificationClosed) {
            console.log("isAppNotificationClosed:", isAppNotificationClosed);

            setIsAppNotificationClosed(false);
            router.replace("/(root)/Notifications");
          } else {
            router.replace("/(tabs)/Home");
          }
        } else {
          await Notifications.requestPermissionsAsync();

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
