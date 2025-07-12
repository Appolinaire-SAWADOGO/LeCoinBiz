import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { Edit } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function ProfilePageTitleSection() {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={{
        marginTop: 24,
        paddingHorizontal: 20,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AppText font="Bold" color={designSystem.colors.bigText} fontSize={28}>
        Profile
      </AppText>
      <TouchableOpacity
        onPress={() => router.push("/(root)/EditProfile")}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Edit size={16} color={designSystem.colors.primary} />
        <AppText
          fontSize={14}
          font="Medium"
          color={designSystem.colors.primary}
        >
          Modifier le profile
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
