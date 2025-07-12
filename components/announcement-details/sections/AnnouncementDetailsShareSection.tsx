import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, Share, StyleSheet, View } from "react-native";
import AnnouncementDetailsShareElmtCard from "../AnnouncementDetailsShareElmtCard";

export default function AnnouncementDetailsShareSection() {
  const { designSystem } = useAppTheme();
  const shareLink = async () => {
    try {
      await Share.share({
        message:
          "Découvrez cette annonce incroyable : https://example.com/annonce/123",
      });
    } catch {
      Alert.alert("Erreur", "Impossible de partager l'annonce.");
    }
  };

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync("https://example.com/annonce/123");
      Alert.alert("Lien copié", "Le lien de l'annonce a été copié.");
    } catch {
      Alert.alert("Erreur", "Impossible de copier le lien.");
    }
  };
  return (
    <View style={styles.container}>
      <AppText
        color={designSystem.colors.bigText}
        fontSize={16}
        font="Bold"
        style={styles.title}
      >
        Partager cette annonce
      </AppText>

      <View style={styles.buttonRow}>
        {/* <TouchableOpacity style={styles.button} onPress={shareLink}>
          <Share2 strokeWidth={2} size={22} />
          <AppText style={styles.buttonText}>Partager</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={copyLink}>
          <Copy strokeWidth={2} size={22} />
          <AppText style={styles.buttonText}>Copier lien</AppText>
        </TouchableOpacity> */}

        <AnnouncementDetailsShareElmtCard label="facebook" />
        <AnnouncementDetailsShareElmtCard label="twitter" />
        <AnnouncementDetailsShareElmtCard label="whatsapp" />
        <AnnouncementDetailsShareElmtCard label="copyLink" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.02)",
    // borderRadius: 8,
    // borderWidth: 1,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
  },
  button: {
    // backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  buttonText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
});
