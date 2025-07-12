import { useAppTheme } from "@/hooks/useAppTheme";
import { Star } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "./custom/AppText";

export default function ReviewCard() {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={[
        styles.commentBox,
        { borderColor: designSystem.colors.inputBorder },
      ]}
    >
      <View style={styles.commentHeader}>
        <View style={styles.commentAuthorBox}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.commentAuthorAvatar}
          />
          <View>
            <AppText font="Medium" fontSize={14} style={styles.commentAuthor}>
              James Bond
            </AppText>
            <AppText fontSize={12} color={designSystem.colors.subText}>
              22 May 2024
            </AppText>
          </View>
        </View>

        <View style={styles.commentRating}>
          <Star fill={"#000"} width={12} height={12} />
          <AppText fontSize={12}>4.5</AppText>
        </View>
      </View>

      <AppText
        fontSize={13}
        color={designSystem.colors.smallText}
        style={styles.commentText}
      >
        Très bon produit, exactement comme décrit. Livraison rapide et vendeur
        professionnel. Je recommande !
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  commentBox: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  commentAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentAuthorBox: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  commentAuthor: {
    fontSize: 15,
  },
  commentRating: {
    flexDirection: "row",
    gap: 4,
  },
  commentText: {
    lineHeight: 18,
    marginBottom: 8,
  },

  commentDate: {
    fontSize: 12,
    color: "#999",
  },
});
