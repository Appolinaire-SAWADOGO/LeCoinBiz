import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleProp, TextStyle, View } from "react-native";
import AppInput from "../custom/AppInput";
import AppText from "../custom/AppText";

export default function PostAnAdSection({
  label,
  placeholder,
  optional = false,
  children,
  style,
}: {
  label: string;
  placeholder?: string;
  optional?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  const { designSystem } = useAppTheme();
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <AppText font="Bold" fontSize={15}>
          {label}
        </AppText>
        {optional && (
          <AppText fontSize={15} color={"#444"}>
            (facultatif)
          </AppText>
        )}
      </View>
      {!children ? (
        <AppInput
          style={[
            {
              height: 48,
              borderWidth: 1,
              borderColor: designSystem.colors.inputBorder,
              backgroundColor: "transparent",
            },
            style,
          ]}
          placeholder={placeholder!}
        />
      ) : (
        children
      )}
    </View>
  );
}
