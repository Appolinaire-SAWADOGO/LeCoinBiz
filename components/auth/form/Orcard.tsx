import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../../custom/AppText";

export default function Orcard() {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.orSeparator}>
      <View
        style={[
          styles.separator,
          { backgroundColor: designSystem.colors.inputBorder },
        ]}
      />
      <AppText fontSize={12} font="Bold" color={designSystem.colors.subText}>
        OU
      </AppText>
      <View
        style={[
          styles.separator,
          { backgroundColor: designSystem.colors.inputBorder },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orSeparator: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    marginBottom: 24,
  },
  separator: {
    flex: 1,
    height: 1,
  },
});
