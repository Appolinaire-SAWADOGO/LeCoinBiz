import { Facebook, Mail, MessageCircle } from "lucide-react-native";
import React from "react";
import SettingElement from "../SettingElement";
import SettingsSectionContainer from "../SettingSectionContainer";

export default function SettingContactSection() {
  return (
    <>
      <SettingsSectionContainer title=" Contact">
        <SettingElement
          Icon={Mail}
          color="#7D5AFC"
          fill="none"
          label="Nous contacter par e-mail"
        />
        <SettingElement
          Icon={MessageCircle}
          color="#2BB741"
          label="Nous contacter sur WhatsApp"
        />
        <SettingElement
          Icon={Facebook}
          color="#1877F2"
          label="Nous suivre sur Facebook"
        />
      </SettingsSectionContainer>
    </>
  );
}
