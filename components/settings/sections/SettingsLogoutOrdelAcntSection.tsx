import AppText from "@/components/custom/AppText";
import { useSignOut } from "@/hooks/services/auth/signIn/useSignOut";
// import { useSignOut } from "@/hooks/services/auth/signIn/useSignOut";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function SettingsLogoutOrdelAcntSection() {
  const { designSystem } = useAppTheme();

  const { disconnect } = useSignOut();

  return (
    <View
      style={{
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <TouchableOpacity onPress={disconnect}>
        <AppText font="Medium" fontSize={15}>
          se deconnecter
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity>
        <AppText
          font="Medium"
          fontSize={15}
          color={designSystem.colors.subText}
        >
          Supprimez votre compte
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
