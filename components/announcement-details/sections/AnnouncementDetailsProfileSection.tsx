import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { CornerDownRight, MapPin } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsProfileSection() {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(root)/MerchantProfile")}
      style={styles.container}
    >
      <Image
        source={{
          uri: "https://th.bing.com/th?id=ORMS.c1a749eb05c5e925f3a386c2188c5295&pid=Wdp&w=612&h=304&qlt=90&c=1&rs=1&dpr=1.25&p=0",
        }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        {/* Nom */}
        <AppText
          font="Bold"
          fontSize={17}
          color={designSystem.colors.bigText}
          style={{ marginBottom: 2 }}
        >
          Sawadogo Appolinaire
        </AppText>

        {/* Lieu et annonces */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={14} color={designSystem.colors.subText} />
            <AppText
              style={{ fontSize: 13, color: designSystem.colors.subText }}
            >
              Ouagadougou
            </AppText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <CornerDownRight size={14} color={designSystem.colors.subText} />
            <AppText
              style={{ fontSize: 13, color: designSystem.colors.subText }}
            >
              140 annonces
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "rgba(0,0,0,0.02)",
    marginTop: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderColor: "#eee",
    borderTopWidth: 1,
    // borderWidth: 1,
    // borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    objectFit: "cover",
  },
});
