import React from "react";
import { View } from "react-native";
import AppRate from "../custom/AppRate";
import AppCenterModal from "../modals/AppCenterModal";

export default function SettingsEvaluateAppModal() {
  const [isEvaluatedModalOpen, setIsEvaluatedModalOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);

  return (
    <AppCenterModal
      isOpen={isEvaluatedModalOpen}
      setIsOpen={setIsEvaluatedModalOpen}
      title="Évaluer notre application"
      submitText="Envoyer"
      footerStyle={{ justifyContent: "center" }}
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
