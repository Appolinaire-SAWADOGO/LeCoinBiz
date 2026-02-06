import { useCurrentUser } from "@/hooks/services/auth/signIn/useCurrentUser";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useNotificationSettingsStore } from "@/store/useNotificationSettingsStore";
import React from "react";
import { Linking, Platform, TouchableOpacity } from "react-native";
import AppSwitch from "../custom/AppSwitch";
import AppText from "../custom/AppText";
import AppCenterModal from "../modals/AppCenterModal";

export default function SettingsNotifications() {
  const userId = useCurrentUser()?.uid;

  const { toggle, enabled, isOpenModal, setIsOpenModal, setEnabled } =
    useNotificationSettingsStore();

  const { designSystem } = useAppTheme();

  const onCancel = () => {
    setIsOpenModal(false);
    setEnabled(false);
  };

  return (
    <>
      <AppCenterModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        title="Notifications désactivées"
        withCancelButton={false}
        withSubmitButton
        submitText="Annuler"
        footerStyle={{ justifyContent: "center" }}
        onSubmit={() => onCancel()}
        onClose={() => onCancel()}
      >
        <AppText>
          Pour recevoir des notifications, vous devez les activer dans les
          paramètres de l'application.
        </AppText>
        <TouchableOpacity
          onPress={async () => {
            onCancel();
            if (Platform.OS === "ios") {
              await Linking.openURL("app-settings:");
            } else {
              await Linking.openSettings();
            }
          }}
        >
          <AppText
            font="Medium"
            color={designSystem.colors.primary}
            style={{ marginTop: 10, textDecorationLine: "underline" }}
          >
            Ouvrir les paramètres
          </AppText>
        </TouchableOpacity>
      </AppCenterModal>

      <AppSwitch
        value={enabled}
        onValueChange={async () => await toggle(!enabled, userId)}
      />
    </>
  );
}
