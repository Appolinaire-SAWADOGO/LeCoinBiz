import { showToast } from "@/utils";
import React from "react";
import { Linking, View } from "react-native";
import AppRate from "../custom/AppRate";
import AppCenterModal from "../modals/AppCenterModal";

export default function SettingsEvaluateAppModal({
  isEvaluatedModalOpen,
  setIsEvaluatedModalOpen,
}: {
  isEvaluatedModalOpen: boolean;
  setIsEvaluatedModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [rating, setRating] = React.useState(0);

  const openPlayStoreReview = () => {
    const packageName = "com.appolinaire_sdg.LeCoinBiz";

    const playStoreUrl = `market://details?id=${packageName}`;

    Linking.canOpenURL(playStoreUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(playStoreUrl);
        } else {
          const webUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) =>
        console.error("Erreur lors de l'ouverture du Play Store:", err),
      );
  };

  return (
    <AppCenterModal
      isOpen={isEvaluatedModalOpen}
      setIsOpen={setIsEvaluatedModalOpen}
      title="Évaluer notre application"
      submitText="Envoyer"
      footerStyle={{ justifyContent: "center" }}
      onSubmit={async () => {
        if (rating >= 3) {
          openPlayStoreReview();
        } else {
          setRating(0);
          setIsEvaluatedModalOpen(false);
          showToast("success", "Merci pour votre avis !", 40);
        }
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
        }}
      >
        <AppRate setRating={setRating} rating={rating} />
      </View>
    </AppCenterModal>
  );
}
