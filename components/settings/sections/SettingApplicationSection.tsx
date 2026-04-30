import { router } from "expo-router";
import React from "react";
import { Share } from "react-native";
import SettingElement from "../SettingElement";
import SettingsSectionContainer from "../SettingSectionContainer";
import SettingsEvaluateAppModal from "../SettingsEvaluateAppModal";
import SettingsNotifications from "../SettingsNotifications";

export default function SettingApplicationSection() {
  const [isEvaluatedModalOpen, setIsEvaluatedModalOpen] = React.useState(false);

  return (
    <>
      <SettingsSectionContainer title="Application">
        <SettingElement
          disabled
          icon="bell-ring"
          color="#F84F31"
          label="Notifications"
        >
          <SettingsNotifications />
        </SettingElement>
        <SettingElement
          icon="star"
          color="#E7AA3D"
          size={20}
          label="Évaluez notre application"
          onClick={() => setIsEvaluatedModalOpen(true)}
        >
          <SettingsEvaluateAppModal
            isEvaluatedModalOpen={isEvaluatedModalOpen}
            setIsEvaluatedModalOpen={setIsEvaluatedModalOpen}
          />
        </SettingElement>
        <SettingElement
          icon="alert-circle"
          color="#25B7D3"
          fill="none"
          label="À propos de nous"
          onClick={() => router.navigate("/(root)/(settings)/About")}
        />
        <SettingElement
          icon="share-variant"
          color="#25B7D3"
          label="Partager l'application à un ami"
          onClick={async () => {
            try {
              await Share.share({
                message:
                  "https://play.google.com/store/apps/details?id=com.appolinaire_sdg.LeCoinBiz&pcampaignid=web_share",
              });
            } catch (error) {
              console.log("Error sharing:", error);
            }
          }}
        />
      </SettingsSectionContainer>
    </>
  );
}
