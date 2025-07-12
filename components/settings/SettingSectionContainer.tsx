import { ViewStyle } from "@expo/html-elements/build/primitives/View";
import React from "react";
import { StyleProp, StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

export default function SettingSectionContainer({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <>
      <AppText font="Medium" fontSize={16} style={{ marginBottom: 8 }}>
        {title}
      </AppText>
      <View style={[styles.settingElements, style]}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  settingElements: {
    paddingTop: 10,
    marginBottom: 24,
  },
});
