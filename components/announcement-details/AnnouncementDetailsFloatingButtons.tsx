import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnnouncementDetailsFloatingButtonsCard from "./AnnouncementDetailsFloatingButtonsCard";

export default function AnnouncementDetailsFloatingButtons({
  from,
  status,
}: {
  from: "OtherPage" | "ProfilePage";
  status?: "inSell" | "disabled";
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
      {from === "OtherPage" && (
        <>
          <AnnouncementDetailsFloatingButtonsCard useCase="watsApp" />

          <AnnouncementDetailsFloatingButtonsCard useCase="sms" />

          <AnnouncementDetailsFloatingButtonsCard useCase="call" />
        </>
      )}

      {from === "ProfilePage" && status === "inSell" && (
        <>
          <AnnouncementDetailsFloatingButtonsCard useCase="edit" />

          <AnnouncementDetailsFloatingButtonsCard useCase="disable" />
        </>
      )}

      {from === "ProfilePage" && status === "disabled" && (
        <>
          <AnnouncementDetailsFloatingButtonsCard useCase="edit" />

          <AnnouncementDetailsFloatingButtonsCard useCase="enable" />

          <AnnouncementDetailsFloatingButtonsCard useCase="delete" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
});
