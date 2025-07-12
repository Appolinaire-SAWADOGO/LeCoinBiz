import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useNetworkStore } from "@/store/useNetworkStore";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// const statusBarHeight =
//   Platform.OS === "android" ? RNStatusBar.currentHeight || 24 : 0;

export default function RootLayout() {
  const initNetworkListener = useNetworkStore();

  // const { designSystem } = useAppTheme();

  useEffect(() => {
    initNetworkListener.initNetwokListener(); // écoute réseau démarrée une seule fois
  }, [initNetworkListener]);

  const [fontsLoaded] = useFonts({
    "BasisGrotesqueArabicPro-Black": require("../assets/fonts/BasisGrotesqueArabicPro-Black.ttf"),
    "BasisGrotesqueArabicPro-Bold": require("../assets/fonts/BasisGrotesqueArabicPro-Bold.ttf"),
    "BasisGrotesqueArabicPro-Light": require("../assets/fonts/BasisGrotesqueArabicPro-Light.ttf"),
    "BasisGrotesqueArabicPro-Medium": require("../assets/fonts/BasisGrotesqueArabicPro-Medium.ttf"),
    "BasisGrotesqueArabicPro-Regular": require("../assets/fonts/BasisGrotesqueArabicPro-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Patch pour fond de la status bar */}

          {/* <View
            style={{
              height: statusBarHeight,
              backgroundColor: designSystem.colors.primary,
            }}
          /> */}

          {/* <TopBottomBackground withBottom={false} bgColor="rgba(0,0,0,.5)" /> */}

          <ExpoStatusBar style="dark" />

          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaProvider>
    </GluestackUIProvider>
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
