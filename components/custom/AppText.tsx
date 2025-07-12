import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

export default function AppText({
  font,
  fontSize,
  color,
  children,
  style,
}: {
  font?: "Black" | "Bold" | "Light" | "Medium" | "Regular";
  fontSize?: number;
  color?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        {
          fontFamily: font
            ? `BasisGrotesqueArabicPro-${font}`
            : "BasisGrotesqueArabicPro-Regular",
          fontSize: fontSize,
          color: color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
