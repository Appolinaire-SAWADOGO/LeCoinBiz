import { APP_VERION } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import AppText from "../../custom/AppText";

export default function SettingAppVersionSection() {
  const { designSystem } = useAppTheme();

  return (
    <View style={{ paddingBottom: 50 }}>
      <AppText
        fontSize={11}
        font="Medium"
        color={designSystem.colors.subText}
        style={{ alignSelf: "center" }}
      >
        Version {APP_VERION}
      </AppText>
    </View>
  );
}
