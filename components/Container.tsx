import { useBackPress } from "@/hooks/useBackPress";
import { useNetworkStore } from "@/store/useNetworkStore";
import { router } from "expo-router";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoInternet from "./NoInternet";
import TopBottomBackground from "./TopBottomBackground";

export default function Container({
  children,
  style,
  withBottom = true,
  withGoBack = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  withBottom?: boolean;
  withGoBack?: boolean;
}) {
  const { isConnected } = useNetworkStore();

  useBackPress(() => {
    if (withGoBack) router.back();
    return;
  });

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
