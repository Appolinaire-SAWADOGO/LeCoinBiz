import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { KeyboardTypeOptions, StyleProp, TextStyle, View } from "react-native";
import AppText from "../custom/AppText";
import AppInput from "../custom/input/AppInput";

export default function PostAnAdSection({
  label,
  placeholder,
  optional = false,
  children,
  style,
  onChangeText,
  value,
  keyboardType,
  maxLength,
}: {
  label: string;
  placeholder?: string;
  optional?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  onChangeText?: (num: any) => void;
  value?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  maxLength?: number;
}) {
  const { designSystem } = useAppTheme();

  const handleChangeText = (val: string) => {
    if (keyboardType === "numeric") {
      // Ne garde que les chiffres
      const onlyNumbers = val.replace(/[^0-9]/g, "");
      onChangeText?.(Number(onlyNumbers));
    } else {
      onChangeText?.(val);
    }
  };

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
          value={value}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
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
