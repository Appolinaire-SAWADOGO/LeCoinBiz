import { router } from "expo-router";
import React from "react";
import SettingElement from "../SettingElement";
import SettingSectionContainer from "../SettingSectionContainer";

export default function SettingSecuritySection() {
  return (
    <SettingSectionContainer title="Sécurité">
      <SettingElement
        icon="shield-alert"
        color="#DC3545"
        fill="none"
        label="Conseils de sécurité"
        onClick={() => router.navigate("/(root)/(settings)/SecurityTips")}
      />
    </SettingSectionContainer>
  );
}
