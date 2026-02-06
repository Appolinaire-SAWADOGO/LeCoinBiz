import { useAppTheme } from "@/hooks/useAppTheme";
import { UserType } from "@/types";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../custom/AppText";

export default function ProfileTitleSection({ user }: { user: UserType }) {
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
          router.navigate({
            pathname: "/(root)/EditProfile",
            params: { user: encodeURIComponent(JSON.stringify(user)) },
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
