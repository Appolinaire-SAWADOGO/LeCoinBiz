import WattsAppIcon from "@/assets/images/WattsAppIcon.png";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Image } from "expo-image";
import {
  Edit3,
  Eye,
  EyeClosed,
  MessageSquare,
  Phone,
  Trash,
} from "lucide-react-native";
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

  const ButtonIcon = {
    watsApp: undefined,
    sms: MessageSquare,
    call: Phone,
    edit: Edit3,
    disable: EyeClosed,
    enable: Eye,
    delete: Trash,
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
      {useCase === "watsApp" ? (
        <Image source={WattsAppIcon} style={{ height: 17, width: 17 }} />
      ) : (
        <>{ButtonIcon && <ButtonIcon size={17} color="#fff" />}</>
      )}

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
