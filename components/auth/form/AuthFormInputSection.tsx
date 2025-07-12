import AppInput from "@/components/custom/AppInput";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import AppMobileNumberInput from "../../custom-app-component/input/AppMobileNumberInput";
import AppPasswordInput from "../../custom-app-component/input/AppPasswordInput";
import AppText from "../../custom/AppText";

export default function AuthFormInputSection({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: "mobile number" | "text" | "password";
}) {
  const { designSystem } = useAppTheme();

  return (
    <View>
      <AppText
        fontSize={12}
        font="Medium"
        color={designSystem.colors.smallText}
        style={{ marginBottom: 8 }}
      >
        {label}
      </AppText>
      {type === "mobile number" && <AppMobileNumberInput />}

      {type === "text" && (
        <AppInput placeholder={placeholder!} model="withBorder" />
      )}

      {type === "password" && <AppPasswordInput placeholder="*****" />}
    </View>
  );
}
