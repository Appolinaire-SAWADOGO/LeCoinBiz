import AppToast from "@/components/custom/AppToast";
import AppImagePickerAlertModal from "@/components/modals/AppImagePickerAlertModal";
import AuthAddUsernameModal from "@/components/modals/AuthAddUsernameModal";
import AuthChangeEmailModal from "@/components/modals/AuthChangeEmailModal";
import AuthChangePasswordModal from "@/components/modals/AuthChangePasswordModal";
import AuthModal from "@/components/modals/AuthModal";
import AuthVerifyEmailModal from "@/components/modals/AuthVerifyEmailModal";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useGetAdsByUserId } from "@/hooks/services/ads/useGetAdsByUserId";
import { useGetHomeAds } from "@/hooks/services/ads/useGetHomeAds";
import { useGetUserAdsCount } from "@/hooks/services/ads/useGetUserAdsCount";
import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useGetFavoriteAdsByUserId } from "@/hooks/services/favorites/useGetFavoritesAdsByUserId";
import { useGetNotifications } from "@/hooks/services/notifications/useGetNotifications";
import { useGetUserById } from "@/hooks/services/user/useGetUserById";
import { useAppNotificationStore } from "@/store/useNotificationStore";
import { initialPrefetchQuery } from "@/utils/auth";
import {
  handleNotificationNavigation,
  subscribeToGeneralTopic,
  subscribeToUserTopic,
} from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { enableFreeze } from "react-native-screens";

enableFreeze(true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  // const initNetworkListener = useNetworkStore();
  const currentUser = useCurrentUser();
  const userId = currentUser?.uid;

  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();
  const { getNotifications } = useGetNotifications();
  const { getHomeAds } = useGetHomeAds();

  const { setIsAppNotificationClosed, setIsAppNotificationBackground } =
    useAppNotificationStore();

  const [fontsLoaded] = useFonts({
    "BasisGrotesqueArabicPro-Black": require("../assets/fonts/BasisGrotesqueArabicPro-Black.ttf"),
    "BasisGrotesqueArabicPro-Bold": require("../assets/fonts/BasisGrotesqueArabicPro-Bold.ttf"),
    "BasisGrotesqueArabicPro-Light": require("../assets/fonts/BasisGrotesqueArabicPro-Light.ttf"),
    "BasisGrotesqueArabicPro-Medium": require("../assets/fonts/BasisGrotesqueArabicPro-Medium.ttf"),
    "BasisGrotesqueArabicPro-Regular": require("../assets/fonts/BasisGrotesqueArabicPro-Regular.ttf"),
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Notif reçue en foreground:", remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    handleNotificationNavigation(
      queryClient,
      setIsAppNotificationClosed,
      setIsAppNotificationBackground,
      currentUser?.uid,
    );
  }, []);

  useEffect(() => {
    (async () => {
      await subscribeToGeneralTopic();
      if (userId) await subscribeToUserTopic(userId);
    })();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    (async () => {
      await initialPrefetchQuery(
        queryClient,
        getFavoritesAdsByUserId,
        getUserById,
        getUserAdsCount,
        getAdsByUserId,
        getNotifications,
        currentUser?.uid,
      );
    })();
  }, [currentUser?.uid]);

  // useEffect(() => {
  //   initNetworkListener.initNetwokListener();
  // }, [initNetworkListener]);

  if (!fontsLoaded) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
      onSuccess={async () => {
        await queryClient.invalidateQueries({
          queryKey: ["home-ads"],
        });
      }}
    >
      <GluestackUIProvider mode="light">
        <SafeAreaProvider>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ExpoStatusBar style="dark" />

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(root)" />
            </Stack>

            <AuthModal />
            <AuthAddUsernameModal />
            <AppImagePickerAlertModal />
            <AuthVerifyEmailModal />
            <AuthChangeEmailModal />
            <AuthChangePasswordModal />

            <AppToast />

            <View
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                bottom: 0,
                left: 0,
                right: 0,
                height: insets.bottom,
              }}
            />
          </View>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </PersistQueryClientProvider>
  );
}
