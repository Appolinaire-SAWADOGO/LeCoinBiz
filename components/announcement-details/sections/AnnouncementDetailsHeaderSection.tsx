import AddAdFavoriteButton from "@/components/favorites/AddAdFavoriteButton";
import PageHeader from "@/components/PageHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AdStatusType } from "@/types";
import { Share2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnnouncementDetailsHeaderSection({
  from,
  status,
  name,
  adId,
}: {
  from: "OtherPage" | "ProfilePage";
  status?: AdStatusType;
  name?: string;
  adId: string;
}) {
  const { designSystem } = useAppTheme();

  return (
    <PageHeader style={{ paddingHorizontal: 20 , paddingTop: 15}} name={name}>
      <View style={styles.rightIcons}>
        {from === "OtherPage" && (
          <AddAdFavoriteButton adId={adId} fromAnnouncementCard={false} />
        )}

        {status === "ACTIVATED" && (
          <TouchableOpacity hitSlop={10}>
            <Share2 size={20} />
          </TouchableOpacity>
        )}
      </View>
    </PageHeader>
  );
}

const styles = StyleSheet.create({
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
