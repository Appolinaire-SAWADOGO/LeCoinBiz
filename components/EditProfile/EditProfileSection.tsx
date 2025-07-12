import React from "react";
import { View } from "react-native";
import AppInput from "../custom/AppInput";
import AppText from "../custom/AppText";

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
