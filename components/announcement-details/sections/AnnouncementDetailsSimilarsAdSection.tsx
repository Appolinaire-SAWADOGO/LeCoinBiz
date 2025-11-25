import AppText from "@/components/custom/AppText";
import SimilarAnnoucements from "@/components/similar-annoucements.tsx/SimilarAnnoucements";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AnnouncementType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AnnouncementDetailsSimilarsAdSection({
  data,
}: {
  data: AnnouncementType[];
}) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      <AppText
        fontSize={16}
        font="Medium"
        color={designSystem.colors.bigText}
        style={styles.title}
      >
        Annonces similaires
      </AppText>

      <SimilarAnnoucements data={data} style={{ paddingHorizontal: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -20,
    paddingVertical: 16,
  },
  title: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});
