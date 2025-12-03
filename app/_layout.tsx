import AddYourUsernameModal from "@/components/auth/AddYourUsernameModal";
import AuthModal from "@/components/auth/AuthModal";
import AppToast from "@/components/custom/AppToast";
import ImagePickerAlertModal from "@/components/modals/ImagePickerAlertModal";
import { SplashScreenController } from "@/components/splash-screen/SplashScreenController";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NotificationProvider } from "@/context/NotificationContext";
import "@/global.css";
import { useNetworkStore } from "@/store/useNetworkStore";
import { setupSync } from "@/utils/algolia/algoliaSync";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const queryClient = new QueryClient();
  const insets = useSafeAreaInsets();
  const initNetworkListener = useNetworkStore();

  const [fontsLoaded] = useFonts({
    "BasisGrotesqueArabicPro-Black": require("../assets/fonts/BasisGrotesqueArabicPro-Black.ttf"),
    "BasisGrotesqueArabicPro-Bold": require("../assets/fonts/BasisGrotesqueArabicPro-Bold.ttf"),
    "BasisGrotesqueArabicPro-Light": require("../assets/fonts/BasisGrotesqueArabicPro-Light.ttf"),
    "BasisGrotesqueArabicPro-Medium": require("../assets/fonts/BasisGrotesqueArabicPro-Medium.ttf"),
    "BasisGrotesqueArabicPro-Regular": require("../assets/fonts/BasisGrotesqueArabicPro-Regular.ttf"),
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    initNetworkListener.initNetwokListener();
  }, [initNetworkListener]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initSync = async () => {
      try {
        unsubscribe = await setupSync();
        console.log("🚀 Synchronisation Algolia activée");
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
      }
    };

    initSync();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("🛑 Synchronisation Algolia arrêtée");
      }
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <SplashScreenController />

        <GluestackUIProvider mode="light">
          <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <ExpoStatusBar style="dark" />

              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(root)" />
              </Stack>

              <AuthModal />
              <AddYourUsernameModal />
              <ImagePickerAlertModal />

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
      </QueryClientProvider>
    </NotificationProvider>
  );
}

// import { useCallback, useEffect, useState } from 'react';
// import {View } from 'react-native';
// import Entypo from '@expo/vector-icons/Entypo';
// import * as SplashScreen from 'expo-splash-screen';
// import * as Font from 'expo-font';
// import {Stack} from "expo-router";
//
// // Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();
//
// // Set the animation options. This is optional.
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });
//
// export default function RootLayout() {
//   const [appIsReady, setAppIsReady] = useState(false);
//
//   useEffect(() => {
//     async function prepare() {
//       try {
//         // Pre-load fonts, make any API calls you need to do here
//         await Font.loadAsync(Entypo.font);
//         // Artificially delay for two seconds to simulate a slow loading
//         // experience. Remove this if you copy and paste the code!
//         await new Promise(resolve => setTimeout(resolve, 2000));
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         // Tell the application to render
//         setAppIsReady(true);
//       }
//     }
//
//     prepare();
//   }, []);
//
//   const onLayoutRootView = useCallback(() => {
//     if (appIsReady) {
//       // This tells the splash screen to hide immediately! If we call this after
//       // `setAppIsReady`, then we may see a blank screen while the app is
//       // loading its initial state and rendering its first pixels. So instead,
//       // we hide the splash screen once we know the root view has already
//       // performed layout.
//       SplashScreen.hide();
//     }
//   }, [appIsReady]);
//
//   if (!appIsReady) {
//     return null;
//   }
//
//   return (
//       <View
//           onLayout={onLayoutRootView}>
//         <Stack />
//       </View>
//   );
// }
