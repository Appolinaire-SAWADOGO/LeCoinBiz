import AppText from "@/components/custom/AppText";
import ReviewCard from "@/components/ReviewCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { ChevronRight, Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnnouncementDetailsReviewSection() {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.reviewsSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.ratingSummary}>
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
          <AppText style={styles.reviewsCount}>4.8 (124 avis)</AppText>
        </View>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() =>
            router.push("/(root)/(announcement)/AnnouncementReviewPage")
          }
        >
          <AppText fontSize={14} color={designSystem.colors.primary}>
            Tout voir
          </AppText>
          <ChevronRight
            width={15}
            height={15}
            color={designSystem.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Avis récent */}
      <ReviewCard />
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewsCount: {
    fontSize: 14,
    marginLeft: 5,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
});
