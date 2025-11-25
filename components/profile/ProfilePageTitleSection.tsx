import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { router } from "expo-router";
import { Edit3 } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function ProfilePageTitleSection({ user }: { user: UserType }) {
  const { designSystem } = useAppTheme();

  return (
    <View
      style={{
        marginTop: 24,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AppText font="Bold" color={designSystem.colors.bigText} fontSize={28}>
        Profile
      </AppText>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/EditProfile",
            params: { user: JSON.stringify(user) },
          })
        }
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <AppText
          fontSize={15}
          font="Medium"
          color={designSystem.colors.subText}
        >
          Modifier
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
