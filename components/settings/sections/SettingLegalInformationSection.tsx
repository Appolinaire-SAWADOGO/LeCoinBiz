import { router } from "expo-router";
import { FileText, LayoutList, ShieldCheck } from "lucide-react-native";
import React from "react";
import SettingElement from "../SettingElement";
import SettingsSectionContainer from "../SettingSectionContainer";

export default function SettingLegalInformationSection() {
  return (
    <SettingsSectionContainer title="Légale">
      <SettingElement
        Icon={FileText}
        color="#6C757D"
        fill="none"
        label="Conditions générales d'utilisation"
        onClick={() => router.push("/(root)/(settings)/TermsOfUs")}
      />
      <SettingElement
        Icon={ShieldCheck}
        color="#0CA789"
        fill="none"
        label="Politique de confidentialité"
        onClick={() => router.push("/(root)/(settings)/PrivacyPolicy")}
      />
      <SettingElement
        Icon={LayoutList}
        color="#FF8C42"
        fill="none"
        label="Règles de diffusion"
        onClick={() => router.push("/(root)/(settings)/PostingRules")}
      />
    </SettingsSectionContainer>
  );
}
