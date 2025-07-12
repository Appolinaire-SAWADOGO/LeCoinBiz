import { useAppTheme } from "@/hooks/useAppTheme";
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
  const { designSystem } = useAppTheme();

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
          <TopBottomBackground
            withBottom={false}
            bgColor={designSystem.colors.primary}
          />
          <NoInternet />
        </>
      )}
    </SafeAreaView>
  );
}
