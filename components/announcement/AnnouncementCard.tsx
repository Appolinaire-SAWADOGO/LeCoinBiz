import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import {
  adbadge,
  boostDateLabelFn,
  getTimeSinceCreated,
  getTimeSinceMs,
  Timestamp,
} from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AddAdFavoriteButton from "../favorites/AddAdFavoriteButton";
import BoostAdModal from "../modals/boost-ad-modal/BoostAdModal";
import ProfileDelOrEdAnnouncement from "../profile/ProfileDelOrEdAnnouncement";

export default function AnnouncementCard({
  useCase = "OtherPage",
  type = "primary",
  createdAt,
  ad,
  openAdId,
  setOpenAdId,
  profileAdsSelectedStatus,
}: {
  useCase?: "OtherPage" | "ProfilePage";
  type?: "similar" | "primary";
  createdAt?: string;
  ad: AnnouncementType;
  openAdId?: string | null;
  setOpenAdId?: (id: string | null) => void;
  profileAdsSelectedStatus: number | null;
}) {
  const { designSystem } = useAppTheme();
  const queryClient = useQueryClient();

  const [boostAdModalOpen, setBoostAdModalOpen] = React.useState(false);

  const isSimilarType = type === "similar";

  const boostDateLabel = boostDateLabelFn(
    ad.boostStatus,
    ad.boostStartAt,
    ad.boostExpiredAt,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        try {
          queryClient.setQueryData(["ad", ad.id], ad);
        } catch (e) {
          // ignore
        }

        router.navigate({
          pathname: "/(root)/(announcement)/AnnouncementDetails",
          params: {
            initialAdId: ad.id,
            from: useCase,
            status: ad.status,
            profileAdsSelectedStatus,
          },
        });
      }}
      style={[styles.card, { width: isSimilarType ? 170 : "100%" }]}
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
        <AddAdFavoriteButton adId={ad?.id as string} ad={ad} />
      )}

      {/* announcement image */}
      <Image source={{ uri: ad?.images[0] }} style={styles.image} />

      {adbadge(
        designSystem.colors.primary,
        useCase,
        profileAdsSelectedStatus === 0,
        ad?.boostStatus,
      ).map((state, index) => {
        if (!state.active) return;

        return (
          <View
            style={[styles.boostBadge, { backgroundColor: state.color }]}
            key={index}
          >
            <View style={styles.boostBadgeTopRow}>
              <MaterialCommunityIcons
                name={state.icon as any}
                size={12}
                color="#fff"
              />
              <AppText fontSize={11} font="Bold" color="#fff" numberOfLines={1}>
                {state.text}
              </AppText>
            </View>

            {useCase === "ProfilePage" &&
              profileAdsSelectedStatus === 0 &&
              boostDateLabel && (
                <AppText
                  fontSize={9}
                  font="Medium"
                  color="#fff"
                  numberOfLines={1}
                  style={styles.boostBadgeDate}
                >
                  {boostDateLabel}
                </AppText>
              )}
          </View>
        );
      })}

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
          <MaterialCommunityIcons
            name="map-marker-outline"
            color="#888"
            size={16}
          />
          <AppText fontSize={12} color={designSystem.colors.subText}>
            {ad?.city}
          </AppText>
        </View>

        {/* Clicks */}
        {useCase === "ProfilePage" && (
          <View style={styles.viewsRow}>
            <MaterialCommunityIcons name="eye-outline" color="#888" size={16} />
            <AppText fontSize={12} color={designSystem.colors.subText}>
              {ad?.stats.clicks} Vues
            </AppText>
          </View>
        )}

        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="clock-outline" color="#888" size={16} />
          <AppText
            style={{ flexShrink: 1 }}
            fontSize={12}
            color={designSystem.colors.subText}
          >
            {getTimeSinceCreated(ad?.createdAt as Timestamp) ||
              getTimeSinceMs(ad?.createdAt as unknown as number)}
          </AppText>
        </View>

        {/* Bouton Booster (ProfilePage uniquement) */}
        {useCase === "ProfilePage" &&
          profileAdsSelectedStatus === 0 &&
          (!ad.boostStatus || ad.boostStatus === "expired") && (
            <TouchableOpacity
              style={[
                styles.boostButton,
                { backgroundColor: designSystem.colors.primary },
              ]}
              onPress={(e) => {
                e.stopPropagation(); // évite d'ouvrir le détail de l'annonce en même temps
                setBoostAdModalOpen(true);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={14}
                color="#fff"
              />
              <AppText fontSize={12} font="Bold" color="#fff">
                Booster
              </AppText>
            </TouchableOpacity>
          )}

        <BoostAdModal
          isOpen={boostAdModalOpen}
          onClose={() => setBoostAdModalOpen(false)}
          ad={{
            id: ad.id,
            userId: ad.userId,
            title: ad.title,
            boostStatus: ad.boostStatus,
            price: ad.price,
            imageUrl: ad.images[0],
          }}
        />
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
  boostButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },

  boostBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    maxWidth: 130,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    zIndex: 10,
  },
  boostBadgeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  boostBadgeDate: {
    marginTop: 2,
    opacity: 0.9,
  },
});
