import { useAppTheme } from "@/hooks/useAppTheme";
import { useChangePasswordStore } from "@/store/useChangePasswordModal";
import { breakTextEvery } from "@/utils";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function EditProfilePasswordSection() {
  const { designSystem } = useAppTheme();

  const { open } = useChangePasswordStore();
  return (
    <View style={{ flex: 1 }}>
      <AppText font="Medium">Mot de passe</AppText>

      <View
        style={{
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderColor: designSystem.colors.inputBorder,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <AppText color={designSystem.colors.subText}>
          {breakTextEvery(
            "Vous souhaitez changer votre mot de passe actuel ?",
            21
          )}
        </AppText>

        <TouchableOpacity
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={open}
        >
          <AppText>Changer</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
