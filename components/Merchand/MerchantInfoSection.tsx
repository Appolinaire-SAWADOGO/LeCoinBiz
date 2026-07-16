import { DEFAULT_PROFILE_IMG } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { getUserAccountTimeSinceCreated } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

export default function MerchantInfoSection({
  data,
  adsCount,
}: {
  data: UserType;
  adsCount: number;
}) {
  const { designSystem } = useAppTheme();

  // console.log(data.location);

  const capitalize = (str?: string | null): string => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <View style={styles.container}>
      <View>
        <AppText
          color={designSystem.colors.bigText}
          style={styles.name}
          fontSize={24}
          font={"Bold"}
        >
          {data.userName}
        </AppText>

        <View style={styles.flex}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            color={designSystem.colors.bigText}
            size={17}
          />
          <AppText>
            {capitalize(data.location.city)},{" "}
            {capitalize(data.location.country)}
          </AppText>
        </View>

        <View style={styles.flex}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={16}
            color={designSystem.colors.bigText}
          />
          <AppText>{adsCount} Annonces</AppText>
        </View>

        <View style={styles.flex}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={designSystem.colors.bigText}
          />
          <AppText>{getUserAccountTimeSinceCreated(data.createdAt)}</AppText>
        </View>
      </View>

      <Image
        source={{
          uri: data.image || DEFAULT_PROFILE_IMG,
        }}
        style={styles.img}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 8,
  },
  flex: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
    alignItems: "center",
  },
  name: {
    width: 180,
    marginBottom: 12,
    textTransform: "capitalize",
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
