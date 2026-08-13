import React from "react";
import {
  Animated,
  Falsy,
  RecursiveArray,
  RegisteredStyle,
  ViewStyle,
} from "react-native";

export default function HeaderHideAnimation({
  scrollY,
  children,
  style,
  headerHeight,
}: {
  scrollY: Animated.Value;
  style?:
    | false
    | ""
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | RegisteredStyle<ViewStyle>
    | Animated.WithAnimatedObject<ViewStyle>
    | Animated.WithAnimatedArray<
        | Falsy
        | ViewStyle
        | RegisteredStyle<ViewStyle>
        | RecursiveArray<Falsy | ViewStyle | RegisteredStyle<ViewStyle>>
        | readonly (Falsy | ViewStyle | RegisteredStyle<ViewStyle>)[]
      >
    | null
    | undefined;
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
