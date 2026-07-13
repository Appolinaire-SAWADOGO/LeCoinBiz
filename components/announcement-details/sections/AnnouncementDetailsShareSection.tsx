import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import AnnouncementDetailsShareElmtCard from "../AnnouncementDetailsShareElmtCard";

export default function AnnouncementDetailsShareSection({
  from,
  adId,
  adTitle,
}: {
  from: string;
  adId: string;
  adTitle: string;
}) {
  const { designSystem } = useAppTheme();

  const adLink = `https://lecoinbiz-e43b7.web.app/annonce/${adId}`;
  const shareMessage = `Découvrez cette annonce sur LeCoinBiz : ${adTitle}\n${adLink}`;

  const shareViaWhatsapp = async () => {
    try {
      const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(
          `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
        );
      }
    } catch {
      Alert.alert("Erreur", "Impossible de partager sur WhatsApp.");
    }
  };

  const shareViaFacebook = async () => {
    try {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adLink)}`;
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erreur", "Impossible de partager sur Facebook.");
    }
  };

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync(adLink);
      Alert.alert("Lien copié", "Le lien de l'annonce a été copié.");
    } catch {
      Alert.alert("Erreur", "Impossible de copier le lien.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { borderBottomWidth: from !== "OtherPage" ? 0 : 1 },
      ]}
    >
      <AppText
        color={designSystem.colors.bigText}
        fontSize={16}
        font="Medium"
        style={styles.title}
      >
        Partager cette annonce
      </AppText>

      <View style={styles.buttonRow}>
        <AnnouncementDetailsShareElmtCard
          label="whatsapp"
          onPress={shareViaWhatsapp}
        />
        <AnnouncementDetailsShareElmtCard
          label="facebook"
          onPress={shareViaFacebook}
        />
        <AnnouncementDetailsShareElmtCard label="copyLink" onPress={copyLink} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderTopWidth: 1,
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
});
