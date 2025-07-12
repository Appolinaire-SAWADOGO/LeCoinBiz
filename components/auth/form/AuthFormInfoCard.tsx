import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";
import InfoDynSvg from "../../svg/InfoDynSvg";

export default function AuthFormInfoCard({ label }: { label: string }) {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.infoCard}>
      <InfoDynSvg />
      <AppText fontSize={12} color={designSystem.colors.smallText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 8,
    backgroundColor: "#DEE0E4",
    height: 62,
    marginBottom: 24,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
