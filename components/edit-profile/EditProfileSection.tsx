import React from "react";
import { KeyboardTypeOptions, StyleProp, TextStyle, View } from "react-native";
import AppText from "../custom/AppText";
import AppInput from "../custom/input/AppInput";

export default function EditProfileSection({
  label,
  placeHolder,
  children,
  value,
  onChange,
  onSubmitEditing,
  keyboardType,
  errorMsg,
  style,
}: {
  label: string;
  placeHolder?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: (text: string) => void;
  onSubmitEditing?: () => void;
  keyboardType?: KeyboardTypeOptions;
  errorMsg?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <View style={{ gap: 8, flex: 1 }}>
      <AppText font="Medium">{label}</AppText>

      <AppInput
        placeholder={placeHolder!}
        style={[
          {
            height: 48,
            borderWidth: 0,
            borderBottomWidth: 1,
            paddingHorizontal: 0,
          },
          style,
        ]}
        model="withBorder"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
      />

      {errorMsg !== "" && (
        <AppText style={{ color: "red" }}>{errorMsg}</AppText>
      )}

      {children && children}
    </View>
  );
}
