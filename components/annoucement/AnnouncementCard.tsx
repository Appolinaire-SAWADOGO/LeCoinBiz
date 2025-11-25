import AppText from "@/components/custom/AppText";
import { getTimeSinceCreated, getTimeSinceMs, Timestamp } from "@/functions";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType, AnnouncementType } from "@/types";
import { router } from "expo-router";
import { Clock3, EllipsisVertical, Eye, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AddAdFavoriteButton from "../favorites/AddAdFavoriteButton";
import ProfileDelOrEdAnnouncement from "../profile/ProfileDelOrEdAnnouncement";

export default function AnnouncementCard({
  useCase = "OtherPage",
  type = "primary",
  createdAt,
  ad,
  openAdId,
  setOpenAdId,
}: {
  useCase?: "OtherPage" | "ProfilePage";
  type?: "similar" | "primary";
  createdAt?: string;
  ad: AnnouncementType;
  openAdId: string | null;
  setOpenAdId: (id: string | null) => void;
}) {
  const { designSystem } = useAppTheme();

  const isSimilarType = type === "similar";
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push(
          `/(root)/(announcement)/AnnouncementDetails?id=${ad?.id}&from=${useCase}${`&status=${ad?.status}`}`,
        )
      }
      style={[styles.card, { width: isSimilarType ? 170 : 152 }]}
    >
      {/*menu*/}
      {useCase === "ProfilePage" && (
        <ProfileDelOrEdAnnouncement
          status={ad.status}
          adId={ad.id}
          ad={ad}
          openAdId={openAdId}
          setOpenAdId={setOpenAdId}
        />
      )}

      {/* Favoris button  */}
      {useCase === "OtherPage" && (
        <AddAdFavoriteButton adId={ad?.id as string} />
      )}

      {/* announcement image */}
      <Image source={{ uri: ad?.images[0] }} style={styles.image} />

      {/* announcement content */}
      <View style={styles.info}>
        {/* Prix */}
        <AppText fontSize={18} font="Bold" color={designSystem.colors.primary}>
          {ad?.price.toLocaleString()} FCFA
        </AppText>

        {/* Titre de l'annonce */}
        <AppText fontSize={13} color={designSystem.colors.bigText}>
          {ad?.title}
        </AppText>

        {/* city */}
        <View style={styles.cityRow}>
          <MapPin size={14} color="#888" />
          <AppText fontSize={12} color={designSystem.colors.subText}>
            {ad?.city}
          </AppText>
        </View>

        {/* Clicks */}
        {useCase === "ProfilePage" && (
          <View style={styles.viewsRow}>
            <Eye size={14} color="#888" />
            <AppText fontSize={12} color={designSystem.colors.subText}>
              {ad?.stats.clicks} Clicks
            </AppText>
          </View>
        )}

        <View style={styles.dateRow}>
          <Clock3 size={14} color="#888" />
          <AppText
            style={{ flexShrink: 1 }}
            fontSize={12}
            color={designSystem.colors.subText}
          >
            {getTimeSinceCreated(ad?.createdAt as Timestamp) ||
              getTimeSinceMs(ad?.createdAt as unknown as number)}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginRight: 16,
  },
  favButton: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, .7)",
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 10,
    gap: 4,
  },

  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  dateRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
});
