import AppSwitch from "@/components/custom/AppSwitch";
import { router } from "expo-router";
import { BellRing, CircleAlert, Share2, Star } from "lucide-react-native";
import React from "react";
import SettingElement from "../SettingElement";
import SettingsSectionContainer from "../SettingSectionContainer";
import SettingsEvaluateApp from "../SettingsEvaluateApp";

export default function SettingApplicationSection() {
  const [isEvaluatedModalOpen, setIsEvaluatedModalOpen] = React.useState(false);
  return (
    <>
      <SettingsSectionContainer title="Application">
        <SettingElement
          disabled
          Icon={BellRing}
          color="#F84F31"
          label="Notifications"
        >
          <AppSwitch />
        </SettingElement>
        <SettingElement
          Icon={Star}
          color="#E7AA3D"
          label="Évaluez notre application"
          onClick={() => setIsEvaluatedModalOpen(true)}
        >
          <SettingsEvaluateApp
            isOpen={isEvaluatedModalOpen}
            setIsOpen={setIsEvaluatedModalOpen}
          />
        </SettingElement>
        <SettingElement
          Icon={CircleAlert}
          color="#25B7D3"
          fill="none"
          label="À propos de nous"
          onClick={() => router.push("/(root)/(settings)/About")}
        />
        <SettingElement
          Icon={Share2}
          color="#25B7D3"
          label="Partager l'application à un ami"
        />
      </SettingsSectionContainer>
    </>
  );
}
