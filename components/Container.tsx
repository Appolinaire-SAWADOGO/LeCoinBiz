import { useNetworkStore } from "@/store/useNetworkStore";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoInternet from "./NoInternet";
import TopBottomBackground from "./TopBottomBackground";

export default function Container({
  children,
  style,
  withBottom = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  withBottom?: boolean;
}) {
  const { isConnected } = useNetworkStore();
  // const { designSystem } = useAppTheme();
  // const [isLoading, setIsLoading] = React.useState(true);

  // useEffect(() => {
  //   const runChecks = async () => {
  //     const isConnected = ifUserIsConnected();

  //     if (!isConnected) {
  //       router.push("/(root)/(auth)/Index");
  //       return;
  //     }

  //     const hasUsername = await checkIfUserNameIsAdded();

  //     if (!hasUsername) {
  //       router.push("/(root)/(auth)/AddYourUsername");
  //       return;
  //     }

  //     setIsLoading(false); // Tout est bon, on peut afficher
  //   };

  //   if (mandatoryLogin) {
  //     runChecks();
  //   }
  // }, [mandatoryLogin]);

  // if (mandatoryLogin && isLoading)
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "#fff",
  //       }}
  //     >
  //       <ActivityIndicator size={"large"} color={designSystem.colors.primary} />
  //     </View>
  //   );
  // else
  return (
    <SafeAreaView
      edges={["top", withBottom ? "bottom" : "top"]}
      style={[
        {
          flex: 1,
          backgroundColor: "#fff",
          borderTopLeftRadius: withBottom ? 10 : 0,
          borderTopRightRadius: withBottom ? 10 : 0,
        },
        style,
      ]}
    >
      {isConnected ? (
        <>{children}</>
      ) : (
        <>
          <TopBottomBackground withBottom={false} bgColor={"#fff"} />
          <NoInternet />
        </>
      )}
    </SafeAreaView>
  );
}
