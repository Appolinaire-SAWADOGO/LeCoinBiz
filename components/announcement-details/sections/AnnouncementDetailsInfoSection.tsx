import { subCategoryIcon } from "@/constants/categories";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import { adbadge, boostDateLabelFn, getTimeSinceCreated } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsInfoSection({
  currentAnnouncement,
  from,
  profileAdsSelectedStatus,
}: {
  currentAnnouncement: AnnouncementType;
  from: "OtherPage" | "ProfilePage";
  profileAdsSelectedStatus: string | null;
}) {
  const { designSystem } = useAppTheme();

  const options = currentAnnouncement.options ?? [];

  const isNew =
    options.some((option) => option.label === "Neuf" && option.active) ?? false;

  const isFreeDelivery =
    options.some(
      (option) => option.label === "Livraison Gratuite" && option.active,
    ) ?? false;

  const boostDateLabel = boostDateLabelFn(
    currentAnnouncement.boostStatus,
    currentAnnouncement.boostStartAt,
    currentAnnouncement.boostExpiredAt,
  );

  return (
    <>
      {/* Titre et prix et badge */}
      <View style={{ marginTop: 5 }}>
        {adbadge(
          designSystem.colors.primary,
          from,
          profileAdsSelectedStatus === "0",
          currentAnnouncement.boostStatus,
        ).map((state, index) => {
          if (!state.active) return;

          return (
            <View
              key={index}
              style={[
                styles.boostBadgeInline,
                { backgroundColor: state.color },
              ]}
            >
              <MaterialCommunityIcons
                name={state.icon as any}
                size={12}
                color="#fff"
              />
              <AppText fontSize={11} font="Bold" color="#fff">
                {state.text}
              </AppText>

              {from === "ProfilePage" &&
                boostDateLabel &&
                profileAdsSelectedStatus === "0" && (
                  <AppText fontSize={11} font={"Bold"} color={"#fff"}>
                    - {boostDateLabel}
                  </AppText>
                )}
            </View>
          );
        })}

        <AppText
          font="Bold"
          color={designSystem.colors.primary}
          style={styles.price}
        >
          {Number(currentAnnouncement.price).toLocaleString("fr-FR")} FCFA
        </AppText>
        <AppText font="Medium" style={styles.title}>
          {currentAnnouncement.title}
        </AppText>
      </View>

      {/* produit options */}
      <View style={styles.productOptions}>
        {isFreeDelivery && (
          <View style={styles.tagWrapper}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="package-variant-closed" size={18} />
              <AppText>Livraison gratuite</AppText>
            </View>
          </View>
        )}

        {isNew && (
          <View style={styles.tagWrapper}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="new-box" size={18} />
              <AppText>Neuf</AppText>
            </View>
          </View>
        )}
      </View>

      {/* categorie et sous categorie */}
      {currentAnnouncement.category && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          <MaterialCommunityIcons
            name={subCategoryIcon(currentAnnouncement.subCategory)}
            size={18}
          />
          <AppText numberOfLines={1} style={{ flexShrink: 1 }}>
            {currentAnnouncement.category} › {currentAnnouncement.subCategory}
          </AppText>
        </View>
      )}

      {/* location */}
      <View style={styles.location}>
        <MaterialCommunityIcons name="map-marker-outline" size={18} />
        <AppText style={styles.locationText}>
          {currentAnnouncement.city}
        </AppText>
      </View>

      {/* Clicks */}
      {from === "ProfilePage" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 12,
          }}
        >
          <MaterialCommunityIcons name="eye-outline" size={18} />
          <AppText>{currentAnnouncement.stats?.clicks ?? 0} Vues</AppText>
        </View>
      )}

      {/* time  */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginTop: 12,
        }}
      >
        <MaterialCommunityIcons name="clock-outline" size={18} />
        <AppText>
          {currentAnnouncement.createdAt
            ? getTimeSinceCreated(currentAnnouncement.createdAt)
            : "Date indisponible"}
        </AppText>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <AppText
          font="Medium"
          color={designSystem.colors.bigText}
          style={styles.sectionTitle}
        >
          Description
        </AppText>
        <AppText
          style={styles.descriptionText}
          color={designSystem.colors.subText}
        >
          {currentAnnouncement.description || "Aucune description fournie."}
        </AppText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  price: {
    fontSize: 26,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    color: "#333",
  },
  boostBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  productOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {},
  deliveryTag: {
    flexDirection: "row",
    marginTop: 10,
  },
  tagWrapper: {
    flexDirection: "row",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 2,
    gap: 6,
  },

  tagImage: {
    width: 17,
    height: 17,
  },

  categoryAndSubCategoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  categoryLabel: {
    marginRight: 6,
    color: "#333",
  },
  categoryAndSubCategoryStyle: {
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  locationText: {
    marginLeft: 5,
  },
  descriptionSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
  },
  descriptionText: {
    lineHeight: 20,
  },
});
