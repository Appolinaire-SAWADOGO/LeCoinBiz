import FreeDeliveryImage from "@/assets/images/filter-options/FreeDelevery.png";
import NeufImage from "@/assets/images/filter-options/Neuf.png";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementsType } from "@/types";
import { Clock4, MapPin } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsInfoSection({
  currentAnnouncement,
  from,
}: {
  currentAnnouncement: AnnouncementsType;
  from: "OtherPage" | "ProfilePage";
}) {
  const { designSystem } = useAppTheme();
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
        <AppText font="Bold" style={styles.title}>
          {currentAnnouncement.name}
        </AppText>
      </View>

      {/* rating */}
      {/* <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={16}
                color={i <= 4 ? "#000" : "#ddd"}
                fill={i <= 4 ? "#000" : "transparent"}
              />
            ))}
          </View>
          <AppText style={styles.ratingText}>4.8 (étoiles)</AppText>
        </View>
      </View> */}

      {/* produit options */}
      <View style={styles.productOptions}>
        <View style={styles.tagWrapper}>
          <View style={styles.tag}>
            <Image style={styles.tagImage} source={FreeDeliveryImage} />
            <AppText fontSize={14} color="#333" font="Medium">
              Livraison gratuite
            </AppText>
          </View>
        </View>

        <View style={styles.tagWrapper}>
          <View style={styles.tag}>
            <Image style={styles.tagImage} source={NeufImage} />
            <AppText fontSize={14} color="#333" font="Medium">
              Neuf
            </AppText>
          </View>
        </View>
      </View>

      {/* catégorie */}
      <View style={styles.categoryRow}>
        <AppText fontSize={14} font="Bold" style={styles.categoryLabel}>
          Catégorie :
        </AppText>
        <AppText fontSize={14} style={styles.categoryValue}>
          Téléphone
        </AppText>
      </View>

      {/* location */}
      <View style={styles.location}>
        <MapPin size={16} />
        <AppText style={styles.locationText}>
          {currentAnnouncement.location.city},{" "}
          {currentAnnouncement.location.pays}
        </AppText>
      </View>

      {/* Vues */}
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
          <AppText style={{ fontSize: 14 }}>120 vues</AppText>
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
        <AppText style={{ fontSize: 14 }}>Il y a 2 jours</AppText>
      </View>

      {/* Spécifications */}
      <View style={styles.conditionContainer}>
        <AppText
          font="Bold"
          color={designSystem.colors.bigText}
          style={styles.conditionTitle}
        >
          Condition :
        </AppText>

        <View style={styles.conditionList}>
          <View style={styles.conditionItem}>
            <View
              style={[styles.conditionBullet, { backgroundColor: "#000" }]}
            />
            <AppText style={styles.conditionText}>
              Neuf - Jamais utilisé
            </AppText>
          </View>

          <View style={styles.conditionItem}>
            <View
              style={[styles.conditionBullet, { backgroundColor: "#000" }]}
            />
            <AppText style={styles.conditionText}>
              Comme neuf - Très peu utilisé
            </AppText>
          </View>

          <View style={styles.conditionItem}>
            <View
              style={[styles.conditionBullet, { backgroundColor: "#000" }]}
            />
            <AppText style={styles.conditionText}>
              Très bon état - Légères traces
            </AppText>
          </View>

          <View style={styles.conditionItem}>
            <View
              style={[styles.conditionBullet, { backgroundColor: "#000" }]}
            />
            <AppText style={styles.conditionText}>
              Bon état - Usure visible
            </AppText>
          </View>

          <View style={styles.conditionItem}>
            <View
              style={[styles.conditionBullet, { backgroundColor: "#000" }]}
            />
            <AppText style={styles.conditionText}>
              État correct - Fonctionnel mais usé
            </AppText>
          </View>

          <View style={styles.conditionItem}>
            <View
              style={[styles.conditionBullet, { backgroundColor: "#000" }]}
            />
            <AppText style={styles.conditionText}>
              Pour pièces - Défectueux/incomplet
            </AppText>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <AppText
          font="Bold"
          color={designSystem.colors.bigText}
          style={styles.sectionTitle}
        >
          Description
        </AppText>
        <AppText style={styles.descriptionText}>
          {currentAnnouncement.description || "Aucune description fournie."}
        </AppText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  price: {
    fontSize: 26, // grand et visible
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
  ratingText: {
    fontSize: 13,
  },
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

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  categoryLabel: {
    fontSize: 14,
    marginRight: 6,
    color: "#333",
  },
  categoryValue: {
    fontSize: 14,
    color: "#000",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 5,
  },
  conditionContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  conditionTitle: {
    fontSize: 16,
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
    width: 6,
    height: 6,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 14,
  },
  descriptionSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
