import AppText from "@/components/custom/AppText";
import SimilarAnnoucements from "@/components/similar-annoucements.tsx/SimilarAnnoucements";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AnnouncementDetailsSimilarAdSection() {
  const { designSystem } = useAppTheme();
  return (
    <View style={styles.container}>
      <AppText
        fontSize={16}
        font="Bold"
        color={designSystem.colors.bigText}
        style={styles.title}
      >
        Annonces similaires
      </AppText>

      <SimilarAnnoucements />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    marginBottom: 10,
  },
});
