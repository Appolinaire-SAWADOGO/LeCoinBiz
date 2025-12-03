import { useReportAd } from "@/hooks/services/ads/useReportAd";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsPublicationReportingSection({
  adId,
  adUserId,
}: {
  adId: string;
  adUserId: string;
}) {
  const { reportAd } = useReportAd();

  const { designSystem } = useAppTheme();
  return (
    <View style={styles.reportSection}>
      <TouchableOpacity onPress={async () => await reportAd(adId, adUserId)}>
        <AppText
          fontSize={15}
          font="Medium"
          color={designSystem.colors.subText}
        >
          Signaler cette annonce
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  reportSection: {
    alignItems: "center",
  },
});
