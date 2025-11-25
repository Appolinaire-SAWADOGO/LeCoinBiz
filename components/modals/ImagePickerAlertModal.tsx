import { usePickerImageAlertModalStore } from "@/store/usePickerImageAlertModalStore";
import React from "react";
import { View } from "react-native";
import AppText from "../custom/AppText";
import AppCenterModal from "./AppCenterModal";

export default function ImagePickerAlertModal() {
  const { close, isOpen, alertMsg } = usePickerImageAlertModalStore();

  return (
    <AppCenterModal
      isOpen={isOpen}
      setIsOpen={close}
      title="Alerte"
      submitText="Ok"
      footerStyle={{ justifyContent: "center" }}
      onSubmit={close}
      withCancelButton={false}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
        }}
      >
        <AppText
          style={{
            fontSize: 16,
            lineHeight: 22,
            color: "#333",
          }}
        >
          {alertMsg}
        </AppText>
      </View>
    </AppCenterModal>
  );
}
