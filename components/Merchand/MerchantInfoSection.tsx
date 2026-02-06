import { DEFAULT_PROFILE_IMG } from "@/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { getUserAccountTimeSinceCreated } from "@/utils";
import { CalendarClock, CornerDownRight, MapPin } from "lucide-react-native";
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
          <MapPin color={designSystem.colors.bigText} width={15} height={15} />
          <AppText>Ouagadougou, Burkina</AppText>
        </View>

        <View style={styles.flex}>
          <CornerDownRight width={15} height={15} />
          <AppText>{adsCount} Annonces</AppText>
        </View>

        <View style={styles.flex}>
          <CalendarClock
            color={designSystem.colors.bigText}
            width={15}
            height={15}
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
