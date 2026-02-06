import { useReportAd } from "@/hooks/services/ads/useReportAd";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useVerifyEmailStore } from "@/store/useVerifyEmailStore";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsPublicationReportingSection({
  adId,
  adUserId,
  emailVerified,
  currentUserAuthMethod,
}: {
  adId: string;
  adUserId: string;
  emailVerified: boolean;
  currentUserAuthMethod: string | undefined;
}) {
  const { reportAd } = useReportAd();

  const { designSystem } = useAppTheme();

  const { open: openVerifyEmailModal } = useVerifyEmailStore();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <View style={styles.reportSection}>
      <TouchableOpacity
        onPress={async () => {
          if (currentUserAuthMethod === "password" && !emailVerified) {
            openVerifyEmailModal();
            return;
          }

          setIsLoading(true);

          await reportAd(adId, adUserId);

          setIsLoading(false);
        }}
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.5 : 1 }}
      >
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
