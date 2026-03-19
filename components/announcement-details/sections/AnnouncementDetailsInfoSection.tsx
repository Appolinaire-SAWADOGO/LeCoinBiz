import FreeDeliveryImage from "@/assets/images/filter-options/FreeDelevery.png";
import NeufImage from "@/assets/images/filter-options/Neuf.png";
import { categoryIcon } from "@/constants/categories";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import { getTimeSinceCreated } from "@/utils";
import { Clock4, MapPin } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsInfoSection({
  currentAnnouncement,
  from,
}: {
  currentAnnouncement: AnnouncementType;
  from: "OtherPage" | "ProfilePage";
}) {
  const { designSystem } = useAppTheme();

  const isNew = currentAnnouncement.options.some(
    (option) => option.label === "Neuf" && option.active,
  );

  const isFreeDelivery = currentAnnouncement.options.some(
    (option) => option.label === "Livraison Gratuite" && option.active,
  );

  return (
    <>
      {/* Titre et prix */}
      <View style={{ marginTop: 5 }}>
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
              <Image style={styles.tagImage} source={FreeDeliveryImage} />
              <AppText>Livraison gratuite</AppText>
            </View>
          </View>
        )}

        {isNew && (
          <View style={styles.tagWrapper}>
            <View style={styles.tag}>
              <Image style={styles.tagImage} source={NeufImage} />
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
          <Image
            source={categoryIcon(currentAnnouncement.category)}
            style={{ width: 14, height: 14 }}
            resizeMode="contain"
          />
          <AppText numberOfLines={1} style={{ flexShrink: 1 }}>
            {currentAnnouncement.category} › {currentAnnouncement.subCategory}
          </AppText>
        </View>
      )}

      {/* location */}
      <View style={styles.location}>
        <MapPin size={16} />
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
          <Clock4 width={16} height={16} />
          <AppText>{currentAnnouncement.stats.clicks} Clicks</AppText>
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
        <Clock4 width={16} height={16} />
        <AppText>{getTimeSinceCreated(currentAnnouncement.createdAt)}</AppText>
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
  conditionContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
  },
  conditionTitle: {
    marginBottom: 10,
  },
  conditionList: {
    gap: 8,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  conditionBullet: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  conditionText: {},
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
