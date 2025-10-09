import React from "react";
import { View } from "react-native";
import AppText from "../custom/AppText";
import AppInput from "../custom/input/AppInput";

export default function EditProfileSection({
  label,
  placeHolder,
  children,
}: {
  label: string;
  placeHolder?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      <AppText font="Medium" fontSize={15}>
        {label}
      </AppText>
      {children ? (
        children
      ) : (
        <AppInput
          placeholder={placeHolder!}
          style={{ height: 48 }}
          model="withBorder"
        />
      )}
    </View>
  );
}
