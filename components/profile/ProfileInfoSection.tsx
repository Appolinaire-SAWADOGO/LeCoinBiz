import { useAppTheme } from "@/hooks/useAppTheme";
import { CornerDownRight, MapPin, Star } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../custom/AppText";

export default function ProfileInfoSection() {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* left */}
      <View>
        <AppText style={styles.name} fontSize={24} font={"Bold"}>
          sawadogo appolinaire
        </AppText>
        <View style={styles.flex}>
          <Star fill={"#000"} width={13} height={13} />
          <AppText fontSize={14}>4.8</AppText>
          <AppText fontSize={14} color={designSystem.colors.subText}>
            (115 Reviews)
          </AppText>
        </View>
        <View style={styles.flex}>
          <MapPin color={designSystem.colors.bigText} width={15} height={15} />
          <AppText fontSize={14}>Ouagadougou, Burkina</AppText>
        </View>

        <View style={styles.flex}>
          <CornerDownRight width={15} height={15} />
          <AppText>146 Annonces</AppText>
        </View>
      </View>

      <Image
        source={{
          uri: "https://th.bing.com/th/id/OIP.xgNLD1HTbMi9ws5ge3mAVwHaEb?w=271&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3",
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
