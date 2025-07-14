import { useAppTheme } from "@/hooks/useAppTheme";
import { Image } from "expo-image";
import { router } from "expo-router";
import { CornerDownRight, Heart, MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function UserCard() {
  const { designSystem } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push("/MerchantProfile")}
      style={[
        styles.card,
        {
          borderColor: designSystem.colors.inputBorder,
        },
      ]}
    >
      {/* Avatar */}
      <Image
        source={{
          uri: "https://randomuser.me/api/portraits/men/32.jpg",
        }}
        style={styles.avatar}
      />

      {/* Infos */}
      <View style={styles.info}>
        <AppText
          color={designSystem.colors.bigText}
          font="Bold"
          fontSize={16}
          style={styles.name}
        >
          Appolinaire Sawadogo
        </AppText>

        <View style={styles.row}>
          <MapPin size={14} color={designSystem.colors.icon} />
          <AppText fontSize={13}>Ouagadougou, Burkina Faso</AppText>
        </View>

        <View style={styles.row}>
          <CornerDownRight size={14} color={designSystem.colors.icon} />
          <AppText fontSize={13}>145 annonces publiees</AppText>
        </View>
      </View>

      {/* Action */}
      <TouchableOpacity style={styles.iconBtn}>
        <Heart
          size={19}
          color={designSystem.colors.primary}
          fill={designSystem.colors.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    // elevation: 3,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    paddingLeft: 6,
    height: "100%",
  },
});
