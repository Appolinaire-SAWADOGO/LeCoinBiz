import { router } from "expo-router";
import { ShieldAlert } from "lucide-react-native";
import React from "react";
import SettingElement from "../SettingElement";
import SettingSectionContainer from "../SettingSectionContainer";

export default function SettingSecuritySection() {
  return (
    <SettingSectionContainer title="Sécurité">
      <SettingElement
        Icon={ShieldAlert}
        color="#DC3545"
        fill="none"
        label="Conseils de sécurité"
        onClick={() => router.push("/(root)/(settings)/SecurityTips")}
      />
    </SettingSectionContainer>
  );
}
