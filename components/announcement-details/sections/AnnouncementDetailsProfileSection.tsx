import { DEFAULT_PROFILE_IMG } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { router } from "expo-router";
import { CornerDownRight, MapPin } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../custom/AppText";

export default function AnnouncementDetailsProfileSection({
  userData,
}: {
  userData: UserType & { adsCount: number };
}) {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`/(root)/MerchantProfile?userId=${userData.id}`)
      }
      style={styles.container}
    >
      <Image
        source={{
          uri: userData.image || DEFAULT_PROFILE_IMG,
        }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        {/* Nom */}
        <AppText
          font="Medium"
          fontSize={17}
          color={designSystem.colors.bigText}
          style={{ marginBottom: 2 }}
        >
          {userData.userName}
        </AppText>

        {/* Lieu et annonces */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={14} color={designSystem.colors.subText} />
            <AppText
              style={{
                fontSize: 12.9,
                color: designSystem.colors.subText,
                textTransform: "capitalize",
              }}
            >
              {userData.location.city}
            </AppText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <CornerDownRight size={14} color={designSystem.colors.subText} />
            <AppText
              style={{ fontSize: 13, color: designSystem.colors.subText }}
            >
              {userData.adsCount} Annonces
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
    width: "100%",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    objectFit: "cover",
  },
});
