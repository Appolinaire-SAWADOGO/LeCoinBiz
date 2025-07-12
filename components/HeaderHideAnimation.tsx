import { Animated, ViewStyle, StyleProp } from "react-native";
import React from "react";

export default function HeaderHideAnimation({
  scrollY,
  children,
  style,
  headerHeight,
}: {
  scrollY: Animated.Value;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  headerHeight: number;
}) {
  const diffClamb = Animated.diffClamp(scrollY, 0, headerHeight);
  const translateY = diffClamb.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          zIndex: 100,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
