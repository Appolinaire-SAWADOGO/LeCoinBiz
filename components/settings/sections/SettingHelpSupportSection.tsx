import { router } from "expo-router";
import { CircleHelp } from "lucide-react-native";
import React from "react";
import SettingElement from "../SettingElement";
import SettingSectionContainer from "../SettingSectionContainer";

export default function SettingHelpSupportSection() {
  return (
    <SettingSectionContainer title="Aide et support">
      <SettingElement
        Icon={CircleHelp}
        color="#4A78FF"
        fill="none"
        label="Comment fonctionne l'application ?"
        onClick={() => router.navigate("/(root)/(settings)/HelpSupport")}
      />
    </SettingSectionContainer>
  );
}
