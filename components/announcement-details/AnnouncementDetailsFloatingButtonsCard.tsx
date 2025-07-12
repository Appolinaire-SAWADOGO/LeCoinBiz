import WattsAppIcon from "@/assets/images/WattsAppIcon.png";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Image } from "expo-image";
import {
  Edit,
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
}: {
  useCase:
    | "watsApp"
    | "sms"
    | "call"
    | "edit"
    | "disable"
    | "enable"
    | "delete";
}) {
  const { designSystem } = useAppTheme();

  const ButtonIcon = {
    watsApp: undefined,
    sms: MessageSquare,
    call: Phone,
    edit: Edit,
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

  // const ButtonBgColor = {
  //   watsApp: "#2DD54B",
  //   sms: "#00AAFF",
  //   call: "#1976D2", // Bleu communication → OK (conserve)
  //   edit: "#009688", // Vert sarcelle : calme, intuitif pour l'édition
  //   disable: "#B0BEC5", // Gris bleuté clair : désactivé, neutre
  //   enable: "#4CAF50", // Vert classique : activation, validation
  //   delete: "#F44336", // Rouge vif standard : suppression
  // }[useCase];
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: designSystem.colors.primary }]}
    >
      {/* button icon */}
      {useCase === "watsApp" ? (
        <Image source={WattsAppIcon} style={{ height: 20, width: 20 }} />
      ) : (
        <>{ButtonIcon && <ButtonIcon size={20} color="#fff" />}</>
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
    fontSize: 14,
  },
});
