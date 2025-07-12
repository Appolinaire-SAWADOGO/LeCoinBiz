import { useAppTheme } from "@/hooks/useAppTheme";
import { SquarePen, Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function AnnouncementReviewRatingSummarySection({
  setAddReviewsModalOpen,
}: {
  setAddReviewsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={[
        styles.rating,
        { borderBottomColor: designSystem.colors.inputBorder },
      ]}
    >
      <View style={styles.rateBlock}>
        <Star fill={"#000"} width={14} height={14} />
        <AppText font="Medium" fontSize={14}>
          4.8
        </AppText>
        <AppText fontSize={13} style={{ color: "#666" }}>
          (245 avis)
        </AppText>
      </View>
      <TouchableOpacity
        style={[
          styles.addReview,
          { backgroundColor: designSystem.colors.primary },
        ]}
        onPress={() => setAddReviewsModalOpen(true)}
      >
        <SquarePen color={"#fff"} width={14} height={14} />
        <AppText color={"#fff"} fontSize={13} font="Medium">
          Donner un avis
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  rateBlock: {
    flexDirection: "row",
    textAlign: "center",
    gap: 6,
  },
  addReview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
