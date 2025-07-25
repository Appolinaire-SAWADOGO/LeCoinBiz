import React from "react";
import { View } from "react-native";
import AppText from "../custom/AppText";
import AppCenterModal from "../modals/AppCenterModal";

export default function HomeGoBackMoadal({
  goBackIsModalOpen,
  setGoBackIsModalOpen,
  onSubmit,
}: {
  goBackIsModalOpen: boolean;
  setGoBackIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
}) {
  return (
    <AppCenterModal
      isOpen={goBackIsModalOpen}
      setIsOpen={setGoBackIsModalOpen}
      title="Quitter l'application"
      submitText="Oui"
      footerStyle={{ justifyContent: "center" }}
      onSubmit={() => onSubmit()}
    >
      <View
        style={{
          paddingTop: 10,
        }}
      >
        <AppText fontSize={16}>Voulez-vous vraiment quitter ?</AppText>
      </View>
    </AppCenterModal>
  );
}
