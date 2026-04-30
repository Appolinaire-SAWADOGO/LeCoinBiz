import { router } from "expo-router";
import React from "react";
import SettingElement from "../SettingElement";
import SettingSectionContainer from "../SettingSectionContainer";

export default function SettingHelpSupportSection() {
  return (
    <SettingSectionContainer title="Aide et support">
      <SettingElement
        icon="help-circle"
        color="#4A78FF"
        size={22}
        fill="none"
        label="Comment fonctionne l'application ?"
        onClick={() => router.navigate("/(root)/(settings)/HelpSupport")}
      />
    </SettingSectionContainer>
  );
}
