import AppInput from "@/components/custom/AppInput";
import AppText from "@/components/custom/AppText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AppMobileNumberInput() {
  const { designSystem } = useAppTheme();

  return (
    <View style={styles.mobileNumberInputs}>
      <View
        style={[
          styles.mobileNumber,
          { borderColor: designSystem.colors.inputBorder },
        ]}
      >
        <AppText font="Medium" fontSize={12}>
          +226
        </AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppInput placeholder="xxxxxxxx" model="withBorder" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileNumberInputs: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  mobileNumber: {
    width: 70,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
