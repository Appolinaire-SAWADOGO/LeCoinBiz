import FreeDeliveryImage from "@/assets/images/filter-options/FreeDelevery.png";
import NeufImage from "@/assets/images/filter-options/Neuf.png";
import { categoryIcon, subCategoryIcon } from "@/constants/categories";
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
    (option) => option.label === "Neuf" && option.active
  );

  const isFreeDelivery = currentAnnouncement.options.some(
    (option) => option.label === "Livraison Gratuite" && option.active
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
              <AppText color={designSystem.colors.subText}>
                Livraison gratuite
              </AppText>
            </View>
          </View>
        )}

        {isNew && (
          <View style={styles.tagWrapper}>
            <View style={styles.tag}>
              <Image style={styles.tagImage} source={NeufImage} />
              <AppText color={designSystem.colors.subText}>Neuf</AppText>
            </View>
          </View>
        )}
      </View>

      {/* catégorie et sous-catégorie */}
      <View style={styles.categoryAndSubCategoryRow}>
        <View style={styles.categoryAndSubCategoryStyle}>
          <Image
            source={categoryIcon(currentAnnouncement.category)}
            style={{ width: 17, height: 17 }}
            resizeMode="contain"
          />
          <AppText color={designSystem.colors.subText}>
            {currentAnnouncement.category},
          </AppText>
        </View>

        <View style={styles.categoryAndSubCategoryStyle}>
          <View style={styles.categoryAndSubCategoryStyle}>
            <Image
              source={subCategoryIcon(currentAnnouncement.subCategory)}
              style={{ width: 17, height: 17 }}
              resizeMode="contain"
            />
            <AppText color={designSystem.colors.subText}>
              {currentAnnouncement.subCategory}
            </AppText>
          </View>
        </View>
      </View>

      {/* location */}
      <View style={styles.location}>
        <MapPin size={16} color={designSystem.colors.subText} />
        <AppText
          style={styles.locationText}
          color={designSystem.colors.subText}
        >
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
          <Clock4 width={16} height={16} color={designSystem.colors.subText} />
          <AppText color={designSystem.colors.subText}>
            {currentAnnouncement.stats.clicks} Clicks
          </AppText>
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
        <Clock4 width={16} height={16} color={designSystem.colors.subText} />
        <AppText color={designSystem.colors.subText}>
          {getTimeSinceCreated(currentAnnouncement.createdAt)}
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

      {/* condition */}
      <View
        style={[
          styles.conditionContainer,
          { paddingBottom: from === "ProfilePage" ? 20 : 0 },
        ]}
      >
        <AppText
          font="Medium"
          color={designSystem.colors.bigText}
          style={styles.conditionTitle}
        >
          Condition :
        </AppText>

        <View style={styles.conditionList}>
          {currentAnnouncement.conditions.map((condition, index) => (
            <View key={index} style={styles.conditionItem}>
              <View
                style={[
                  styles.conditionBullet,
                  { backgroundColor: designSystem.colors.subText },
                ]}
              />
              <AppText
                style={styles.conditionText}
                color={designSystem.colors.subText}
              >
                {condition}
              </AppText>
            </View>
          ))}
        </View>
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
    width: 18,
    height: 18,
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
