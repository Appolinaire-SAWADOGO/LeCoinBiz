import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsPublicationReportingSection() {
  const { designSystem } = useAppTheme();
  return (
    <View style={styles.reportSection}>
      {/* <TouchableOpacity style={styles.reportButton}> */}
      {/* <ThumbsDown
          size={16}
          color="#ff3b30"
          fill={"#ff3b30"}
          style={{ marginRight: 8 }}
        /> */}
      {/* <AppText fontSize={14} style={styles.reportText}>
          Signaler cette publication
        </AppText>
      </TouchableOpacity> */}

      <TouchableOpacity>
        <AppText
          font="Medium"
          fontSize={15}
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
    // marginVertical: 20,
    // marginTop: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.02)",
    // padding: 16,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderTopWidth: 1,
    // borderColor: "#eee",
    // borderBottomWidth: 1,
  },

  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  reportText: {
    color: "#ff3b30",
    fontSize: 14,
    fontWeight: "500",
  },
});
