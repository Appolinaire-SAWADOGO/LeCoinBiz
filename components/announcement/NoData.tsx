import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "../custom/AppText";

export default function NoData({
  text,
  style,
}: {
  text: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "50%",
          paddingHorizontal: 20,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        },
        style,
      ]}
    >
      <AppText style={{ textAlign: "center", color: "#555", fontSize: 16 }}>
        {text}
      </AppText>
    </View>
  );
}
