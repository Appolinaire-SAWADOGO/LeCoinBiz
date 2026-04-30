import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIconsNameType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../custom/AppText";

export default function AnnouncementDetailsFloatingButtonsCard({
  useCase,
  onPress,
}: {
  useCase:
    | "watsApp"
    | "sms"
    | "call"
    | "edit"
    | "disable"
    | "enable"
    | "delete";
  onPress?: () => void;
}) {
  const { designSystem } = useAppTheme();

  const ButtonName = {
    watsApp: "whatsapp",
    sms: "message-text-outline",
    call: "phone-outline",
    edit: "pencil-outline",
    disable: "eye-off-outline",
    enable: "eye-outline",
    delete: "trash-can-outline",
  }[useCase];

  const ButtonText = {
    watsApp: "WhatsApp",
    sms: "SMS",
    call: "Appeler",
    edit: "Modifier",
    disable: "Désactiver",
    enable: "Activer",
    delete: "Supprimer",
  }[useCase];

  const getBackgroundColor = () => {
    switch (useCase) {
      case "watsApp":
        return designSystem.colors.primary;
      case "sms":
        return designSystem.colors.primary;
      case "call":
        return designSystem.colors.primary;
      case "edit":
        return designSystem.colors.primary;
      case "disable":
        return designSystem.colors.primary;
      case "enable":
        return designSystem.colors.primary;
      case "delete":
        return designSystem.colors.primary;
      default:
        return designSystem.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
    >
      {/* button icon */}
      <MaterialCommunityIcons
        name={ButtonName as MaterialCommunityIconsNameType}
        size={20}
        color="#fff"
      />

      <AppText font="Medium" style={styles.buttonText}>
        {ButtonText}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 3,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
  },
});
