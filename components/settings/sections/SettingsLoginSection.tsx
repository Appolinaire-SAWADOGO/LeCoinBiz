import AppText from "@/components/custom/AppText";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function SettingsLoginSection() {
  const { onOpen: openAuthModal } = useAuthModalStore();

  return (
    <View
      style={{
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <TouchableOpacity onPress={openAuthModal}>
        <AppText font="Medium" fontSize={15}>
          Se connecter
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
