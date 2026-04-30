import { router } from "expo-router";
import React from "react";
import SettingElement from "../SettingElement";
import SettingsSectionContainer from "../SettingSectionContainer";

export default function SettingLegalInformationSection() {
  return (
    <SettingsSectionContainer title="Légale">
      <SettingElement
        icon="file-document"
        color="#6C757D"
        fill="none"
        label="Conditions générales d'utilisation"
        onClick={() => router.navigate("/(root)/(settings)/TermsOfUs")}
      />
      <SettingElement
        icon="shield-check"
        color="#0CA789"
        fill="none"
        label="Politique de confidentialité"
        onClick={() => router.navigate("/(root)/(settings)/PrivacyPolicy")}
      />
      <SettingElement
        icon="format-list-bulleted-square"
        color="#FF8C42"
        fill="none"
        label="Règles de diffusion"
        onClick={() => router.navigate("/(root)/(settings)/PostingRules")}
      />
    </SettingsSectionContainer>
  );
}
