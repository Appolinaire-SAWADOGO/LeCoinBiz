import AppToast from "@/components/custom/AppToast";
import AppImagePickerAlertModal from "@/components/modals/AppImagePickerAlertModal";
import AuthAddUsernameModal from "@/components/modals/AuthAddUsernameModal";
import AuthChangeEmailModal from "@/components/modals/AuthChangeEmailModal";
import AuthChangePasswordModal from "@/components/modals/AuthChangePasswordModal";
import AuthModal from "@/components/modals/AuthModal";
import AuthVerifyEmailModal from "@/components/modals/AuthVerifyEmailModal";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useTrackDailyOpen } from "@/hooks/analytics/useTrackDailyOpen";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import messaging from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, usePathname } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { enableFreeze } from "react-native-screens";

enableFreeze(true);

// definir la duree de persistance des donnes de react-query
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

  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null); // ← null au lieu de pathname

  const { trackDailyOpen } = useTrackDailyOpen();

  const { getFavoritesAdsByUserId } = useGetFavoriteAdsByUserId();
  const { getUserById } = useGetUserById();
  const { getUserAdsCount } = useGetUserAdsCount();
  const { getAdsByUserId } = useGetAdsByUserId();
  const { getNotifications } = useGetNotifications();
  const { getHomeAds } = useGetHomeAds();

  const { setIsAppNotificationClosed, setIsAppNotificationBackground } =
    useAppNotificationStore();

  // initialisation des poids du font
  const [fontsLoaded] = useFonts({
    "BasisGrotesqueArabicPro-Black": require("../assets/fonts/BasisGrotesqueArabicPro-Black.ttf"),
    "BasisGrotesqueArabicPro-Bold": require("../assets/fonts/BasisGrotesqueArabicPro-Bold.ttf"),
    "BasisGrotesqueArabicPro-Light": require("../assets/fonts/BasisGrotesqueArabicPro-Light.ttf"),
    "BasisGrotesqueArabicPro-Medium": require("../assets/fonts/BasisGrotesqueArabicPro-Medium.ttf"),
    "BasisGrotesqueArabicPro-Regular": require("../assets/fonts/BasisGrotesqueArabicPro-Regular.ttf"),

    ...MaterialCommunityIcons.font,
  });

  // tracage des ecrans
  useEffect(() => {
    if (!pathname) return;
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;

    console.log("📍 screen_view:", pathname);

    analytics().logScreenView({
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname]);

  // tracking des ouvertures quotidiennes
  useEffect(() => {
    (async () => {
      await trackDailyOpen();
    })();
  }, []);

  // configuration des notifications
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }, []);

  // ecoute les notification et log
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Notif reçue en foreground:", remoteMessage);
    });

    return unsubscribe;
  }, []);

  // configuation des notifications
  useEffect(() => {
    handleNotificationNavigation(
      queryClient,
      setIsAppNotificationClosed,
      setIsAppNotificationBackground,
      currentUser?.uid,
    );
  }, []);

  // se connecter au channel de notification
  useEffect(() => {
    (async () => {
      await subscribeToGeneralTopic();
      if (userId) await subscribeToUserTopic(userId);
    })();
  }, []);

  // configuation de la connexion par google
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  // prefetch des donnees des differentes pages
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
