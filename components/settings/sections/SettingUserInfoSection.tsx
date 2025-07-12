import { useAppTheme } from "@/hooks/useAppTheme";
import { UserRound } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";

export default function SettingUserInfoSection() {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.userInfo}>
      <View style={styles.userInfoLeft}>
        <AppText
          font="Bold"
          fontSize={22}
          color={designSystem.colors.smallText}
        >
          Hello, Appolinaire
        </AppText>
        <AppText color={designSystem.colors.subText} fontSize={13}>
          sawadogoappolinaire06@gmail.com
        </AppText>
      </View>
      <UserRound width={52} height={52} fill={"#313131"} stroke={"#313131"} />
    </View>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfoLeft: {
    gap: 4,
  },
});
