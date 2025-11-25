import React from "react";
import { KeyboardTypeOptions, View } from "react-native";
import AppText from "../custom/AppText";
import AppInput from "../custom/input/AppInput";

export default function EditProfileSection({
  label,
  placeHolder,
  children,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  placeHolder?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <View style={{ gap: 8 }}>
      <AppText font="Medium" fontSize={15}>
        {label}
      </AppText>

      <AppInput
        placeholder={placeHolder!}
        style={{ height: 48 }}
        model="withBorder"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />

      {children && children}
    </View>
  );
}
