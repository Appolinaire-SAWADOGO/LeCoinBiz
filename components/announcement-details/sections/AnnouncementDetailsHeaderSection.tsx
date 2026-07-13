import AddAdFavoriteButton from "@/components/favorites/AddAdFavoriteButton";
import PageHeader from "@/components/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType, AnnouncementType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Share, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnnouncementDetailsHeaderSection({
  from,
  status,
  name,
  adId,
  adTitle,
  ad,
}: {
  from: "OtherPage" | "ProfilePage";
  status?: AdStatusType;
  name?: string;
  adId: string;
  adTitle: string;
  ad: AnnouncementType;
}) {
  const { designSystem } = useAppTheme();

  const adLink = `https://lecoinbiz-e43b7.web.app/annonce/${adId}`;
  const shareMessage = `Découvrez cette annonce sur LeCoinBiz : ${adTitle}\n${adLink}`;

  const shareGeneric = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch {
      Alert.alert("Erreur", "Impossible de partager l'annonce.");
    }
  };

  return (
    <PageHeader
      style={{ paddingHorizontal: 20, paddingTop: 15 }}
      name={name}
      onBack={() => router.navigate("/(tabs)/Home")}
    >
      <View style={styles.rightIcons}>
        {from === "OtherPage" && (
          <AddAdFavoriteButton
            adId={adId}
            ad={ad}
            fromAnnouncementCard={false}
          />
        )}

        {status === "ACTIVATED" && (
          <TouchableOpacity hitSlop={10} onPress={shareGeneric}>
            <MaterialCommunityIcons name={"share-variant-outline"} size={21} />
          </TouchableOpacity>
        )}
      </View>
    </PageHeader>
  );
}

const styles = StyleSheet.create({
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
